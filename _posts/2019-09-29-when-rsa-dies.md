---
author: rlc
comments: true
date: 2019-09-29 12:32:00-04:00
layout: post
slug: when-rsa-dies
title: When RSA dies
---
IBM will [soon launch](https://techcrunch.com/2019/09/18/ibm-will-soon-launch-a-53-qubit-quantum-computer/) a 53-qubut quantum computer available as a cloud service, alongside five 20-qubit quantum computers. Google already has a number of quantum computers that they've been using in AI research. Their [publication database](https://ai.google/research/pubs/) has such gems as [A 28nm Bulk-CMOS 4-to-8GHz \<2mW Cryogenic Pulse Modulator for Scalable Quantum Computing](https://ai.google/research/pubs/pub47965), which describes an integrated circuit used to control qubits (which operate at extremely low temperatures, which comes with its own challenges. The goal here is to reduce the number of qubits required for error correction by improving the classic components of the quantum computer that control the qubits).

Quantum computing technologies are advancing by leaps and bounds (or at least, they seem to be). This has led some to [speculate](https://quantumcomputingreport.com/our-take/applying-moores-law-to-quantum-qubits/) that we may be able to apply Moore's law to quantum computing, as we've done for classical computing. If that is the case, and provided we (humanity) find a way to:

1. attain quantum supremacy with more generally applicable algorithms
2. improve the error-corrected-qubit-to-physical-qubit ratio significantly
3. build a 4000-effective-qubit universal quantum computer, and
4. implement Shor's algorithm

RSA will be dead.

The question then becomes: "what are the consequences when RSA dies?"
<!--more-->
## Asymmetric Cryptography and its use-cases

There are basically two types of asymmetric cryptography, which covers three distinct use-cases. In each case, Alice wants to send a message to Bob and wants to make sure that:

1. only Bob can read the message (Confidentiality, Authorization)
2. Bob can make sure it was Alice who sent the message (Authentication)
3. if Bob receives the message, he can read it (Availability)
4. Bob can verify that the message arrives to him unaltered (Integrity), and
5. Alice can't deny she sent the message (Non-Repudiation)

RSA implements these as follows:

1. if Alice encrypts the message using Bob's public key, only Bob can read the message (Confidentiality, Authorization)
2. if Alice signs the message using her own private key, Bob can verify the signature using Alice's public key (Authentication)
3. if Bob receives the message, no further communication with Alice is necessary to read and verify it: Bob only needs his own private key, which he must already have, and Alice's public key, which is public and may therefore be widely distributed (Availability)
4. Alice signs the message by calculating a cryptographic hash over the message, and encrypting that with her private key. Bob verifies this by calculating the cryptographic hash over the message as well. If the two hashes match, the message must be unaltered (Integrity)
5. Only Alice has her private key, so only she can have signed the message using it. She can't deny having done that unless she claims she's lost control over her private key, in which case Authentication and Integrity also fall. (Non-Repudiation)

DH implements these as follows:

1. Alice uses her own private key and Bob's public key to generate a shared symmetric key, which she uses to encrypt the message. She can still decrypt the message herself, but other than her, only Bob can decrypt it by generating the same shared symmetric key using Alice's public key and his own private key. The Confidentiality and Authorization guarantees are weaker, because they now include Alice, but not significantly so (because Alice already had access to the cleartext message).
2. Alice uses either an authenticating symmetric cipher (e.g. an AEAD-mode AES cipher) or generates an HMAC using a second shared key. Bob can verify this either by successfully decrypting the message using the authenticating cipher, or by generating the same HMAC. The Authentication guarantee is essentially the same as it was with RSA, although Alice now needs Bob's public key to implement it (which she didn't need before).
3. as with RSA, Bob only needs his own private key and Alice's public key to decrypt and verify the message. Availability is uaranteed at the same level as with RSA.
4. as with RSA, the Authentication method used guarantees Integrity as well. The guarantee is the same as with RSA, although Alice now needs Bob's public key to implement it (which she didn't need before).
5. While only Alice has her private key, and only Bob has his private key, the keys used for both encryption and verification are symmetric: anyone who has those keys can perform those operations, including Bob. If Bob is malicious, he can therefore perform the actions of encrypting and signing the message while pretending to be Alice. Alice has no way of repudiating this without blaming Bob, and vice-versa. The Non-Repudiation guarantee is inherently weaker than it is with RSA.

Note the caveat for Authentication and Integrity: *in order to implement these with DH, the signer of the message (or object) needs the verifier's public key*. We'll get back to this caveat shortly: it's important.

## Quantum resistance

Quantum resistance is a property of an algorithm that makes it *not significantly less difficult* to break with a quantum computer than it is to break the same with a classical computer. This all hinges on the word "significant": it *may* be less difficult to break the algorithm with a quantum computer (or with the help of a quantum computer), but not usefully so.

A good example is symmetric cryptography: Grover's algorithm allows a quantum computer to find symmetric keys with a certain probability, depending on the key's size. It effectively cuts the effective size of the key in half: a 128-bit symmetric key is only as strong with a quantum computer, as a 64-bit symmetric key is without one. With a fairly run-of-the-mill computer, it would take about two days to guess such a key using a brute-force attack. 256-bit symmetric keys are generally considered "safe" from classical computers. Adding a quantum computer implementing Grover's algorithm to the mix, 512-bit symmetric keys are just as safe in ten years as 256-bit symmetric keys are today.

