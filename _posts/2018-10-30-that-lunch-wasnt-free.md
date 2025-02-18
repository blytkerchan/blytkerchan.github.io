---
author: rlc
categories:
- Technology
- Computer Science
- Software Development
- Hardware Engineering
comments: true
date: 2018-09-11 14:42:36+00:00
layout: post
slug: That-lunch-wasnt-free
tags:
- Spectre (0.8)
- Meltdown (0.8)
- bugs (0.6)
- free lunch (0.9)
- instruction-level parallelism (0.7)
- hardware parallelism (0.8)
- imperative programming (0.7)
- declarative programming (0.9)
- computer architecture (0.6)
- cache optimization (0.7)
title: That lunch wasn't free after all
---

The Spectre and Meltdown bugs have shown that the free lunch was indeed over a decade ago. We should therefore stop attempting to exploit instruction-level parallelism with ever more complex stacks and ever more complex pipelines and branch predictors, and start exploiting the inherent parallelism of hardware. In order to do that, we need to change the way we thing about software from our current imperative way of thinking to a more declarative way of thinking. At the same time, we need to change the way our computers think about software to allow them to exploit this more declarative style to use their inherent parallelism and free up die space currently used for caches and ILP.

[Read the article](/assets/2018/free-lunch.pdf)