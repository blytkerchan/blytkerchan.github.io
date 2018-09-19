---
author: rlc
comments: true
date: 2017-04-18 20:17:32+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2017/04/this-guy-is-out-of-his-mind-and-lucky-if-he-can-still-see/
slug: this-guy-is-out-of-his-mind-and-lucky-if-he-can-still-see
title: This guy is out of his mind (and lucky if he can still see)
wordpress_id: 4169
categories:
- Interesting stuff
- Opinions
tags:
- Arduino
- C++
- stupidity
- vision
---

This guy has to be completely bonkers: he wrote an application in C# (would not have my language of choice) to detect a human face in a live video feed and point a laser at it.

<!-- more -->

https://youtu.be/Q8zC3-ZQFJI

Aside from being dangerous for his eyesight and obviously a prime candidate for "don't do this at home", it is actually kinda neat: he programmed an Arduino to move the laser pointer around, talks to the thing from his C# app over s serial connection and does his "search for eyes to shoot at" with OpenCV, the open-source vision library.

He must have written there cover before doing most of his testing because it honestly doesn't look like code written by a guy with fried retinas (you can see for yourself at [his Git repo](https://bitbucket.org/mtreeves808/face-detection-laser-system)).

Honestly, in my two-going-on-three decades of programming I've never seen such a mind-numbingly-idiotic-yet-fun-looking project. Bravo, brava!
