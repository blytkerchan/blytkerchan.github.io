---
author: rlc
comments: true
date: 2016-03-08 09:38:49+00:00
layout: post
title: Schoenmaker, blijf bij je leest (Cobbler, stick to your last)
wordpress_id: 3441
---

This is an old Dutch saying, which probably has its origins in a village with a particularly opinionated cobbler.

I am not one to stick to my last -- but if I were a cobbler, I don't think I'd be _that_ cobbler: I like to know what I'm doing.

<!--more-->

This saying came to my mind while working on maintaining a scripting engine written by a number of people over a large amount of time who neither coordinated their efforts nor documented them.

Sometimes, it's hard to know whether or not you should go ahead and try _that new thing_: have you ever asked yourself why there are so many `String` classes Out There? I've written a few of those myself, of course, two of which I still use regularly in production code: the first a wrapper for C-style strings to allow iterator access to them (the whole thing about 20 lines of code and zero overhead once compiled) and the second a copy-on-write string with support for my series of allocators.

As far as I can remember, I never wrote a `String` class without running a not-otherwise-circumventable problem first. I have always tried to (and sometimes failed to) resist the urge to make the Swiss army knife of classes: those usually become nightmares to maintain and should, at some point, be removed from the code.

But I don't have a litmus test for whether you should write another `String` class: you _probably_ shouldn't, but you _might_ have a very good reason to -- as I have had three times in the past two decades.

The same applies to a new scripting engine: do you _really_ need another one? Can't you do what you need to do with some existing scripting engine?

The saying came to mind again while reading about yet another security flaw in yet another badly written server: someone had decided to write their own SSL implementation.

Frankly, this saying comes to mind too often, but I'll stop ranting now...
