---
author: rlc
categories:
- Engineering
- Invention
- Software Development
- Research and Development
comments: true
date: 2016-09-13 01:20:13+00:00
layout: post
tags:
- engineering (0.9)
- software (0.8)
- inventor (0.7)
- lab (0.6)
- clock synchronization (0.9)
- electricity grid automation (0.8)
- debugging (0.7)
title: 'Debugging — or: what I do for a living'
wordpress_id: 4100
---

I am often asked by friends and acquaintances of various backgrounds, what I do for a living. Depending on my mood at the time, I can answer in any number of ways, but invariably my answers are met with blank stares, questions that clearly demonstrate that I have once again failed to make myself understood and an eventual change of subject.

<!--more-->

My beautiful wife sometimes tells people I'm a software engineer. There are two problems with that answer: first, while I do have the job of a software/firmware engineer, I don't have the title -- I don't have an engineering degree and I'm not a member of the Quebec Order of Engineers. Second, there are many different types of software engineers who do a variety of things, including designing web applications. Most people's experience with software boils down to web apps, phone apps and desktop applications. I don't do any of those things: I stay away from GUI design if I can, and generally avoid writing software that interacts with humans.

<img src="/assets/2016/09/image-1-778x1024.jpeg" alt="Self portrait as an inventor (cartoonish rendition)">

My son tells people I'm an inventor. I've worked on several patent applications lately, have one patent to my name already, and generally work with devices that do _things you didn't know needed doing in ways you don't understand_. Obviously, I like this description of my job, but it over glorifies the process a bit: the somewhat cartoonish idea people have of inventors doesn't quite do justice to my _métier_ but the rendering is fearfully close to reality sometimes. Still, I don't just have ideas pop into my head and then, with the pressing of a few buttons, apparently materialize out of thin air.

So, what _do_ I do for a living? Well, lately, I've been spending a lot of time here:

<img src="/assets/2016/09/image-1024x840.jpeg" alt="The lab, a.k.a. the torture chamber">

This place is the "lab". This is where we torture devices until they break -- and devices torture us by breaking when we don't intend them to. The devices are hung in racks and connected to each other by (electrical) wires. When I spend my time here, it usually means something is wrong with the way they handle those connections -- and usually, that "something" has something to do with time synchronization.

You see, one of the things I work on, on a daily basis, is the clock function of a substation automation platform -- a device that can function as a data concentrator, protocol translator, system controller, and a clock. For the clock function of that device, which is surprisingly complex if all you know is the wall-clock you find in your kitchen, I am responsible for maintaining (and have written large parts of) every part of the firmware and software stack. This includes the firmware on programmable devices you wouldn't normally consider computers[^1], as well as software that people can actually interact with[^2].

[^1]: Called "field-programmable gate arrays" or FPGAs, which are basically intergrated circuits that you can reconfigure "live".
[^2]: Which is what I just told you I generally try to avoid.

If you've been following this blog for a while, you know I can program in C and C++, as well as VHDL and a few other programming languages. Much of that programming is done for these types of devices -- devices "normal" people usually don't interact with -- and has those devices behave in very specific ways according to very specific (but not completely specified) requirements. My job consists of four things: elucidating those requirements; designing a solution that can be implemented in C++, C, VHDL, ... to meet those requirements; implementing that solution in C++, C, VHDL, ...; and verifying that the requirements are indeed met by the solution. My main areas of expertise, when it comes to this electricity grid automation stuff[^3], are in the DNP3 protocol, security (especially secure authentication) and in clock synchronization.

[^3]: For this product line, at least.

None of this is done alone: requirements elucidation involves people with a variety of backgrounds and a variety of interests, which leads to a number of interesting discussions and an often-slightly-off understanding of what each of us means. Designs need to be verified, explained, elucidated, documented, approved, discussed, etc. so while I may be responsible for the design of the clock function I've been working on for the fast few days, weeks, months and years, I am certainly not the only person to have worked on it. The implementation process is similar: so far five people have worked on the implementation of this particular function. Every line of code has been reviewed at least once (by me if I didn't write the line of code in question) and has been subjected to numerous validations, verifications and tests. Thousands of person-hours go into a complex function like this one and large swaths of code are written without ever making it into the final product. Most of this work happens behind a desk, though some of it may have happened in an armchair, or in the lab. Verification and validation, while partly happening contemporaneously with programming, is done both by the R&D[^4] team I am a part of, but also by quality control and assurance teams independently. All of it is team work.

[^4]: Research and Development.

Why all this effort for a "simple" clock? Well, the clock is only an example, but it is an important function for electricity grid automation: clocks and clock synchronization are used throughout the grid to time-stamp events and data, and to synchronize devices that use the time for things such as phase measurement[^5], which has an influence on the amount of energy that is lost between generation and consumption, which in turn affects your electricity bill as well as all the electric devices in your home. To obtain the quality of service -- the quality of the time signal -- we want, we have to be within a few hundred nanoseconds of reality: less than a millionth of a second off. One of the issues we recently ran into involved a time signal that was about a thousand times worse than expected in terms of quality. The system could read the signal, but could not obtain a good enough lock to generate a signal within its specifications -- close, but not quite. It took a few days to thoroughly analyse and understand the problem and adjust the implementation to it, but the device is now capable of generating a signal that is more than a thousand times better than the signal it receives, but contains the same information[^6].

[^5]: That is: checking that your 60 Hz electricity coming out of your wall is really at 60 Hz.
[^6]: The underlying mechanisms for this are my invention, and patent pending.

This is called "debugging": in general software engineering for web apps, cellphone apps and desktop applications, debugging is ironing out the kinks so your phone won't crash if you try to load a site. In my kind of software/firmware engineering, debugging is taking a signal that is outside the limits of what the device's specifications would allow, and making sure that the device will not only use that signal, but will reproduce that signal with a much better quality by applying filters and transformations.