---
author: rlc
categories:
- Software Development
- Hardware
- Debugging
- Technical Specifications
- Device Communication
- Driver Development
comments: true
date: 2012-08-27 21:00:01+00:00
layout: post
tags:
- specifications
- technical specifications
title: On the importance of clear technical specifications
wordpress_id: 1906
---

Even when the code is working like a charm, technical specifications -- and their different interpretations by different people -- can lead to confusion and hours-long debugging sessions.

<!--more-->

I was recently working on a driver[^1] for a piece of hardware that contained three sets of registers[^2] that were very similar: the layout of each of the registers were the same (bit for bit) but their meaning was slightly different. The documentation for the device described the registers in three separate places: the first contained a list of all the sets of registers and their relative addresses, the second contained a list of registers for each set and the third described each register in detail. In these three places, the order of the sets of registers was different.

[^1]: A driver is a piece of software that talks directly to a piece of hardware and abstracts the function of that hardware for the operating system. For example, a driver for a hard disk provides an abstraction to the operating system that allows the OS to use the hard disk regardless of the way it needs to talk to the hard disk -- because the driver does all the talking.
[^2]: A register (like the one I decribe here -- there are different sorts) is one of the ways software can talk to hardware. To the software, they look like any other bit of memory, but unlike other bits of memory, the values are communicated directly to/from the device. That way, the precise way the computer talks to the device (e.g. through some kind of protocol, such as PCIe) is invisible to the software.

This kind of detail can cause a fair bit of confusion: the way I had mapped the registers[^3] followed the second description, which, to me, was the clearest one of the three. The registers looked fine when I polled them[^4] but something was amiss with either the logic of my driver or the logic of the device.

[^3]: In C and C++, we access variables through their names. Mapping registers basically means assigning a name to each register according to where they are in memory.
[^4]: Polling a register, in this case, consists of reading them with a special program that bypasses the driver's normal logic and shows the contents of the registers to the developer -- me, in this case. Such techniques can be very useful when debugging drivers.

In order for the device to work properly, one of the sets of registers had to have exactly the right value -- it had to correspond to a different, otherwise unrelated register value in the same device. Both values were "moving targets"[^5] so my driver had to time reading the first and writing to the second exactly right. Of course, because I had picked the wrong order to follow, the device didn't work properly.

[^5]: In that they changes automatically and fairly quickly

Luckily, this wasn't one of those devices that, when they don't work properly, start to smell badly (devices do that when they short and start to burn) and the problem was easily fixed by moving a few lines of code around. We also found the problem pretty quickly: one phone call to the guy who wrote the technical specification for the device, and a hunch about what the problem might be, pointed to the issue immediately. Still, such problems are avoidable.

A similar problem occurred, on the same device, about a week earlier: the specification talked about "masking" a certain number of bits in its registers. The definition I have of "masking" a bit (i.e. applying an AND[^6] operator on it) was different from the definition the firmware developer had (he applied a XOR[^6] to the mask), so all my bits were the inverse of what they should be -- at least as far as the control registers were concerned. Suffice it to say that didn't work out of the box either.

[^6]: Applying an AND operator on a bit with a mask, the result is 'true' if both the bit and the mask are 'true' -- false otherwise. I.e. 1 AND 1 is 1, 1 AND 0 is 0, 0 AND 1 is 0, 0 AND 0 is 0.
[^7]: XOR is an eXclusive OR, so 0 XOR 1 yields 1, 1 XOR 0 yields 1, but 1 XOR 1 yields 0 and 0 XOR 0 yields 0.

Combine these problems with errors in the device's schematics (signals that were indicated as normally high but were really normally low and vice-versa) and we have a lot of confusion where everybody thinks they're doing what they're supposed to be doing, but the devices just don't seem to agree.