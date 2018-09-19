---
author: rlc
comments: true
date: 2010-11-19 04:23:03+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/11/more-than-the-absence-of-problems/
slug: more-than-the-absence-of-problems
title: More than the absence of problems
wordpress_id: 1133
categories:
- Software Design
- Software Development
- Software Engineering
tags:
- Posts that need to be re-tagged (WIP)
---

Quality can be defined in many ways: ISO defines quality relative to requirements as a measure of how well the object's characteristics meet those requirements. Those requirements can be specified (documented) or implied (customary). This has the advantage of making quality more or less measurable, but it has the disadvantage of making it harder to justify improving the product if the (minimum) requirements are met.

In my view, quality is a measure of excellence: it is more than the absence of problems and aims towards the prevention of problems.
<!-- more -->
For example: although it may not be a _requirement_ for my laptop to run 24/7 the software on my laptop should not require me to reboot my laptop every few hours lest my windows stop having borders and my icons no longer show. In practice, however, I do have to reboot this laptop every few hours or my windows will really stop having borders and my icons will really stop showing. That is not true for my other laptop, which runs a different operating system on very similar hardware. Hence, although it may not be a requirement, it is a quality issue in my view.

I usually work on systems that have to be able to run 24/7, have to perform their tasks the same way every time, with real-time constraints and without every failing due to the software. Sometimes, hardware imposes serious constraints on the software (or firmware) as well, making it more challenging -- and therefore more interesting -- to find a satisfactory, high quality solution.

When confronted with existing software that I have to integrate my software with, the challenge becomes manifest as soon as that integration needs to be tested: in order to do that, both softwares (or firmwares) need to be stable and of sufficient quality to be able to work with them. Both also need to be _testable_: it needs to be possible to devise tests that will have the two systems communicate with each other and, possibly, misbehave towards each other. For example: if system A needs to obtain information from system B, system B may, sometimes, be unreachable, may not respond, may close the connection, etc. Such scenarios, in which system B misbehaves, should not cause system A to misbehave as well. When it does, system A has quality issues that need to be addressed.

Such quality issues are often caused by something other than system B misbehaving: they may be due to a design flaw, or a flaw in the implementation of system A. Even if the use-case of system B misbehaving may be an "invalid" one in that, in real life, it might never happen, the root cause of system A's failure to continue to function properly cannot be blamed solely on the test scenario. For example: if system B's dropping a TCP/IP connection causes system A to crash, the answer cannot be "system B shouldn't drop the connection" -- it must be "system A shouldn't crash". Similarly, if system B sends commands to system A in rapid and continuous succession and system A succumbs under the pressure, the cause of system A's failure should be analyzed: the answer should never be an immediate "system B should never do that" -- although that might be part of the answer in the end.

Hence, the goal of repairing problems found in testing should not be to allow the test to pass: it should be to find the root cause of the failure and repair that root cause -- a process which may include adding more tests to help identify the root cause and help future testing and quality improvement efforts.
