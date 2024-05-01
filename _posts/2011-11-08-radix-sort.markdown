---
author: rlc
categories:
- Sorting Algorithms
- Radix Sort
- Education
- Parenting
comments: true
date: 2011-11-08 00:25:20+00:00
layout: post
tags:
- algorithms
- sorting
title: Radix Sort
wordpress_id: 1714
---

![image](/assets/2011/11/wpid-IMG_20111107_191330.jpg)

The Radix Sort algorithm is a stable sorting algorithm that allows you to sort a series of numerical values in linear time. What amazed me, however, is that it is also a natural approach to sorting: this is a picture of my daughter applying a radix sort to her homework (without knowing it's a radix sort, of course, but after explaining the algorithm perfectly)!

<!--more-->

Radix sort is actually non-trivial to implement correctly, but apparently trivial enough to understand for an eight-year-old to describe correctly and implement on a piece of paper.

The radix sort she employed was a most-significant-digit (MSD) radix sort, in which she sorted integers between 1 and 999, inclusive. Wikipedia has a [very good explanation](http://en.wikipedia.org/w/index.php?title=Radix_sort&oldid=449846096#Recursive_forward_radix_sort_example) of the method she used (and she doesn't know Wikipedia nor does she read english).

The amazing part isn't that an eight-year-old can provide an accurate description, but that an algorithm that is so simple to describe (notwithstanding the brilliance of my daughter, of course) but that a correct implementation is so hard (see [RosettaCode](http://rosettacode.org/wiki/Sorting_algorithms/Radix_sort)).

That just goes to show that, when an algorithm is easy to explain, that does not mean it's easy to implement -- just like when you have an elegant piece of code, that doesn't make the algorithm easy to explain, per se.