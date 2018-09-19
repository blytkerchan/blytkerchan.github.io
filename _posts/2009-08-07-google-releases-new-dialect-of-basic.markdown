---
author: rlc
comments: true
date: 2009-08-07 22:24:50+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/08/google-releases-new-dialect-of-basic/
slug: google-releases-new-dialect-of-basic
title: Google releases new dialect of Basic
wordpress_id: 144
categories:
- Business
- Software
tags:
- Posts that need to be re-tagged (WIP)
---

And here I though Basic was on its way out: Microsoft has been touting the advantages of C# and .NET in general far more than they have the advantages of Visual Basic (I remember when it became "visual": it used to be "quick" and that never said anything about run time); and Google _seemed_ to be much more interested in Python and Java than they were in the whole Basic scene. In the circles I've frequented for the last several years, Basic was used only in ASP applications and then only if, for some reason, using C# was out of the question. Basic was basically legacy code that hadn't been replaced yet.

Now, Basic is back - and it's Google that brought it back. As part of their [Android](http://android.com) platform, they've introduced [Simple](http://code.google.com/p/simple/), a dialect for Basic that is apparently complete written in Java - and completely written by hand. I've taken a look at the code for the parser, written by Herbert Czymontek, who was formerly employed at Sun but now works for Google. At Sun, he worked on Semplice, a project to bring Visual Basic to the Java platform, so it only makes sense that at Google, he would continue on a similar line as he did at Sun (and before that at Borland): he already knew Visual Basic pretty well and, of course, Java as well.

From the looks of it Simple is bound tightly into the Android SDK though, the way the code seems to be set up, it should be possible to yank the Android out of there and make it a more general-purpose solution for the Java platform - was Semplice was originally meant for. According to [this post](http://web.archive.org/web/20130910034148/http://news.java-virtual-machine.net/34.html) Semplice died when mr. Czymontek left Sun - he just might have, at least partly, revived his old project but with a narrower scope - which would make it more feasible than Semplice would have been. At the very least, the scope now being limited to Android, he doesn't have to try to support the whole Windows Forms API that most Visual Basic applications are bound to: Basic programmers (and non-programmers who want a quick and easy way to learn programming) will be able to re-use their (newly minted?) skills on their cellphones and won't need the Windows Forms API to do anything useful with it. This could potentially open the Android platform to a whole bunch of people to whom it is currently not really accessible - like pure Windows programmers, ASP programmers, etc. who don't know Java, might not know any C-style language and will now not have to learn.

Refs: [Dr Dobb's report of this item](http://www.ddj.com/architect/218700225?cid=RSSfeed_DDJ_ArchitectDebug).
