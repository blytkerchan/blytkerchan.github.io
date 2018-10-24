---
author: rlc
comments: true
date: 2010-08-06 02:09:49+00:00
layout: post
permalink: /blog/2010/08/tell-me-twice/
slug: tell-me-twice
title: Tell me twice
wordpress_id: 865
categories:
- Reasons
- Software
- Software Design
- Software Development
- Technology
tags:
- Posts that need to be re-tagged (WIP)
---

A few days ago, I explained to a colleague why certain communications protocols have a "tell me twice" policy - i.e. to allow for any command to have any effect, the same command - or a command to the same effect - has to be received twice (from the same master). In human parlance, this would be the equivalent of Jean-Luc Picard saying "ensign, I'm about to tell you to lower the shields" ... "ensign, shields down!" in which the ensign (Wesley Crusher?) wouldn't be allowed to obey the second command unless he had heard, understood and acknowledged (HUA!) the first. Now for the math..
<!--more-->
This kind of "tell me twice" policy is usually found in serial protocols and is based on the idea that if a bit flips in a message, the chance of the same bit flipping in two consecutive messages is far lower. Bit flipping is a common error in serial communications - which is why parity bits exist, for example - and even if the chance for any given bit flipping is relatively low, the chance of _a_ bit flipping somewhere in any message is relatively high. I'll show you how that works:

Say the chance of any given bit flipping is [latex]p[/latex], the number of bits in a byte is [latex]b[/latex] and the number of bytes in a message is [latex]n[/latex]. This means that the chance of a bit _not_ flipping is [latex]1-p[/latex] and the chance of getting a message through without any flipped bits is [latex](1-p)^{bn}[/latex], which, depending on the values of [latex]p[/latex] [latex]b[/latex] and [latex]n[/latex] can either be very high, or very low, so let's fill in a few values to get an idea of what this means. Let's say that the chances of a bit flipping are about one in a million, we have eight bits per byte and our messages are 256 bytes in length. The message may be a bit larger than what you'd usually find on a serial connection, but we're going for a case in which there's an actual payload to send, so I think it's reasonable. With these numbers, our little formula, [latex]P = (1-p)^{bn}[/latex] works out to a value for [latex]P[/latex] of 0.997954. That is: with a one-in-a-million chance of any bit flipping, one message out of ever 500 is corrupt. If that one message was "shields down" and, due to the bit flip, becomes "eject the warp core", and the _Enterprise_ is dead in space.

So, the idea of "tell me twice" is to reduce the chances of such errors happening by reducing the chance that a bit flip would have any effect. This is based on the idea that the chances of the _same_ bit flipping in two consecutive chances are far lower than the one-in-five-hundred we just came up with, even it the chances of _a_ bit flipping are still the same. To understand this, we need to know what the chances are that a _specific_ bit in a message is flipped. That chance is [latex]P = p(1-p)^{bn-1}[/latex], which is _smaller_ that the chance of any individual bit flipping (because all the other bits have to not flip). In our case, this works out to [latex]9.980 * 10^{-7}[/latex] which is about one in 1,002,049.

Now, the probability that a message is followed by another message that has the same bit flipped is the product of the probability that a message has a flipped bit (one in 500) and the probability that a message has _a given_ bit flipped (one in a little over a million): [latex]P = (1 - ((1-p)^{bn}))(p((1-p)^{bn-1}))[/latex], which in our case works out to [latex]2.03963 * 10^{-9}[/latex] which is about one in a half billion.

Of course, added to this is the fact that most serial protocols also have some kind of CRC checking, there's usually a parity bit in there somewhere, etc. All these individually rather weak methods, together, make it nearly impossible for a corrupt message to come through undetected - because for any broken message to come through undetected, _all_ of the error detection features have to fail, so as long as they don't all check the same thing the same way, the chances of that happening is the product of the chances of each individual method failing (i.e. checking the parity five times doesn't make your chances of finding an undetected error any better, but checking the parity and four other things does).
