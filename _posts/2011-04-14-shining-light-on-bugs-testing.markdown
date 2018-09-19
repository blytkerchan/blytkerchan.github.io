---
author: rlc
comments: true
date: 2011-04-14 01:16:17+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2011/04/shining-light-on-bugs-testing/
slug: shining-light-on-bugs-testing
title: 'Shining light on bugs: testing'
wordpress_id: 1357
categories:
- Software Engineering
tags:
- testing
---

Bugs like to hide in the darker corners of the code: the parts that are least exercised, less well-structured. They don't react to light very well. tests are like a spotlight that you shine upon specific pieces of the code. The first time you do that -- especially if the code has been around a while -- the bugs will come crawling out of the woodworks.
<!--more-->
**Unit tests are like laser pointers**: the light they shine is bright, but narrow. A bug can be hiding right next to the spot you're shining on and you might never see it. The can be easily automated, but their scope is too narrow to only rely on them, in most cases.

**Acceptance tests are like stage lighting**: the light they shine tends to show only what you'd like to be seen -- and what your customer would like to see. A lot of things can go on in the background and come out of the dark to surprise you some time during the play. Among those things, are bugs.

**Black box tests are like ambient lighting**: they are done specifically without knowledge of what's inside the box, and are usually only functional, so the bugs can hide just beneath the surface without ever being noticed.

**Functional tests are like pocket lights**: they are used to shine on specific things and tend to light the area just around it, but you need to move the light around a lot to light everything.

**Smoke tests are like lighters**: they light up a small bit, unless it catches fire.

**White box tests are like surgical lights**: they shine a bright light on the organ you're looking at and the area immediately surrounding it.

**Regression tests are like a reading light**: they shine on the same spot and will only show something if you put it under the light.

Evidently, you need all of them
