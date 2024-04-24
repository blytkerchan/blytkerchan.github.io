---
author: rlc
comments: true
date: 2015-08-17 02:03:34+00:00
layout: post
permalink: /blog/2015/08/cis-lock-leaks/
slug: cis-lock-leaks
title: 'CIS: Lock Leaks'
wordpress_id: 3241
categories:
- Common Issues with Synchronization
tags:
- locking
- synchronization
---

The two most popular threading APIs, the Windows API and pthreads, both have the same basic way of locking and unlocking a mutex -- that is, with two separate functions. This leaves the code prone to lock leak: the thread that acquired a lock doesn't release it because an error occurred.

<!--more-->

Lock leak is surprisingly common, and can be a source of deadlocks, among other things. The most common way to cause a lock leak is to _not_ use RAII.

Not using RAII means you can cause a lock leak by simply using `return` without releasing the lock first. This is usually a violation of whatever coding standards are in place, and _might_ occasionally be picked up by a static analysis tool, but it is much easier to avoid than that: simply always use RAII.


