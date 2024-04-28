---
author: rlc
comments: true
date: 2012-08-02 17:04:20+00:00
layout: post
title: Plain and clear cases of "don't do that - fix your code in stead"
wordpress_id: 1913
categories:
  - C &amp; C++
  - Software Development
tags:
  - code
---

For the last few days, a [discussion](https://groups.google.com/forum/m/?fromgroups#!topic/comp.lang.c/YAuFFz7SmVc) (that has become heated from time to time) has been going on on the comp.lang.c usenet group. The subject is a "signal anomaly": the OP wants to catch SIGSEGV and carry on along its merry way.

<!--more-->

SIGSEGV is the POSIX way of saying "Access Violation": it means the program tried to access a resource (usually some memory) and really shouldn't have. When that happens, the program dies.

It's a bug.

In the OP's[^1] case, the bug was a clear case of programmer laziness:

[^1]: OP = Original Poster - the person who started the discussion

<blockquote>My code has a certain pointer that sometimes unexpectedly becomes null. 
It would be a lot of work to find every place the pointer gets 
dereferenced and add a null check. So I want to just ignore it by 
catching the signal.</blockquote>

but, as repeated over and over by many a poster on comp.lang.c, once a null pointer is dereferenced, the program is allowed to do anything. Crashing is really a very nice way of doing "anything". Trying to catch the signal and, without even attempting to fix the problem, simply continuing program execution is simply not an option.

The discussion actually forks into a few less amusing but more interesting parts on the use of signals in C, semantic differences between POSIX and the C standard, etc., but those are beside the point for the moment.

This discussion brought to mind a piece of code I came across about nine years ago: at the time, I was working on a calculation engine for an on-line banking program and had to interface with a few other components. Most of the data in the engine was passed around in the form of a DOM, or something very similar to it, but some data was passed around in a variety of other forms. The whole thing painfully lacked structure, to the point that the code, at some point, lost track of the type of structure it was hoisting its data around in.

An example of such could would look like this:

    void someFunction(Container *container) { ... }
    void someFunction(DOM *dom) { ... }
    void someOtherFunction(void *data) { ... }

in which one of the versions of `someFunction` eventually calls someOtherFunction with its data, no longer preserving the type of the data.

This is bad enough, of course, but it gets worse.

At some point in `someOtherFunction`, useful information had to be extracted from the data (some kind of conversion rate or somesuch was buried in the data somewhere). In order to do that, here's what the code did:

    __try {
        extractFromDOM((DOM*)data);
    }
    __except(1) {
        extractFromContainer((Container*)data);
    }

At run-time, this meant casting the data to a DOM, passing it to MSXML and crossing your fingers. If MSXML crashed (which it did at least once every three times this was attempted), the access violation was caught -- the code basically said "oops, that wasn't a `DOM` - maybe it's a `Container`!"

I found this code when, while debugging another part of the software, an access violation occurred and stopped my debugger. When I went to see the programmer who was responsible for the code in question, his first reaction was to shrug it off: the code worked. Trying to convince him otherwise proved futile.

Those are plain and clear cases of broken code. However, in very, very rare cases, there may be no other way to know whether something is where you think it ought to be, than to look. One such case comes to mind: some CPUs have an external counter, called an HPET, while others don't. Usually, you can find out whether the HPET is there by reading some registers somewhere, but I recently came across two chipsets, one of which had the HPET while the other one didn't, that didn't advertise the presence or absence of the HPET in any way the software could see -- or the documentation told me about. Reading at address where the HPET should be caused an Access Violation if the HPET wasn't there. The only way I could find to check for the presence of the HPET therefore became something eerily familiar:

    __try {
        volatile unsigned int *count(reinterpret_cast< unsigned int* >(base_address__ + HPET_ADDRESS_OFFSET));
        hpet_present__ = (*count != 0);
    }
    __except(1) {
        hpet_present__ = false;
        // ...
    }
