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

A good example is symmetric cryptography: Grover's algorithm allows a quantum computer to find symmetric keys with a certain probability, depending on the key's size. It effectively cuts the effective size of the key in half: a 128-bit symmetric key is only as strong with a quantum computer, as a 64-bit symmetric key is without one. With a fairly run-of-the-mill computer, it would take about two days to do that using a brute-force attack. 256-bit symmetric keys are generally considered "safe" from classical computers. Adding a quantum computer implementing Grover's algorithm to the mix, 512-bit symmetric keys are just as safe in ten years as 256-bit symmetric keys are today.

That is, essentially, what quantum resistance is about: we need to reach a way to implement these use-cases in such a way that we have a workable work-around for when quantum computers become widely available to the "bad guys".

Among quantum-resistant asymmetric algorithms, we currently have the Supersingular Isogeny Diffie-Hellman key exchange, SIDH. It's a bit different from classic Diffie-Hellman (DH) and Elliptic Curve Diffie-Hellman (ECDH) in that the parties basically generate public keys which they need to exchange along with the message

* what we have: (SIDH)
* the search for a quantum-resistant RSA alternative

## What we can build on DH

* one-to-one encryption using SIDH + HKDF + AEAD AES
* one-to-one signing using SIDH + HKDF + HMAC

## What we can't build on DH: PKI

* explain how PKI works
* explain that you only need the CA's public key, **and they don't need yours**
* explain the banking use-case

## Conclusion: we need a quantum-resistant DSA

* what it is
* what it is

