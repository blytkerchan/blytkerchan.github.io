---
author: rlc
comments: true
date: 2010-07-21 02:49:41+00:00
layout: post
permalink: /blog/2010/07/on-the-importance-of-coverage-profiling/
slug: on-the-importance-of-coverage-profiling
title: On the Importance of Coverage Profiling
wordpress_id: 844
categories:
- Opinions
- Software Development
tags:
- Posts that need to be re-tagged (WIP)
- profiling
---

Coverage profiling allows you to see which parts of the code have been run and are especially useful when unit-testing. Here's an anecdote to show just how important they can be.
<!--more-->
Today, I've finished writing another generic implementation of an abstract data type. The type in question allowed for a lot of corner-cases because of the fact that the data stored in it could be of variable size, so there was really no way to predict some of the states of the ADT from one operation to another.

Those of you who are familiar with my coding style know that I tend to be rigorous when considering the cases that can be handled by my code. One of the rules I've adopted from a colleague of mine ([Marc Bouthot](http://www.facebook.com/marc.bouthot), an excellent C++ programmer) is that every `if` should have an `else` which should at least contain a comment if it doesn't do anything. This forces the programmer to give at least some thought to the possible states of the program and the possible values of the things he's looking at. It doesn't automatigically make all bugs disappear, though, so you still need tests.

For the ADT I was working on, I wrote a few unit tests. There were four possible configurations for the ADT, each of which was chosen at compile-time (so, this being C and that meaning macros, I compiled four different versions). The tests didn't fail me: I found a few bugs and, after repairing them, was happily patting myself on the back until a flag was raised in my brain - it still smelled buggy.

I studied my code a bit closer and decided to add a flag to my unit tests, changing the size of the ADT it tested to an odd number (odd in the sense of weird as well as in the sense of not even). This brought another few bugs out of the woodworks. I also added a systematic check of the ADT's invariants at the end of every mutator, which brought another few bugs out of the woodworks. By now, I was pretty happy with my ADT: I _thought_ I was testing every conceivable case and they were all passing.

This is when I decided to run a coverage profile on my unit tests: using gcc, that's a question of adding the proper flags to the gcc command and running gcov once the test has run. When I ran the coverage profile on all eight tests and merged the results, two lines remained un-tested. Surprising though it was (to me), I added the two corresponding unit tests and - lo and behold - two new bugs came out of the woodworks, both of which would have been very difficult to find in the field.

It is practically impossible to cover 100% of the code with unit tests and, even if you do, coverage profiling doesn't tell you about the possible paths through the code that lead to that coverage. The GNU coverage profiler actually has a bit of support for arc profiling, but profiling through all possible execution paths would produce a possibly infinite amount of information at some point. The human brain, on the other hand, is a lot better at tracing possible paths and hypothetical options, but isn't all that good at being systematic about it. Coverage profiles can be used as hints for the brain to find paths it didn't previously think of.

So, coverage profiling may not be the be-all and end-all of testing, but it is an important tool that, in my opinion, is overlooked far too often.
