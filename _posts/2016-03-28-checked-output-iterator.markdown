---
author: rlc
categories:
- Security
- Programming
- Software Development
- Open Source Software
comments: true
date: 2016-03-28 00:54:19+00:00
layout: post
title: Checked output iterator
wordpress_id: 3806
---

While writing about security -- which takes a great deal of my time lately, which is one of the reasons I haven't updated my blog as often as I usually would -- I came to the conclusion that, while I recommend using STL algorithms, iterators and containers for safety purposes that doesn't solve the problem when the standard algorithms don't check the validity of their output ranges.

<!--more-->

So, I decided to do something about it: Microsoft Visual Studio has shipped with a checked iterator type since 2005 but turns it off by default when you're not debugging and other compilers don't ship with that kind of iterator -- so I decided to write a simple-yet-universal iterator type that will work on most compilers, including older ones, and provide the extra safety for very little extra cost.

I've published it under Apache license version 2, on [GitHub](https://github.com/blytkerchan/checkediterator). I'll be happy to merge pull requests if there's anything you'd like to do to improve it.