---
author: rlc
categories:
- Physics
- Technology
- Science
- Quantum Teleportation
- TCP/IP
- Networking
comments: true
date: 2010-05-26 23:08:22+00:00
layout: post
title: Quantum teleportation achieved over 16 km
wordpress_id: 661
---

Recently, in [this report](http://www.physorg.com/news193551675.html), it's been reported that a physics laboratory in China achieved a new distance record in quantum teleportation: 16 km. That's quite a feat, considering that up until now, the max. distance had been a few hundred meters.

<!--more-->

While working on a project with a team in the US, I was monitoring a system (before debugging it) that failed in a part that I wasn't going to debug, involving a TCP/IP error. I quipped that "unless [they] are using TCP over quantum teleportation, the Heisenberg uncertainty principle doesn't apply here" (i.e. it didn't just break because I was looking at it). That got me thinking: how feasible would it be to implement TCP/IP over quantum teleportation, with the current state of affairs?

The answer is: completely infeasible. Here's why:

To be moderately useful, an average TCP packet - say about 512 bytes in size (plus the TCP/IP/Ethernet overhead) should have at least a 75% chance of arriving to its destination. 75% is pretty bad, considering that that means that one in four packets would be re-transmitted at least once, but I did say "moderately useful". That means that each bit in the package would have to have a change of at least 99.994% of arriving: you'd have to be able to send the Ethernet pre-amble (8 bytes), followed by a 64-byte Ethernet header, followed by a 20-byte (minimum) IPv4 header, followed by a 20-byte (minimum) TCP header, which is an overhead of 112 bytes (not counting the 12-byte inter-frame gap mandated for Ethernet), so to get to 99.994%, you apply this formula ![P = \sqrt[\frac{1}{8(B + O)}]{0.75}](/assets/2010/LQYQP16NTCIpWMGRdJa9ghmGz106S5u18YcjY2X5xzE0.svg) in which P is the required probability for a single bit, B is the size of the message in bytes (octets) and O is the size of the overhead in bytes (octets). With B = 512 and O = 112, P comes out as 0.99994 - 99.994%.

In [the article](http://www.physorg.com/news193551675.html), they reported an 89% accuracy for teleporting a quantum state. If we equate the quantum state to a bit, we can see immediately that that is well below the 99.994% target.

So, how good are the chances of a TCP packet reaching its destination? How far are we from the target that three out of four reaches the destination intact? Well, for a packet to reach the destination intact, each and every one of the bits in the packet has to reach its destination. With each bit having a probability _p_ of arriving, the packet's chances _P_ are ![P = p^{8(B + O)}](/assets/2010/FdvMKqtkdC2vuGFIh8AFM228h4Zz86mnPTgiDF5oGm5V.svg). With B = 512 and O = 112, that makes ![P = 0.89^{8(512 + 112)}](/assets/2010/0FZxkwrVFFKy9JSjWneBlsd4swG8Tjbyy1vugPdNE1yA.svg) which is ![2.264 * 10^{-253}](/assets/2010/YdNsgH43Oy0tmteivY5z4bGaQnsRC6dgJzkx1EB1NnLB.svg) or, in english, a change of 4 in 1,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000 (that's a one with 252 zeroes).

That's pretty slim!