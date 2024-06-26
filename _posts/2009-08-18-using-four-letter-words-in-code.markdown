---
author: rlc
categories:
- Software Development
comments: true
date: 2009-08-18 15:33:41+00:00
layout: post
tags:
- firmware (0.9)
- device drivers (0.8)
- integer values (0.9)
- debugger (0.7)
- bit pattern (0.6)
- magic number (0.9)
- od command (0.7)
- documentation (0.8)
- programmer (0.7)
- technical documentation (0.8)
title: Using Four-Letter Words In Code
wordpress_id: 169
---

When writing firmware and device drivers, it is useful, sometimes, to have human-readable integer values - i.e. integer values that, when you read them in a debugger, mean something distinctive.<!--more--> This is different from using integers that have a distinctive bit pattern so you can read them on a scope (ex. 0xABABABAB, which is 10101011 repeated four times). So, when generating a new magic number, I usually use od, like this

    $ echo -n {FOUR-LETTER-WORD} | od -t x1
    0000000 50 4f 4e 59
    0000004

which would render the magic number 0x504f4e59UL.

Writing this in a piece of documentation often has the effect that the programmer who reads the documentation find his imagination taking off: how many four-letter words does he know? What does 0x504f4e59UL mean? Is it R-rated or X-rated?

Actually, it's G-rated, as all magic numbers, and all technical documentation, should be. Try it to figure it out, you'll see.

If you can't figure it out, leave a comment and I'll tell you.