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

TODO:
* RSA's use-cases: encryption and signing
* DH use-cases: key negotiation

## Quantum resistance

* what it is
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


