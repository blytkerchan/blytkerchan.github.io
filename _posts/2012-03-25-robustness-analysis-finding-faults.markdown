---
author: rlc
categories:
- Software Development
- System Analysis
- Robustness Analysis
- Error Handling
- Resource Management
- Concurrency
- Security
comments: true
date: 2012-03-25 18:16:34+00:00
layout: post
tags:
- robustness analysis
title: 'Robustness analysis: finding fault(s)'
wordpress_id: 1823
---

When working on a large project, implementing a system that has to run 24/7 and handle significant peak loads of communication, at some point, you have to ask yourself how robust your solution really is. You have to ascertain that it meets the goals you have set out and will consistently do so. There are diverse ways of doing this. Some are more efficient than others. In this article, I will discuss some of the methods I have found useful in the past.

<!--more-->

Robustness analysis is a form of behavior analysis that focuses on finding possible faults in the design and implementation of the system (or the part of the system being investigated). It can be approached from several angles, including object-behavioral analysis, static analysis, sequence-of-events analysis, etc. Each of these approaches is useful and is likely to be complementary to other approaches, so for a successful robustness analysis, I would recommend using a mixture of these approaches, starting with an analysis of the sequence of events leading up to normal operation,

## Weakness types

Before starting out analyzing your software, you should have an idea of what you're looking for - what kind of weaknesses you expect to find, and how to recognize them.

One of the most pernicious types of weaknesses found in software is the **single point of failure**. Single points of failure can take the form of "fatal errors", "kernel panics", or other such problems that will either prevent the system from starting, or stop it from working. A sequence-of-events analysis of a boot sequence will almost inevitably turn up a few of these weaknesses.

Single points of failure are pernicious precisely because they are single points of failure: if a failure occurs at one, the system stops functioning correctly. In the best case, it will fail obviously ("loudly", if you will) but in some cases, it will continue limping along and function badly. This brings us to error handling...

**Improper error handling** is, sadly, a very common error. In true C++ programs, this often translates to improper resource management (which we will talk about in a moment) but as most software written in C++ is really a mixture of C++, C with classes and plain C, error handling is still an important problem in software written in C++.

[aside type="sidebar"]

### Sidebar: error handling and guarantees

Error handling can really be separated into two large categories: _Error recovery_ and _Error reporting_. The former brings us to the three types of guarantees any function should be able to give: the _basic_ guarantee ("I will not mess up the system. When I'm done, whatever happens, the invariants of the system will still be in tact and all resources will still either be referenced or available. If anything goes wrong, you will hear about if unless I can handle it completely by myself") guards us against random crashes, leaks, corruptions, etc. Any function in the system should give us this guarantee.

The second guarantee is the _strong_ guarantee ("If something goes wrong, I will return the system to its previous state -- or something sufficiently close to it that the difference will be negligible"). Any function that _can_ give this guarantee really should. Examples of functions that can't give this guarantee are functions that write to hardware: if something goes wrong after the third byte has been written, the first three bytes usually cannot be undone (or if a page on a flash device has been erased but writing to it fails, the data on the page is lost).

The third guarantee is the no-fail guarantee. A function that gives this guarantee cannot fail. Destructors (and similar functions that free stuff) should always give this guarantee. Other functions usually can't.

When looking for weaknesses in this area, ask yourself the following questions:

1. what are the guarantees this function can reasonably give? (are they documented? should they be?)

2. does thus function handle errors internally such that the guarantees are upheld? (using RAII is usually a good sign of at least trying)

3. Are any errors that can be handled locally, handled locally?

4. Are any return values from functions that may return error codes ignored? (A sure sign that some errors are not being handled nor reported -- which is part of the basic guarantee)

Error reporting is part of the basic guarantee. In order for error reporting to be effective, the error reporting mechanism should be something that cannot easily be ignored (which rules out return codes in C++ and leaves is with exceptions for error reporting), which is clear (in the sense that it is both clear that there is an error, and clear what the error is) and not ambiguous (in the sense that there can be no doubt as to the fact that there is an error, nor as to what the error is). That means that any reported error should contain sufficient information to answer the basic questions "what", "how", "when", "why" and "where". _What_ went wrong, _How_ did it go wrong, _How_ can it be fixed and _How_ can it be prevented from going wrong in the future, _When_ did it go wrong (useful in the case of asynchronous error reporting), _Why_ did it go wrong (what information is available about the root cause should be reported), _Where_ did it go wrong (both in the code - which file/line/function - and in the system - which component).[/aside]

Looking for problems in **error reporting** usually comes down to three things:

1. are all errors reported?

2. can error reports easily be ignored?

3. do error reports contain all the required information?

In the case of C++ code, compiler settings can be very important in this context: turning exceptions off, for example, will make error reporting (and error handling) much more difficult and code that _looks_ like it does the right thing will actually produce unpredictable behavior (for example: what does `throw` do when exceptions are turned off?)

You should be careful, however, that looking for these kinds of weaknesses doesn't turn your robustness analysis into a code review: the point of the exercise is not to find every single instance of a weakness, but rather to assess the general robustness of the system. The scope of a comprehensive code review of a significant system is much larger than that of a robustness analysis of that same system -- as people who have performed both will be able to attest to.

**Resource management** is a common source of problems in embedded software: are there clear rules for the developers to follow w.r.t. resource management? Are they documented? Are they followed? Are they part of what code reviewers look for? I can suggest a few, of course (use RAII; avoid dynamic allocation in small systems, use it wisely in less-small systems; avoid arbitrary limits; don't expect users (or client code) to respect your limits; etc.) Several tools, both dynamic and static, exist to look for problems in this domain.

**Concurrency**, **security**, **unexpected language artifacts** (such as the fact that large parts of C are deliberately undefined), etc. are all important sources for weaknesses. Some of these should be attacked at the design phase (concurrency and security are excellent examples of that) while others should be a continuous concern throughout development (the language, resource management, error handling, etc. are all examples of that -- though they should all also be taken into account during design).

## Putting your finger on it

So how do you find those weaknesses? How does one go about verifying the robustness of a significant system?

That's the topic of the next article :-)