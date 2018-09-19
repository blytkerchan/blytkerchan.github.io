---
author: rlc
comments: true
date: 2014-02-01 21:09:52+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2014/02/a-functional-version-of-the-kmp-algorithm/
slug: a-functional-version-of-the-kmp-algorithm
title: A functional version of the KMP algorithm
wordpress_id: 2527
categories:
- C &amp; C++
- Software Development
tags:
- functional programming
- Haskell
- meta-programming
---

For one of the projects I'm working on, I needed a compile-time version of the KMP algorithm in C++. I started by making the algorithm functional.

<!-- more -->

[![](http://imgs.xkcd.com/comics/haskell.png)](http://xkcd.com/1312/)
The Knuth-Morris-Pratt algorithm, useful for finding subsequences in a sequence, consists of two parts: one part looks at the subsequence to create a table of integers to see how much back-tracking is necessary if a match fails at a given point in the subsequence, and one part applies the matching and back-tracking to the sequence.

Following the mantra of "don't delay until run-time what you can do at compile-time" I wanted to implement as much of the algorithm -- namely the first part -- at compile-time. As this means implementing it as a template meta-function, that also means implementing the algorithm in a functional dialect.

When I want to implement something that was originally written in something other than a functional dialect as functional code, Haskell is usually my language of choice, so I implemented the algorithm as an explicit recursion (which is easier to translate to a meta-function than a fold).

Here's the code:

    
    -- KMP algorithm
    kmp_table w =
        build w initial_t initial_pos initial_cnd
        where
            initial_t = [-1, 0]
            initial_pos = 2
            initial_cnd = 0
            build w t pos cnd = 
                if pos >= length w
                then t
                else
                    if (w!!(pos - 1)) == (w!!cnd)
                    then build w (t ++ [cnd + 1]) (pos + 1) (cnd + 1)
                    else if cnd > 0
                         then build w t pos (t!!cnd)
                         else build w (t ++ [0]) (pos + 1) cnd



Translating this to a C++ template is a simple question of creating a meta-function for each `if`, and using `enable_if` for each `else` branch.
