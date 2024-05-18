---
author: rlc
categories:
- Software Development
- Embedded Systems
- Hardware Design
- Debugging
- Real-time Systems
comments: true
date: 2011-06-27 21:11:38+00:00
layout: post
tags:
- embedded software development (0.9)
- device driver debugging (0.8)
- real-time system (0.7)
- output signal (0.6)
- GPIO (0.8)
- hardware design (0.7)
- soldering iron (0.5)
- resistor (0.6)
- firmware debugging (0.7)
title: Hardware designers, please, think of us!
wordpress_id: 1551
---

One of the most time-consuming tasks in embedded software development can be device driver debugging. Especially if that debugging has to be done in a real-time system without disturbing its real-time characteristics. This usually amounts to producing an output signal on a pin of the CPU and probing the output to see what's going on. In order to be able to do that, the people who design the hardware have to keep in mind that the people who design the software will have some debugging to do on the final hardware -- even if it's just to make sure everything is working OK.

<!--more-->

I have recently spent a lot of time experimenting with different GPIOs to output a signal that I could probe on a system in its production setup (all of the final hardware, but with an open box).

Suffice it to say I tried...

In this system, the CPU was on a small board that was connected to a, somewhat larger, carrier board with two connectors. With all the other hardware on that carrier board, there was very little place left, and the only test points on the board were inaccessible once all the hardware was in place.

On the CPU board itself, there were no test points that could be used through GPIOs, though there were a few test points that will likely have been useful for hardware tests in earlier stages of development.

None of these were of any help for me, alas.

Now, because there were no "useless" signals that were let out of the two connectors, the only way to output anything that I'd be able to read on a scope was by hijacking a GPIO that was already used for something and hope for the best. The three signals I tried with that approach all ultimately proved to be a waste of time, so I was now, as they say, in a pickle.

I am no good with a soldering iron, but that was the only option left to me. So I asked for someone who does know how to handle a soldering iron in close quarters to put a lead on one of the connector's pins on a spare CPU board, and installed the modified OS on it...

And so the saga continues.

None of this would have been necessary if the hardware designers had let at least one GPIO out of the connector, just to hook it up to a resistor hooked to the ground. Granted, resistors aren't free -- but neither am I. I think the cost of one (or four) resistors would haveen amortized by the time I wouldn't have lost if they'd been there, easily accessible and documented as being for software/firmware debugging purposes.

So, if you're a hardware designer, think of us next time you design a board and leave a way out for a debug signal or two (or four).