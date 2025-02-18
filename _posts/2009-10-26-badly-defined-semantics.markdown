---
author: rlc
categories:
- Software Development
- Bug Fixing
- Memory Management
- Code Maintenance
- Programming Best Practices
comments: true
date: 2009-10-26 15:22:17+00:00
layout: post
tags:
- semantics (0.9)
- maintenance (0.8)
- bugs (0.7)
- memory leak (0.8)
- raw pointers (0.6)
- ownership (0.7)
- error code (0.6)
- RAII (0.9)
- smart pointer (0.8)
- C++ (0.7)
title: Badly defined semantics
wordpress_id: 324
---

There is probably nothing worse than badly defined semantics: functions that might (or might not) take ownership of the object you pass to them can be a serious maintenance headache.

<!--more-->

I am currently in the process of analyzing (and slightly modifying) a number of modules in a rather large software platform in which I will fix what bugs I find and can fix, and annotate what bugs I find and cant fix. Of course, the goal is to change as little code as possible. One of the things I ran into was a potential memory leak: raw pointers were being used on freshly allocated objects that were passed to a function that should, in most cases, take ownership of the object. The calling code assumed the object would always be taken care of, which was (regrettably) not the case.

In this case, the bug would have been a lot easier to fix if the function in question had told its caller what it had done. However, I shouldnt expect as much on a Monday morning: the function returned a C-style error code (zero for success, non-zero for failure) but did not indicate in that error code how it had failed, so failure could mean either youll have to clean up yourself or I destroyed the object, or even I handled the object but failed afterwards.

Now, this code was written in C++, so RAII was available, though exceptions, in this case, were not. Using RAII, and perhaps a very simple smart (or even unsmart) pointer, the functions semantics could have been defined, documented and enforced in the code without any overhead, killing a bug before it had ever seen the light of day, and saving my client money.