That is, essentially, what quantum resistance is about: we need to reach a way to implement these use-cases in such a way that we have a workable work-around for when quantum computers become widely available to the "bad guys".

### Quantum-resistant Diffie-Hellman

Among quantum-resistant asymmetric algorithms, we currently have the Supersingular Isogeny Diffie-Hellman key exchange, SIDH. SIDH is different from regular Diffie-Hellman and from Elliptic Curve Diffie-Hellman in several ways.

**You can skip the next four paragraphs without losing anything important**

In Diffie-Hellman, the public parameters of the exchange are a modulus **p** and a generator **g**, and the public key is **g** raised to some (secret) power, modulo **p**. These are all numbers. The generator can be small, but **p** and the secret exponent are usually big numbers. Diffie-Hellman depends on the fact that computers have a hard time finding the power to which you raised something, especially if the value is modulo some large prime (the *discrete logarithm problem*).

Elliptic Curve Diffie-Hellman is very similar: Alice and Bob agree on a curve to use. Each chooses a random point on that curve as their private key, and a public point on the curve that is the private point multiplied by some public multiplier. Finding the shared secret relies on the commutative property of multiplication: if I have a secret value **a** and you have a secret value **b**, and we share a public value **c**, the I can give you **a * c** and you can give me **b * c** and we can come up with the same shared secret (**a * (b * c) == (a * c) * b**). The security of this scheme relies on the fact that it's much harder to divide than it is to multiply.

In both cases, the exchange uses what's called a *trapdoor function*: it's harder to find a discrete logarithm than it is to raise something to the power of something else in a finite field, and it's harder to multiply than it is to divide. For classical computers, it's a *hard problem* to get out of those trapdoors. These particular trapdoors, however, are something that quantum computers are very good at getting out of

SIDH is different in that it relies on the fact that functions can be composed, and it's harder to decompose functions than it is to compose them. The function in question is the isogeny: it's a function that maps every point on a given elliptic curve to another elliptic curve. In SIDH, the curve itself is the public key, while the (random) isogeny is the private key. For the key exchange to work, Alice and Bob need to exchange their public elliptic curves, and two points that are the result of applying the random, secret isogeny function to two points on the curve. Bob does the same thing: he sends Alice his public curve and two transformed points. Both Alice and Bob then construct new isogenies from the isogenies, curves and points they now have, use that isogeny to map the elliptic curves they now have to new elliptic curves and find the j-invariant of of those curves. Those j-invariants will be the same for both Alice and Bob, and are the shared secret.

**Continue reading here**

The important thing is that this allows you to have the same number of messages for a SIDH key exchange as you had for a DH or an ECDH key exchange. However, astute readers (the ones that didn't skip the last four paragraphs and actually understood what they were about) will notice that SIDH doesn't really allow for static public keys: to work correctly, both Alice and Bob need to choose a random nonce value that becomes part of the private key (the isogeny, the function that maps between curves). That means that the use-cases where static Diffie-Hellman keys were used don't work with SIDH. Researches at the Florida Atlantic University and the University of Waterloo [have shown](http://www.site.uottawa.ca/~cadams/papers/prepro/paper_31.pdf), however, that if you do a large number of these simultaneously (8,464 times, to be exact) you can thwart an attacker under some conditions. Finding a good quantum-resistant RSA alternative to sign the public keys with is probably a better avenue, though.

### Quantum-resistant RSA alternatives

There are currently no viable quantum-resistant alternatives for RSA. While [one paper](https://link.springer.com/chapter/10.1007/978-3-319-59879-6_18) argues that it's possible to use RSA with carefully chosen parameters such that cracking it remains more expensive than legitimate use, 1-Terabyte keys are hardly viable.

[The search is on](https://csrc.nist.gov/projects/post-quantum-cryptography/round-2-submissions), however: the first round of NIST's Post-Quantum-Cryptography project closed with its [final report](https://doi.org/10.6028/NIST.IR.8240) in January of this year, and kicked off the second round at the same time. The secind NIST PQC Standardization Conference took place in Santa Barbara last August, and they're still hoping to reach a viable solution (with 26 remaining candidates for algorithms divided among each of the three categories) by 2022. That's down from 69 candidates for the first round (out of 82 submissions, five of which withdrew, with the other eight being rejected).

Some of these algorithms have significant drawbacks, ranging from enormous keys to hard-to-prove security. As Vadim Lyubashevsky pointed out (according to Jeremy Hsu in [his Spectrum post](https://spectrum.ieee.org/tech-talk/telecom/how-the-us-is-preparing-for-quantum-computings-threat-to-end-secrecy)), "The problem with cryptography in heneral is that cryptanalysis is an unrewarding process". Aiming for viable quantum-resistant alternatives for RSA by 2022 is, to say the least, ambitious.

## What we can build on DH


* Elgamal
* one-to-one encryption using SIDH + HKDF + AEAD AES
* one-to-one signing using SIDH + HKDF + HMAC

## What we can't build on DH: PKI

* explain how PKI works
* explain that you only need the CA's public key, **and they don't need yours**
* explain the banking use-case

## Conclusion: we need a quantum-resistant DSA

* what it is
* what it is

