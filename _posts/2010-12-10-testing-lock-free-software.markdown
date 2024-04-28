---
author: rlc
comments: true
date: 2010-12-10 03:53:05+00:00
layout: post
title: Testing Lock-Free Software
wordpress_id: 1142
categories:
  - Software Development
  - Software Engineering
tags:
  - lock-free
  - Posts that need to be re-tagged (WIP)
  - software
---

When a test has been running non-stop for over six months, beating the heck out of an algorithm, can we be confident the algorithm is OK?

<!--more-->

One of the pieces of software I am working on is a logging mechanism for a distributed system. The logging mechanism is based on the _Agelena_ module of my _Arachnida_ embeddable HTTP(S) server and client, but goes farther than it does w.r.t. flexibility and speed. At its core, there is a module called _**hsl**: High-Speed Logging_ which consists of a multi-producer single-consumer queue that is optimized for this purpose.

This particular queue - or rather, set of queues - has a particular set of caveats which makes it a bit different from my previous implementations of lock-free queues, so I devised a set of tests for it to check that it really works under all circumstances. The problem is the "all" in that statement.

In lock-free programming, it can be very difficult to prove your algorithms formally and, even if you succeed in proving it formally, it is still difficult to prove the _implementation_ of the algorithm empirically. To do that, you ultimately end up testing your implementation.

Testing an implementation of a lock-free algorithm is a question of searching for errors in it, which is often a question of searching a combination of interlacing threads that results in erroneous behavior. One excellent tool for doing that is [Relacy](http://groups.google.com/group/relacy). Relacy is usually extremely quick at finding errors: in the implementation of hsl, I had introduced two bugs - both of which points where the implementation inadvertently differed from the algorithm. Relacy found them both in a matter of milliseconds. However, testing all possible combinations for a mildly complex algorithm can taken a very long time.

HSL has now been running on one of my computers for over six months. I have devised a formal proof of the algorithm and verified the implementation against the algorithm manually a few times already. Is there such a thing as bug-free software?
