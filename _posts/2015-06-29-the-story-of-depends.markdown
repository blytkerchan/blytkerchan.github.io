---
author: rlc
comments: true
date: 2015-06-29 03:01:17+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2015/06/the-story-of-depends/
slug: the-story-of-depends
title: The story of "Depends"
wordpress_id: 3647
categories:
- Anecdotes
- Software Development
---

Today, I announced on behalf of my company, Vlinder Software, that we would no longer be supporting "Depends", the dependency tracker. I think it may be worthwhile to tell you a by about the history of Depends, how it became a product of Vlinder Software, and why it no longer is one.
<!--more-->
Depends was first written as part of Jail, an experiment I was working on in 2007. Some of the code from the Jail project was never made public but the parts that were were often interesting: there's an implementation of Maged M. Michael's Safe Memory Reclamation algorithm (SMR)[^1], for example, that has some useless sorting added to it bug is otherwise interesting to look at. I was playing a lot with lock-free code back then -- it's gotten a bit more serious since -- and tried out several algorithms of which SMR is probably the most elegant.

[^1]: A patent application was filed under the title "Method for efficient implementation of dynamic lock-free data structures with safe memory reclamation" in 2002, but was never granted so AFAICT (but IANAL) the algorithm is in the public domain, but I've posted a question about it [here](http://patents.stackexchange.com/questions/13107/what-is-the-legal-status-of-safe-memory-a-reclamation).

I also wrote a dependency tracker, based on the idea over an annotated directed a cyclic graph that was serializable and accessible as an STL-style associative container. I still very much like the idea of using familiar interfaces (assuming competent C++ programmers are familiar with the STL) and hiding nifty algorithms behind them so the "thing" you're working with just "magically" does what you want it to do.

At about the same time, I also wrote [an article in Dr Dobbs's](http://www.drdobbs.com/architecture-and-design/the-adapter-pattern/199204099) about the Adapter pattern and a particularly interesting implementation of it, which I had needed at the time to integrate a new piece of software with a much older one, the older one having suffered from years of maintenance, which had completely shattered any remnants of encapsulation. To resist the Borg-like assimilation of my code, I needed to abstract the code I was to interface with. The solution, though complex, was really quite nifty.

Depends was not born out of necessity, but out of curiosity: as I stated in its documentation:


<blockquote>As professional software developers we use programs that include dependency trackers nearly every day: we basically can't do our work without them, unless we start tracking dependencies by hand.
The trackers we use on a daily basis are integrated into such fine tools as GNU Make, Microsoft Visual Studio, etc.: dependency trackers are the behind-the-scenes magic that make tools like these work. They help us track the dependencies between our source files to determine the order in which they need to be compiled and which files need compiling. They make our jobs a whole lot easier, if not just plainly possible.

Dependency trackers further help in such diverse applications as banking (inside the calculation engine of one of France's most wide-spread fiscal applications is a dependency tracker that tracks the dependencies of the calculation engine's modules); OS kernels (using a dependency tracker to know which modules to load and in what order); etc.</blockquote>


Of course I knew about the calculation engine thing because I wrote it. The other bits are obvious. Still, dependency tracking was one of those problems for which the solution, though recurring, seemed to be re-invented every time. I wanted to create a generic solution to the problem that would work in each of the aforementioned cases and still be efficient.

Depends is an elegant solution and is extremely well-documented and, with one tweak in one place -- which most users tend to find fairy quickly -- is actually very efficient.

For commercial support, the business model really became "for $100 I'll tell you what the tweak is" but, the tweak being fairly obvious (I've only had to point it out once) and the most prevalent use-case not requiring disclosure of the code (i.e. the fact that it's licensed under GPLv2 was not a problem for most users and only one commercial license has ever been sold) the cost if maintaining Depends in our build and test environment simply wasn't worth the trouble.

The "tweak", by the way, is that for the vast majority of use-cases, you need to know either the prerequisites of a node or the dependants. By default, the Depends class calculates both, using two DAGs. You can remove one of the DAGs and still have all the features you need.
