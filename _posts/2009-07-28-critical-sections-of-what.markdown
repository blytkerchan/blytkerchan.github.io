---
author: rlc
comments: true
date: 2009-07-28 15:56:04+00:00
excerpt: 'a glass of water

  may sometimes have a storm, but

  blizzards there are rare'
layout: post
link: http://rlc.vlinder.ca/blog/2009/07/critical-sections-of-what/
slug: critical-sections-of-what
title: Critical sections - of what?
wordpress_id: 94
categories:
- C &amp; C++
- Software Design
tags:
- locking
- terminology
---

"Critical section" is a confusing misnomer - especially for newbies: it gives the reader the impression that the _code_ is in some sort of "critical" mode and that nothing else can run while that code is running. More than one newbie I've worked with have been confused by this.

In one of the proprietary libraries I've written, I've written an object wrapper around Microsoft's critical section, called "Mutex". Some of the code that uses the library is older than the library itself, and has been partly retrofitted with it. One newbie that had to work on that legacy code came to me, rather dramatically, saying he'd found a major bug.

Now, this code has been in production for a number of years now, and has been running smoothly for all those years, almost without modification. I rather like code that just does its job and that doesn't have to be modified, so some-one telling me that there's a major bug in it can be rather depressing, but I was pretty confident with the code in question - more so than with the newbie - I was a bit skeptical about his assertion. Therefore, I asked him what the problem was (while we were walking over to his desk).

He explained to me that he'd found plenty of critical sections in the code, but that the critical section objects used to protect them were shared all over the place. He told me that he planned to create a critical section object for each critical section of code, so the code would be properly protected (no two threads would be able to run it at the same time) but the different bits of code that now shared the same critical section object would be allowed to run concurrently - which would surely make the program a lot quicker!

That's when the palm of my right hand hit my forehead rather emphatically.

I told him, in an as reassuring tone as I could muster, and trying my best not to laugh, that it was quite alright and that, if he really did want to make changes to the code, he could replace the critical sections with instances of the Mutex. That critical sections are a Microsoft misnomer for mutexes that happen to include a spinlock (or not) and that they were intended to protect the data, not the code. As long as your code is not self-modifying and is re-entrant, I told him, there is no reason to protect it.

He looked reassured as I went to get a cup of coffee...
