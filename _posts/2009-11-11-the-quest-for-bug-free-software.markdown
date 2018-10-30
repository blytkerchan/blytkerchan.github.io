---
author: rlc
comments: true
date: 2009-11-11 02:00:37+00:00
layout: post
permalink: /blog/2009/11/the-quest-for-bug-free-software/
slug: the-quest-for-bug-free-software
title: The Quest For Bug-Free Software
wordpress_id: 370
categories:
- Opinions
- Software Design
tags:
- Posts that need to be re-tagged (WIP)
- software
---

In recent literature from the scientific side of software engineering, there've been a lot of publications on producing and maintaining high-quality software. A lot of focus is being put on tools, systems, procedures and processes that aim to reduce the price-tag of quality and avoid the price-tag of failure.
<!--more-->
The Software Engineering Institute shares the preacher's lament: they, too, spend a lot of energy on process and procedure; while the IEEE Transactions on Software Engineering has published at least one article on testing, quality or something related in each and every issue of the current volume (volume 35) - and I expect there will be at least one more in the volume's final issue.

So why is it that so much effort is being put into designing tools (sometimes very complex tools), systems (sometimes very complex systems), procedures and processes around software quality, but software quality as a whole does not seem to improve significantly? We no longer have an environment where we have a huge variety of hardware architectures to cope with: this vast majority of programmers only ever works on Intel's IA-32 (x86) architecture and a majority of those work under either Windows or Linux most of the time. We no longer work in very limited environments in which every byte has to be accounted for (twice) and none can be wasted: even "embedded" systems now have mega-bytes of memory, solid state drives, and full-fledged operating systems. Arguably, the people who work outside of these well-known platforms with plenty of resources and user-friendly operating systems (like myself and most of the people I work with) work in a niche of the software engineering industry. Or do they?

Contrary to popular belief, the Wintel platform isn't as ubiquitous as one might think it is and, even if it were, legacy code that was written with the constraints of the world before Wintel is far more abundant than code that was not written of that platform. Code written in un-managed, "free" C and C++ far outnumbers code written in higher-level languages such as Java and C# - even if many of the software engineers that come out of the Universities today are trained in Java and C# more than they are in C and C++. Software, however, is ubiquitous: your cell phones and other hand-held devices rely heavily on software in order to provide the services and functionality that you have come to rely on. So do modern cars (in which even the window wipers are run using micro-controllers), trains, and planes. Our economy relies so heavily on software that a scare like Y2K would, today, have a far more devastating impact than it did only a decade ago, when the big scare was that a nuclear power plant might "blow up" (something officials were quick to point out was extremely unlikely). We rely on software to combat terrorists - who rely on software to hide their evil planning. We rely on software for our health up to the point that software is being used not only during operations, but even to make certain operations possible.

Yet we have yet to crack the code for the bug-free program. That one mythical application that will simply do what it's supposed to do, and will never fail. As I have shown in [the C++ for the self-taught post on "Hello, world"](/blog/2009/10/1-hello-world), even putting something very simple on the screen involves a rather complex machinery and, what I didn't show in that post, that machinery can have bugs. Microsoft's Visual Studio 2005 shipped with a bug in it that was in one of the very basic building blocks that is used in that example code - not something you'd actually _see_ when running the code, unless you were looking for it, but there nonetheless.

So, the quest continues. But aren't we missing something? Have we forgotten that software engineering is a human endeavor? Humans, unlike computers, are very slow but very intelligent (computers are very fast but very dumb). We make mistakes - and therefore, so do computers. Any tool, system, process or procedure that we come up with to limit the mistakes we make will, itself, have mistakes in them. None will be perfect. So perhaps we're going about this wrong and should, in stead of trying to limit our mistakes, try to limit our reliance on perfection; in stead of limiting the ways the human intellect is allowed to express itself in software engineering, perhaps we should try to allow for more experimentation and take a more human-centric approach to software engineering.

I have no idea what such an approach would look like, so this is not a practical proposition I am making, but assuming that our combined intellect is smarter than any one of our intellects taken by itself, perhaps we can come up with something?

In the mean time, it's business as usual in The Quest For Bug-free Software.
