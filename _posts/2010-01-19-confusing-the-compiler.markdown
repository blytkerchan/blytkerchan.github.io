---
author: rlc
categories:
- Programming
- Software development
- Compiler errors
comments: true
date: 2010-01-19 01:53:31+00:00
layout: post
title: Confusing the compiler
wordpress_id: 454
---

Sometimes it's real fun to see how easily you can confuse the compiler. In the error below, `function` is a macro that takes three parameters:

    filename.c(453) : error C2220: warning treated as error - no 'object' file generated
    filename.c(453) : warning C4013: 'function' undefined; assuming extern returning int
    filename.c(466) : error C2064: term does not evaluate to a function taking 279509856 arguments

I don't know where it got the idea that I typed **279,509,856** parameters, but I sure didn't take the time to do that! ;)