---
author: rlc
categories:
- Education
- Technology
- Communication
comments: true
date: 2009-08-22 20:08:52+00:00
layout: post
tags:
- Posts that need to be re-tagged (WIP)
title: The Importance of Patterns
wordpress_id: 173
---

When explaining the design of some application to some-one, I find the use of analogies is one of the best tools available to me - better than diagrams and much better than technical terms: when using technical terms, the listener often starts "glazing over" after only a few seconds - maybe a minute. It really serves no other purpose than showing off how smart you are - and that is usually a pretty stupid (and therefore self-defeating) thing to do.

<!--more-->

Using diagrams works well with engineers (and former engineers) because it seems to get to a part of their brain that is wired similarly to the analyst's/architect's brain. UML diagrams - especially sequence diagrams, I find - register very well with most people as they are very easy to understand to most, and easy to explain to most others.

Analogies, on the other hand, seem to work with by far most people. Explaining, for example, a message pump in terms of an actual pump helps give your listener an idea of what you're talking about in physical terms - most people have an idea of how a pump might work - and, though the analogy is far from perfect, it's a good start. The next step would be to transform the pump from something that pumps water into something closer to what a post-office distribution center might use to dispatch envelopes (but you may need to pass by grain conveyors and that kind of thing first, to go from water to a more solid substance). Once you get to the post office, you practically have your message pump already. If you start at the post office, however, for people who don't know how the post office sorts and dispatches its letters, you may have lost them before you even started. The trick is really to make sure, at every step, that your listener is still following you.

I recently had to explain [one of my previous posts](/blog/2009/08/using-four-letter-words-in-code/) to a lay person - some-one with practically no knowledge of how computers work internally, at all. So, in order to explain what a magic number was, I had to explain what a magic number was for first, so I had to explain (without the benefit of having a debugger at hand) how debugging works, how we can look at the computer's memory and what memory was. This went all the way down to what a bit is, what a byte is, and how you can make four bytes into a (double) word - all that to show how you can have an integer also "be" a four-letter word. The analogies I used in this went from saying that, of the tiles on the (tiled) bar we have at our kitchen, each was a bit which could either be empty (0) or have something on it (1). Then we went though the powers of two (to arrive at 256 possible values for eight bits) and we went back to the alphabet, via Morse code, assigning a number to each of them, etc.

It took a while, but had I tried to use diagrams or (worse) only technical terms, it would have been a _lot_ worse.