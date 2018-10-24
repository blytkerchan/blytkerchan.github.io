---
author: rlc
comments: true
date: 2015-09-04 01:08:33+00:00
layout: post
permalink: /blog/2015/09/cis-protecting-code-in-stead-of-data/
slug: cis-protecting-code-in-stead-of-data
title: 'CIS: "Protecting" code in stead of data'
wordpress_id: 3236
categories:
- Common Issues with Synchronization
tags:
- locking
- synchronization
---

The Windows API contains a synchronization primitive that _is_ a mutual exclusion device, but is also a colossal misnomer. I mean, of course, the `CRITICAL_SECTION`.

<!--more-->

The "critical section" describes a piece of code that accesses a shared resource -- shared between threads or processes. While such code should be analyzed and well-understood, and is indeed critical in a sense, it's the _data_ that needs to be protected from concurrent access, _if necessary_.

Much confusion has arisen from the name `CRITICAL_SECTION`: more than once, I've seen them being used to "protect" the code itself, rather than the data.

Using a `ScopedLock` class, such as the following, does two things:


  1. the class' name makes it clear that it's a lock, so something needs locking
  2. it takes care of exception-safety and prevents lock leaks


(Of course, a POSIX version of the same class does the same thing, but the POSIX mutex is better named).



A more elaborate solution would be to create a `Mutex` class to encapsulate the `CRITICAL_SECTION`, allowing newbies to google for "mutex"...
