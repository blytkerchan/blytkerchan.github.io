---
author: rlc
categories:
- Software Development
- Continuous Integration
- Testing
- Automation
comments: true
date: 2015-07-16 10:13:14+00:00
layout: post
tags:
- Continuous Integration (1.0)
- Small incremental changes (0.8)
- Continuous testing (0.9)
- Continuous builds (0.9)
- Investment (0.7)
- Fail Fast (1.0)
- Self-documenting code (0.9)
- Test cases (0.8)
- Build fast (0.9)
- Automate testing (1.0)
- Feedback (0.8)
title: Three ideas you should steal from Continuous Integration
wordpress_id: 3674
---

I like Continuous Integration -- a lot. Small incremental changes, continuous testing, continuous builds: these are Good Things. They provide statistics, things you can measure your progress with. But Continuous Integration requires an investment on the part of the development team, the testers, etc. There are, however, a few things you can adopt _right now_ so, I decided to give you a list of things I think you _should_ adopt.

<!--more-->

**Fail Fast**:
_Keep the cycle between coding and knowing whether your code works as short as possible. Make it as easy as possible to know whether code works -- ideally with excellent coverage (both functional and code) in unit tests that can run during a compile cycle._

If something doesn't work, you want to know it before your developer has time to get up and fetch a cup of coffee. If that's impossible, he should know by the time he gets back to his desk.

It should also be clear how the failure is related to the code. That means:

1. Self-documenting code
2. Self-documenting test cases
3. Test cases that test one thing, and one thing only

**Keep the build fast**
_I've worked on projects where hitting F7 (build) meant going home for the night. This is not a good thing: it gets developers to write a lot of code without every building, let alone testing. That, in turn, slows down the development cycle which has all kinds of nefarious effects._

**Automate testing**
_Note: not just tests: testing. You want to get tests running without anyone having to think of starting them. You want to automate feed-back to your developers. You want to tell your developer (politely) that he's made a mistake and should repair it before he inflicts the code on others._