---
author: rlc
comments: true
date: 2013-06-10 17:00:46+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2013/06/why-i-decided-vlinder-software-should-stop-selling-funky/
slug: why-i-decided-vlinder-software-should-stop-selling-funky
title: Why I decided Vlinder Software should stop selling Funky
wordpress_id: 2324
categories:
- Reasons
- Vlinder Software
tags:
- business decisions
- Vlinder Software
---

If you follow the News feed from [Vlinder Software's site](http://vlinder.ca) you know that I've posted an announcement saying Funky is now in its end-of-life cycle. This is our first product to enter end-of-life, but what it basically means is that we won't actively work on improving the software anymore.

If you've been following me for a while, you'll know that I am the founder and sole proprietor of Vlinder Software, as well as the CEO and an Analyst. I don't usually sign off as CEO, but this is one of those decisions that is mine alone to take. In this post, I will explain why.

<!--more-->

Funky is an elegant little language, albeit a bit clunky. The elegance comes from the fact that its grammar can be expressed in only five productions. Its clunkiness from the fact that its semantics are defined almost entirely by whatever you happen to plug into the interpreter, and from the fact it's a lispier language than Lisp.

I've seen people do some pretty funky stuff with Funky, including what it was originally designed for, and in the past six years, not a single bug has been found in any production version of the software -- to the point that I authorized a "find a bug, win a license" contest: no bugs were found.

In the last three years, the only things we've had to do with Funky were to integrate it in our new build system, which runs on four build servers each with different OSs, and test support for the latest compilers. No bugs were found, and no features needed to be added.

So why stop now?

The most important reason was technological: Funky is built on Boost.Spirit V1, now called "classic". This version of Boost.Spirit has been deprecated for a while now. Though that doesn't pose any problems for using Funky, it is a concern when the software you're selling licenses to comes with long-term support.

Another concern with using Boost.Spirit is that it adds a dependency on Boost, which has since proven to be a drawback: Boost is not specifically designed for industrial embedded devices and while it is excellent software, it does not always meet the applicable standards of our customers.

There's also the commercial side: when a customer needs an embeddable programming language, Funky is rarely, if ever, the right answer anymore. When a customer comes to us for an embeddable functional programming language only to find out that the one we advertise on our website is not the best choice, it's a bit embarrassing.

We've developed a framework and method for developing Domain-Specific Languages, which is designed specifically for embedded industrial devices. This is what the DSLs we develop and sell licenses to are built on. Funky (obviously) doesn't use that framework and wasn't designed with that method, so continuing to maintain Funky would be kicking a dead horse...

At Vlinder Software, we don't do bait-and-switch, so now that we have a framework and method we want to base our DSLs on, we shouldn't be putting a DSL out there that isn't based on that framework and method.

So, for all these reasons, I decided that no new licenses of Funky are to be sold as of today. In stead, we will continue the development of our DSLs along the lines of previous ones, and sell licenses to those.
