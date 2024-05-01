---
author: rlc
categories:
- Technology
- Cybersecurity
- Utilities
- Software
- Networks
- Firmware
- Exploits
- Vulnerabilities
- Risk Analysis
- Attack Vectors
- GPLv3
- Consortium
- Cyberterrorism
- Smart Grid
- Law Enforcement
comments: true
date: 2014-03-01 14:59:43+00:00
layout: post
title: What the industry should do with the upcoming Aegis release
wordpress_id: 3074
---

[Automatak will be releasing](https://web.archive.org/web/20150308032035/http://automatak.net/wordpress/?p=482) the Aegis fuzzing tool publicly and for free for the first time in a few days. Like I said yesterday:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Can hardly wait:  &quot;2 weeks until Aegis™ release&quot; <a href="http://t.co/KrQkrbb9a9">http://t.co/KrQkrbb9a9</a></p>&mdash; Ronald (@blytkerchan) <a href="https://twitter.com/blytkerchan/status/439582028259147777?ref_src=twsrc%5Etfw">March 1, 2014</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

to which Adam replied:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/blytkerchan?ref_src=twsrc%5Etfw">@blytkerchan</a> I just hope the industry is ready!</p>&mdash; Code Monkey Hate Bug (@jadamcrain) <a href="https://twitter.com/jadamcrain/status/439774683827679233?ref_src=twsrc%5Etfw">March 1, 2014</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I don't think the industry is ready -- and here's why.

<!--more-->

Most vendors, including the one I work for, have released fixes for the vulnerabilities that have been exposed so far using this tool and have made their customer base aware of the problems and the scope of those problems. Some vendors regrettably have been far less pro-active than others, but I'd like to believe most vendors have made fixes available to their customers, even if they haven't been public about it[^1].

[^1]: I have no way of knowing that, of course, but it is the only way to account for the apparent silence on the part of some vendors and still have some faith in the quality of their products and the way they handle security issues.

Fixes have been available to utilities for a few months now, but utilities are very slow in upgrading their device firmware: before they accept a firmware upgrade, they go through a battery of tests to make sure the firmware still meets interoperability requirements (so everything in the system can continue to communicate and existing configurations still work) and some will ask their vendors for special versions, fixing only the specific problem in older the versions of the firmware they're using. This is usually must easier said than done, which adds to the time before an upgrade can be done.

Upgrading firmware on a large number of devices requires those devices to be restarted, which means parts of the network have to be turned off for (hopefully small) periods of time. While that doesn't necessarily mean anyone will be without power for any period of time[^2] it does mean that the network's capacity for taking power from the production site to the consumption site (your home or business) will be reduced for the time the upgrade is going on.

[^2]: It will mean exactly that for parts of the network where there's no redundancy available).

Winter and summer are bad times for planned outages: the grid is stressed by the extra power consumption that comes with the necessary temperature control -- necessary because warm-blooded though we are, we do like our houses and offices to be warm in the winter and not too hot in the summer -- so for as far as there's a "right" time to upgrade firmware and install these fixes, that time would be in about a month or two, a month or two after Aegis is released to the public.

Utilities have a head start vis-a-vis the hackers, crackers and terrorists that would want to use Aegis to attack the grid: they already have all the equipment necessary and already know the layouts and weak spots of their networks. They've known Aegis was coming for a while now, and they know the vulnerabilities that have already been found -- even some that haven't been published yet. If anyone uses Aegis to exploit a vulnerability in the short term, it will not be a zero-day exploit.

Hopefully, utilities will already have performed the necessary risk analysis and attack vector analyses taking into account the new vectors that Crain and Sistrunk have exposed. They will not be able to test new firmware against Aegis and the exploits that will be included with it.

However, Aegis, as presented on Automatak's site, is a platform rather than a tool: you can use it to develop more fuzzing tests which will not necessarily become public: while Aegis will be published under GPLv3, the GPL only requires the distribution of source code if the software is distributed in any other form as well. A terrorist that wants to abide by copyright law can still develop their own exploits and keep them to himself as long as he doesn't distribute them. There's also nothing to oblige him to publish exploits under GPLv3 if he doesn't modify Aegis to become dependent on them in any way -- just like you don't have to distribute all your Bash shell scripts even though Bash is GPL copylefted.

So, while utilities have a head start, they need to hit the ground running if they want to keep it: they need to actively develop their own exploits and they need to pool their resources to develop them to mutual benefit.

Vendors need to do the same: they cannot just download the tool, run a few scripts and think they're done. They need to harness the knowledge they have of their own products and try to find ways to exploit their weaknesses -- and then fix those weaknesses. Again, they do have a head start, but they need to hit the ground running.

Automatak is mounting a "consortium" that would allow just this, but access to which is not free. In my opinion, they should consider tiered membership to his "club of insiders", as vendors will not be willing to cough up the money to pay for membership in a club their own vendors should be members of: a large part of the industry uses the same software stack for the DNP3 protocol and vendors will reason -- and rightly so -- that they're already paying good money for a product, they shouldn't have to pay for the tool that breaks the product as well. Still, many vendors will be willing to participate in strengthening the protocol implementations (they have a vested interest in doing so), but contributing time and the by-product of internal research will often be easier than contributing money.

I do not think we'll see a sudden surge in cyberterrorist attacks on the smart grid: effectively attacking the grid remains a difficult proposition that takes planning and know-how and, therefore, fairly large amounts of money. The risk of getting caught is far from negligible as someone suddenly starting to buy all the equipment needed to mount an attack is sure to raise a few red flags and organizing an attack with several people involved would likely raise a few eyebrows along the way as well -- judicious use of tools and technologies such as Tor and steganography notwithstanding. That means that when an attack does come, either law enforcement will have seen it coming and hopefully coordinated with utilities to thwart it, or it will be big.

Under the meme "hope for the best but prepare for the worst" ... I think you can see where I'm going.