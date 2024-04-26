---
author: rlc
comments: true
date: 2019-11-03
layout: post
slug: first-quantum-results
title: My first results with quantum computing experiments
---
I ran two quantum circuits on two real quantum computers and one simulator. I'll share my results and some observations.
<!--more-->
Quantum computing promises enormous innovations for the future, in fields ranging from cryptography (mostly bad news) to medicine and biology (mostly good news). In order to make good on those promises, we need stable, predictable results from stable, predictable quantum computers.

IBM and Google have both been working on quantum computers for a while now, and IBM has quantum computers available in a cloud service. That gave me an opportunity to run a quantum circuit on a real quantum computer, and see how error-prone the computer really is.

I ran two circuits that should both give the same results: the first, shown below, is a Hadamard gate followed by a CNOT, followed by two rotations along the Z axis.
![Figure 1: the first circuit](/assets/2019/11/circuit-1.png)

The Hadamard followed by the CNOT is the easiest way to entangle two photons: the Hadamard gate puts the first qubit in a superposition between `|0>` and `|1>`, with a probability amplitude of `1/sqrt(2)` and the CNOT flips the second qubit so it's entangled with the first one. The Rz gate effectively doesn't do anything to the end result, but I used it to see if more operations (even effective no-ops) added more errors.

My second circuit, shown below, is identical except for the unneeded Rz gate:
![Figure 2: the second circuit](/assets/2019/11/circuit-2.png)

Both circuits should have a 50% chance of outputting two zeroes and a 50% chance of outputting two ones, but should never output anything else. On the simulator, this is pretty much what happened: I had a 49.023% chance of two zeroes and a 50.977% chance of two ones. The 0.977% error can be attributed to the pseudo random number generator used by the simulator, and rounding errors on the classical computer it runs on. Each circuit was run 1024 times on each computer used.

| Circuit   | Computer           |      00 |     01 |     10 |      11 |
| --------- | ------------------ | ------- | ------ | ------ | ------- |
| Circuit 2 | Simulator          | 49.023% |     0% |     0% | 50.977% |
| Circuit 2 | Quantum computer 1 | 43.164% | 1.563% | 0.586% | 54.688% |
| Circuit 2 | Quantum computer 2 | 47.754% | 3.223% | 2.344% | 46.680% |
| Circuit 1 | Quantum computer 1 | 45.508% | 0.977% | 1.855% | 51.660% |

The simulator was the closest to the theoretically expected results, with a 0.977% error and no unexpected results. This shows that the quantum circuit should behave as expected, within some margin of random noise.

Quantum computer 2 had the biggest error, with a total of 5.567% of completely unexpected results, and more `|11>`s and fewer `|00>`s than expected. I didn't run circuit 1, with the extra gate, on this computer.

Adding the Rz gate appears to introduce more errors: with the extra gate in place, 2.832% of the results were unexpected.

Removing the Rz gate reduced the unexpected results to 2.149%, but also increased the over-shoot of `|11>`s to 4.688% more than expected.

Perhaps this model of quantum computer has a preference for `|1>`s?