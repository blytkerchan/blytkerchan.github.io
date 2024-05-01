---
author: rlc
categories:
- Technology
- Programming
- DIY
- Innovation
comments: true
date: 2017-04-18 20:17:32+00:00
layout: post
tags:
- Arduino
- C++
- stupidity
- vision
title: This guy is out of his mind (and lucky if he can still see)
wordpress_id: 4169
---

This guy has to be completely bonkers: he wrote an application in C# (would not have my language of choice) to detect a human face in a live video feed and point a laser at it.

<!--more-->

<iframe width="560" height="315" src="https://www.youtube.com/embed/Q8zC3-ZQFJI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Aside from being dangerous for his eyesight and obviously a prime candidate for "don't do this at home", it is actually kinda neat: he programmed an Arduino to move the laser pointer around, talks to the thing from his C# app over s serial connection and does his "search for eyes to shoot at" with OpenCV, the open-source vision library.

He must have written there cover before doing most of his testing because it honestly doesn't look like code written by a guy with fried retinas (you can see for yourself at [his Git repo](https://bitbucket.org/mtreeves808/face-detection-laser-system)).

Honestly, in my two-going-on-three decades of programming I've never seen such a mind-numbingly-idiotic-yet-fun-looking project. Bravo, brava!