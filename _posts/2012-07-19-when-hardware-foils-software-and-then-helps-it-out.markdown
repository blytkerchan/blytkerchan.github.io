---
author: rlc
comments: true
date: 2012-07-19 21:30:30+00:00
layout: post
title: When hardware foils software -- and then helps it out!
wordpress_id: 1895
tags:
  - debugging
---

Sometimes, an oscilloscope can come in very handy.

<!--more-->

About a year ago I was working on a signal processing driver that, for several weeks, I could seem to get to work correctly (part of the ordeal is documented [here](http://rlc.vlinder.ca/blog/2011/06/hardware-designers-please-think-of-us/). At the time, I was working under the assumption that I had a problem with the timing of the incoming signal (fronts were taking too long to get to my driver and the delay was both random and huge -- at least, that was the hypothesis). What I was trying to do is to get the signal I received to come out of the board somewhere, so I could probe it. There being no test points on the board anywhere[^1] the only way to do that was to output the signal through a GPIO[^2] and probe that (the incoming signal was tucked away nice and snug so I couldn't get at it).

[^1]: Test points are points on the printed circuit board where you can easily put an oscilloscope probe to see the current passing through the circuit they're connected to.
[^2]: A GPIO is a General-Purpose Input/Output. Software can use it to directly interact with the physical world. They can be programmed as either an input or an output and can be represented by a single bit or boolean in the software.

Once I got it working, the problem was relatively easy to see: the input signal had been inverted by an opto[^3]. Fixing the problem was a simple matter of inverting the signal I read on my GPIO before passing it to the parser.

[^3]: An "opto" is an optical coupler: it de-couples an electrical signal from a circuit by using a light on one end and an optical sensor in another. Thus, if there's a problem with the incoming signal's current or voltage, the opto might blow out, but the rest of the circuit remains in tact.

Yesterday, I was faced with a very similar problem: I am developing a driver that interfaces with an FPGA[^4] that decodes a signal very similar to the one I was working with a year ago. I plugged everything in together and voila! Nothing!

[^4]: An FPGA, or Field-Programmable Gate Array, is a chip you'll find in many modern circuits -- probably including your phone. It can be programmed with a firmware and thus coerced to do almost anything, including simulating a complete computer. FPGAs are often used as a relatively low-cost replacement for specialized high-speed circuitry, such as those required for certain types of signal processing.

I am happy to say my plea from last year has been heard, though: this time, I had a nice test point I could probe, giving me the signal exactly as it would be passed to the FPGA (so it was connected somewhere between the opto and the FPGA). What I saw was a beautiful almost-square wave pattern (these are differential signals, a little like RS-485) that was exactly the opposite of what I should be seeing (i.e. the signal was high when it should be low and vice-versa). One call to the guy who wrote the firmware for the FPGA and one E-mail later and I had a new FPGA firmware that did the right thing.

So, an ordeal was spared me, just by adding less than a gram of gold to a PCB[^5] in a few strategic places.

[^5]: A PCB is a Printed Circuit Board. If you crack open one of your gadgets you'll see a few of them. They're the (often red or green) boards with the little gold lines drawn on them and the little chip thingies sticking out. Don't touch! You'll ruin it!
