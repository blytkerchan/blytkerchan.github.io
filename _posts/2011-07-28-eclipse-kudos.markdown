---
author: rlc
categories:
- Software Development
- Integrated Development Environments (IDEs)
- Software Architecture
- Version Control
- Software Maintenance
- Software Design
- Software Evolution
comments: true
date: 2011-07-28 16:56:30+00:00
layout: post
title: 'Eclipse: kudos'
wordpress_id: 1597
---

One of the things I like about Eclipse is the way it is designed. I'm not talking about the GUI when I say that - although the GUI is arguably well-designed as well: I mean the way hundreds of pieces fit together to make Eclipse an IDE for Java, C, C++, PHP, Python, ..., etc.

<!--more-->

I found this presentation on Slide Share that explains what Eclipse is, and a bit of what's new:

**[Whats new in Eclipse Indigo ? (@DemoCamp Grenoble 2011)](http://www.slideshare.net/mickaelistria/whats-new-in-eclipse-indigo-democamp-grenoble-2011)**

View more [presentations](http://www.slideshare.net/) from [Mickael Istria](http://www.slideshare.net/mickaelistria)

The parts I like most are the inclusion of EGit, which works really well, I find, to integrate Git into the IDE, but what strikes me most is that there no, and as far as I can tell has never been, any great departure from the previous versions of Eclipse: from one release to the next, Eclipse evolves but does so in a gradual, rather than a radical, process.

This is in stark contrast with other popular and large software projects. Many software projects -- including some of my own, I should say -- have gone through "complete rewrites" because some new approach seemed a lot better than the one taken so far. Sometimes, that is warranted -- e.g. when it really is impossible to meet certain requirements with the current architecture. Sometimes, such a rewrite is a clear sign of a defective architecture that just won't stand the test of times. More often than not, however, it is a sign of disenchantment with the existing architecture and of the drive to do something new.

I recently started to write a new version of Funky, which is currently in the qualification stages. The reason I wrote a new version rather than modifying the existing one is because the existing one, though small and fast, could not meet some of the new requirements it will need to meet. The new version, which is even smaller and even faster than the previous one but which is wholly incompatible when it comes to its API, _required_ a complete re-write. The current version of Funky does have a few versions the new one won't have, though, so we will probably keep both. This is one of those cases in which the existing architecture just can't meet requirements for which it wasn't designed.

Earlier, I designed a completely new software architecture to replace an existing system that simply would not stand the test of time (and wasn't mine -- this has happened twice, so far): the old architecture was crumbling from the maintenance patches that had been applied to it, was simply not scalable and did not have a real feature: there was simply nothing to be done.

But I have also often resisted the urge to design something completely new because I simply had the itch to do so. All software has its limitations and all software I didn't write is written differently than I would have written it. That is probably true for everyone. Sometimes you look at a sizable chunk of code and simply itch to delete it all and rewrite it from scratch. That is usually one of those cases where you should resist the itch.

The team behind Eclipse seems to have resisted the itch for a very long time now and, with the architecture in place, it is probably a good idea to continue doing so. The way features and plugins are added to the IDE (just by dropping them into place), the way installation and upgrading works, etc. shows the excellent work that team has done so far and should be an example for the rest of us: to design a well-though architecture and stick to it -- at least as long as it continues to meet the needs.