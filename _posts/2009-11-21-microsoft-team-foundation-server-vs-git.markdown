---
author: rlc
comments: true
date: 2009-11-21 20:42:51+00:00
layout: post
title: Microsoft Team Foundation Server vs Git
tags:
  - Posts that need to be re-tagged (WIP)
---

For the last few weeks, and in the coming months, I've had to (and will have to) work with Microsoft's Team Foundation Server (TFS).

<!--more-->

I have a habit of working on more than one thing at the same time - call it sustained partial attention or multi-tasking, but I try to optimize the use of my time. E.g. when my computer is compiling one project, I can usually work on another project while it's doing that: as long as I have stuff to do, I can keep working even if my computer is working on other stuff. There is a limit to the number of projects I can work on in parallel, however, just like there's a limit to the amount of (real) work the computer can do in parallel. My limit is usually lower than the computer's limit: computers do unintelligent things really fast while humans (such as myself) do intelligent things really slowly. That means that by the time I have another "dumb job" for the computer, it's usually finished the one I gave it earlier so I can pick up where I left off. That way, I don't spend too much time waiting for my computer.

That whole idea is out the window when using TFS: ever since I stopped using CVS a few years ago, I had stopped waiting for my computer for any significant amount of time - but now, those days are back with a vengeance!

Though TFS has a very convenient user interface that integrates very nicely with Microsoft's Visual Studio, and it does have a few features CVS and Subversion don't, it is also a huge waste of time. It takes seconds - nay minutes - to create a branch (which, for some reason, you then have to check in which takes another eternity) and it is impossible to take a changeset from one branch and apply it to another (cherry-picking) unless the two happen to have a parent-child relationship.

As TFS is a centralized system, it has to talk to the server for everything you might want to do, which includes creating branches, merging, checking in/out, etc.

I had never realized how utterly brain-dead that really is! If there is any load on the server - which there is bound to be if you're working with a fairly large development team - TFS slows down to a crawl.

The one operation that takes any significant amount of time using Git is the clone operation: it downloads everything, includes all of the history. Clones a large project may take a while but once that's done, pushing and pulling, the one other more or less daily operations that take any time, are still pretty fast. Anything else is done locally, making it all blindingly fast - even on Windows, with both Windows and Cygwin slowing things down.

With TFS, even checking out a small project seems to take an eternity compared to this.

The silver lining? Every time I try to do something with TFS, I end up loving Git more than I did before!
