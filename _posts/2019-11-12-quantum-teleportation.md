---
author: rlc
categories:
- Quantum Computing
- Teleportation
- Star Trek
- Physics
- Sci-fi
comments: true
date: 2019-11-12
layout: post
slug: quantum-teleportation
title: Quantum teleportation
---

A bit more fun with quantum computing...

Quantum teleportation is one of those things that Star Trek fans (like myself) like to believe is a dream come true: if it's possible to teleport qubits, surely it may be possible to teleport real-world things some day?
<!--more-->
![Quantum teleportation circuit](/assets/2019/11/teleportation.png)

The image above shows the "classical" circuit for quantum teleportation, preceded by some test circuitry to set the first qubit to a known state (`|1>`, in this case) and followed by a measurement of the target qubit.

The interesting part, of course, is in the middle. Imagine for a moment you're next to Captain Kirk, just when he says "Beam me up, Scotty", and you get to observe the circuit above in action. Up on the Enterprise, three redundant Heisenberg compensators are humming away while a confinement beam is being sent down to scan the Captain. This is where physics takes over.

The Enterprise transporter now has a number of things to do. The first is to count the number of quantum states that make up the Captain. For each of those quantum states, or qubits, another pair of qubits has to be entangled up in the Enterprise and one of those entangled qubits has to be sent down to the Captain. Those qubits (`q[1]` in the figure, the Captain is `q[0]`) are then entangled with the Captain's qubits after which we thoroughly destroy the Captain, measuring and collapsing his qubits and the qubits we just sent down and entangled with him. This gives us two bits of data for each of the Captain's qubits, which we send back up to the Enterprise. The Enterprise transporter then uses those two bits to determine which transforms to apply to the qubits that remained on the Enterprise, reconstituting the Captain.

Now, the questions is where we get the energy. Captain Kirk may actually have had it right when he said that "matter is converted to energy, and the back to matter again": the qubits may just be the configuration of the matter, including all the quantum superpositions of whatever states we hold. This is where we're back in sci-fi country...

Two things are crystal clear, though: on the one hand, a vast number of qubits would be necessary to pull this off, and on the other hand, it would really be teleportation, as the no cloning theorem tells us that we cannot clone this information.

That also means no Tom Riker...