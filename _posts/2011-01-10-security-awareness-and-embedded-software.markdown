---
author: rlc
categories:
- Cybersecurity
- Technology
- National Security
- Software Development
- Embedded Systems
- Network Security
- Denial of Service Attacks
- Critical Infrastructure
- Programming Languages
- Systems Programming
- Industry Standards
- Awareness Campaigns
- Public Policy
- Regulation
comments: true
date: 2011-01-10 00:12:46+00:00
layout: post
tags:
- interview (0.9)
- embedded systems (0.9)
- security issue (0.8)
- rootkits (0.7)
- BIOS attacks (0.7)
- access control (0.6)
- distributed denial of service (DDOS) (0.8)
- critical civilian infrastructure (0.8)
- web security (0.7)
- application layer (0.6)
- presentation layer (0.6)
- Singularity project (0.8)
- embedded software (0.8)
- systems software (0.7)
- C# (0.7)
- Java (0.6)
- C++ (0.7)
- programming languages (0.6)
- systems programming (0.7)
- radical change (0.8)
- industry productivity (0.7)
- security awareness (0.8)
- policy makers (0.7)
title: Security Awareness and Embedded Software
wordpress_id: 1148
---

In a recent interview with Ivan Arce of Core Security Technologies by Gary McGraw of Cigital, Arce made the point that embedded systems are becoming a security issue. At about the same time, US Army General Keith B. Alexander, director of the US National Security Agency, said that a separate secure network needs to be created for critical civilian infrastructure. They are probably both right.

<!--more-->

While Arce and McGraw were talking mostly about rootkits and BIOS attacks in the section of the interview I am about to quote from, I believe the points that they were making are more generally applicable. In fact, Arce is probably right when he expresses his view that embedded systems are becoming more of an issue because access to them is more widespread and cheaper and because the security of the code running on those systems is up to the standards of 10 years ago if anything, between 10 and 20 years ago (...) and these things are ubiquitous[^1].

[^1]: _Silver Bullet Taslks with Ivan Arce_; IEEE Security & Privacy Nov/Dec 2010 pp. 9-13.

That embedded devices are ubiquitous is a given: you probably have one in your pocket and the electricity being delivered to your computer as you're reading this is delivered to you through an electricity grid that contains more and more of these devices. Your computer itself also contains a plethora of embedded devices, as does your car, etc. Most of these devices would not be readily available as an attack vector and would cause little more than annoyance if they were attacked, but a distributed denial of service (DDOS) attack through a few thousand compromised Android phones or iPhones could wreak havoc on a nation's telephony services and, with that, anything that depends on those services (such as emergency services, etc.).

Similarly, comprimised embedded devices in a power grid could turn off power to several key facilities -- which just might be why General Alexander of the NSA would like a separate secure network for what he calls "critical civilian infrastructure".

From my point of view, McGraw is exactly right when he says: "The Web is getting a lot of myopic interest, with people focusing so much attention on the application layer and the presentation layer that they forget that this other area of attack exists"[^2]. He also asserts that "the attackers are not forgetting that."[^3] - and he might be right about that as well.

[^2]: ibid.
[^3]: ibid.

So, what should we do about this problem? Is Microsoft's [Singularity](http://research.microsoft.com/en-us/projects/singularity/) project on the right track? Should we radically change the way embedded software is made? Or should we just continue with "business as usual"?

Personally, I don't think Singularity is on the right track - at least not for embedded systems. Singularity is a Microsoft research project that aims to create dependable systems by writing the systems and tools in a higher-level language - in this case C# and Sing#, the latter of which is a "safer" version of C#. Although the computing power necessary to run C# is clearly available on PCs and most modern smartphones, there are good reasons for Apple not allowing any "interpreted code" on their platforms - and C# is interpreted, for all intents and purposes[^4].

[^4]: I am not advocating an all-out ban on interpreted languages on embedded platforms: not all interpreted languages are created equal and some are designed especially for embedded platforms. C#, however, is not designed for embedded platforms and is in the same class of general-purpose application languages as Java - but arguably less suited to embedded platforms than Java is.

Singularity is an attempt at radically changing the way systems software is written by using a higher-level language in stead of a language that is designed for writing systems software. C# is designed to write applications software and is, as such, not a suitable language for writing systems software as it lacks some of the very same biases that make C and C++ less suitable for writing applications software[^5]. If a higher-level programming language is needed for systems programming, I would prefer C++ over any derivative of C# or Java hands down: it provides the flexibility of any programming paradigm you might want to use[^6] as well as the systems-programming bias that, in my opinion, is needed for systems programming. For one thing, C++ is well-defined in a "bare" (free-standing) environment, meaning you can use it in a well-defined way to write a hosted environment.

[^5]: Don't take this to mean that I think C and C++ are not suitable for applications software: they are, but one does have to know what one is doing in order to get to the same kinds of productivity levels as one can get with Java and C#.
[^6]: Aside from object-oriented programming, C++ provides support for empirical, procedural, structured and functional programming -- something that most other general-purpose programming languages with a bias for systems programming do not. This allows the C++ programmer to use the most appropriate programming paradigm in any given situation, thereby arguably providing for the most approprate code, both in questions of maintainability as performance.

But there is also the matter of being an attempt at radical change: while I am all for radical change when it's warranted, radically changing the way an entire industry works is beyond the power even of a hegemon such as Microsoft. That is not a sufficient argument for it not being a good idea, though: for that, we need to take a look at what would happen if we were to radically change the way embedded software is written.

A rough, "wet finger evaluation" guesstimate of the number of embedded software programmers world-wide would be "millions": between about ten and twenty million programmers, about a quarter to a third of which work on embedded software - maybe less. Even if there were "only" a million, that's still the size of a small European country (Ireland, for example). Radically changing the way all these people work would entail two things:

1. stop them from working the way they work now
2. get them to work in the "radically new" way
   Of course, you'd also have to avoid them slipping back to their old, "bad", habits.

Thousands of lines of embedded code are being written every day. Stopping a few million people from being productive so they can be re-trained in a radically new way of thinking would prevent those thousands of lines of code from being written. That would mean that the industry's productivity would fall to zero - overnight. Once all those people are trained, we still have millions of lines of embedded code to maintain and, ultimately, replace using the radically new way of doing things. That means that technological progress -- which normally builds on the foundations laid by previous generations of technology -- would be ground to a halt as well. Also, among the millions of people that do embedded development today, many have years of experience -- all of which is down the drain if some radically new way of development is to be used.

In sum, radically changing the way embedded software is written is not only beyond the power of a hegemon: it's beyond the power of the global economy to support.

That radical change is neither feasible nor viable doesn't mean things shouldn't be changed: awareness for security issues in embedded software is lacking both among developers and among customers[^7]. This clearly needs to be fixed through things like awareness campaigns and education. Political awareness is also necessary, because policy makers ultimately force the issue when it comes to public security: if it isn't required by statute or regulation, the industry will not be willing to pay for it. Such change, however, is slow and needs to be pushed by many people to be effective: the millions of embedded software programmers as well as the customers, politicians and the general public.

[^7]: With customers I mean the people procuring embedded devices.

So let's start pushing.