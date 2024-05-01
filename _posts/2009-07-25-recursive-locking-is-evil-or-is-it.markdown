---
author: rlc
categories:
- Technology
- Programming
- Software Development
- Computer Science
comments: true
date: 2009-07-25 00:07:38+00:00
excerpt: 'recursive locking:

  winter''''s way of saying "yes",

  to summer''''s loud "no"

  '
layout: post
title: Recursive Locking Is Evil, or is it?
wordpress_id: 57
---

while perusing my different RSS streams today, I came across a discussion on [comp.programming.threads](http://groups.google.ca/group/comp.programming.threads/topics) - a group that is way too active for me to be able to participate in it anymore, but I still try to follow the discussions a bit through Google Group's RSS streams. The original discussion was on a book on POSIX threads, but it pointed to [a discussion on the use of recursive locks](http://groups.google.ca/group/comp.programming.threads/browse_thread/thread/05208d3770bd543e), and why it's an "evil" practice. [One message in particular](http://groups.google.com/group/comp.programming.threads/msg/990c60898cbc684f) struck me as very well-written, as it explains why we should use locks, and in what kind of cases.

On the practice of using recursive locks, the argument is basically that, in designing your application or library, you should know, _by design_, which locks are being used by what functions and you should therefore not need them. The evil-ness of recursive locks comes from the fact that, as you should know _by design_ when your locks are used, using them twice is a design flaw, which is hidden by the recursive lock. Also, as [David Schwartz](http://groups.google.com/groups/profile?hl=en&enc_user=6YRm_xQAAADlApK1NPVWjZocBkcK0BDiOPANdqfI6prRsqjc7uCt1A) pointed out, using recursive locks _may_ introduct bugs (actual incorrectness in the behavior of your program) when you unlock the lock in order to perform an operation that you cannot perform with the lock active. David made the first argument very eloquently throughout the discussion, which was kept alive by one poster who just wouldn't give up on the contrary argument, and made the second argument clearest (IMO) in [this post](http://groups.google.com/group/comp.programming.threads/msg/3be5dc9ab0b4f5e1?hl=en).

Personally, I have used recursive locks on several occasions - even when I didn't actually need them: in general, when presented with the trade-off between using recursive locks and using non-locking functions and functions that do lock, wrapping the non-locking functions, I have chosen to use recursive locks. _Mea culpa_. The reason for this has _**never**_ been that I didn't know who might or might not use the lock: I _**absolutely agree**_ that in any good design, the designer should be aware which paths use the locks in question, and recursive locks are therefore _**always**_ avoidable. I just never considered recursive locks as being evil.

The reason for this is simple: in the past seven years, in every team of programmers I have worked with, I have been considered _the_ export on threading and have almost always been the architect of anything thread-related. More often than not, anything that had anything to do with the synchronization of threads used a method that I designed that was applicable by even the most novice programmers of the team, or was implemented by myself in "write-only code", meaning that if any maintenance was to be done, it would either have to be done by me, or have to be a re-write. This has worked remarkably well - especially since maintenance on those write-only bits has almost never been necessary. I have therefore always had almost-complete control over the design and implementation of synchronization code, and have never run into the evils of recursive locking.

Reading the posts changed my mind, though. While that doesn't mean I'll return to all the code I've written in the past sixteen years or so, it does mean I'll avoid recursive locks from now on, and start preferring the wrapper/wrapped versioned functions that I traded them against.