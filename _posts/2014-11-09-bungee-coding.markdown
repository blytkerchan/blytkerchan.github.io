---
author: rlc
categories:
- Software Development
comments: true
date: 2014-11-09 02:15:19+00:00
layout: post
title: Bungee coding
wordpress_id: 3158
---

For the last few weeks, I've been doing what you might call _bungee coding_: going from high-level to low-level code and back. This week, a whole team is doing it -- fun!

<!--more-->

For the project this post is about, several layers had to be developed, from programmable logic in [structured text](http://en.wikipedia.org/wiki/Structured_text), to FPGA logic in [VHDL](http://en.wikipedia.org/wiki/VHDL). The project involved, among other things:

- digital signal processing
- Fourier transforms
- in-hardware scheduling
- hard real-time constraints
- a Web interface
- programmable (PLC-style) logic
- synchronization of three different distributed clocks
- development of a new device driver
- integration of several protocol stacks (DNP3, C37.118, ...)
- code generation with Python
- ... etc.

The whole project lasted a little over two weeks, involved four hardware engineers, four software engineers, one domain expert, one project manager, one mathematician, and a budget of about $2000, excluding HR and food.

My role in this project involved writing most of the VHDL code, technical design and technical coordination. The PM's job was mostly non-technical coordination (scheduling rooms, traveling arrangements for team members being flown in, etc.) and the other soft- and hardware engineers each did their part in design and code (or hardware, as the case may be).

The funny part, though, is that it all started with an off the cuff remark of mine that was meant to be a joke: "Surely we can implement [this project] in a week or so!" I said, to the PM, who took me seriously.

It's the kind of project I like: fast-paced, with new things to learn, several challenges (how to get the data to the CPU with the available bandwidth? how to run eight FFTs every four milliseconds with the available FPGA resources and leaving time for the CPU to react? how to ... etc.), and high-level (Python), mid-level (C, C++) _and_ low-level (VHDL) code to write and integrate.

Did we succeed? Yes, we did: we had a proof-of-concept running in less than eight days. At the outset, nobody thought we could -- not even me -- but at least three of us (the PM, his boss and myself) thought we should try. _That_ unblocked the necessary resources and _that_, with some effort and a lot of know-how on the part of all the team members (between us we had over 60 years of experience in software development and almost a century in hardware development -- a very experienced team), allowed us to pull it off.

---

(This post was delayed several months before publishing...)