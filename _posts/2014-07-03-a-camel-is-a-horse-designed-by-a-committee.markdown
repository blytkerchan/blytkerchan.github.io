---
author: rlc
comments: true
date: 2014-07-03 03:59:21+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2014/07/a-camel-is-a-horse-designed-by-a-committee/
slug: a-camel-is-a-horse-designed-by-a-committee
title: '"A camel is a horse designed by a committee"'
wordpress_id: 3165
categories:
- Software Engineering
tags:
- design by committee
---

I don't usually use this blog to vent frustration, but I've been reading standards lately...

There are four versions of the horse:


  * **Pony**. Horses as the Good Lord intended them. Strong and sturdy, yet soft and cuddly; obedient yet intelligent; and I'm told they're rather tasty too!


  * **Horse**. All the qualities of the pony, without the esthetics.


  * **Donkey**. The beta version of the pony: strong and sturdy, but none of the frills and quite a few bugs in the programming. Also: they don't taste nearly as good (or so I'm told).


  * **Ass**. What the beta version became when the PMO took over.


  * **Cow**. A forked-off project from the (then open-source) Horse project that went for taste, combined with a bigger ass for the workload (in the form of an ox -- you didn't think I misspelled ass, did you?)


  * **Dromedary**. When some of the committee members got tired of trying to reach a consensus, they took what they had and ran with it -- even if it's running was more than a bit awkward.


  * **Camel**. None of the looks. Some of the features. Some features you didn't think a horse should have. Some you didn't think a horse _could_ have. More of the smell. Much, much more.


When _you_ count, that doesn't add up to four, does it?

That's what design by committee is all about!

<!--more-->

Let's take a look at a few protocols that deal with time and were designed by committees:

IEEE StdTM C37.118.1-2011 is a bit of a mystery to me. For one thing, it's supposed to replace IEEE StdTM 1344-1995 but is incompatible with it in ways that there's no reason to be incompatible.

IEEE StdTM 1588 is even worse: it defines PTP, the Precision Time Protocol. It's first version, PTPv1, is in compatible with its second version PTPv2, which is internally incompatible with itself as it defines two ways, one incompatible with the other, to measure the propagation delay of an event message.

IEEE 1588 uses TAI as its base ((TAI stands for International Atomic Time -- but just like I thought gigaoctet sounded too french, IAT just wasn't french enough...

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">&quot;I wanted to say gigaoctets but it sounded too French&quot; -<a href="https://twitter.com/blytkerchan?ref_src=twsrc%5Etfw">@blytkerchan</a></p>&mdash; Code Monkey Hate Bug (@jadamcrain) <a href="https://twitter.com/jadamcrain/status/461649300494483456?ref_src=twsrc%5Etfw">April 30, 2014</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

)). Most other systems use UTC (GPS being a notable exception). UTC is TAI plus a leap or 33. That means that when translating from a C37.118.1-enhanced IRIG-B signal to IEEE-1588, you need to apply a conversion -- and you need to apply it the other way around when translating back or producing time stamps. It's trivial, but it's frustrating nonetheless.

Actually, IEEE-1588 specifies eight different ways to synchronize the time, none of which compatible with one another. C37.238-2011 tells you which should be used for power systems. IEEE 1588-2002 has been adopted by the IEC as IEC 61588:2004 but is, of course, already obsolete.



<blockquote>Thyme is a herb that grows in gardens. Time is a system to measure delays and duration. Time zones are a way for governments to cause headaches to engineers.</blockquote>



Most protocols that convey information about time zones do either one of three things:



	
  1. convey the number of minutes to add to or subtract from UTC

	
  2. convey a table of time zone definitions and an index for the time zone to apply, the time zone definitions indicating information about the time zone, such as when daylight savings time starts and ends, and what the offset w.r.t. UTC should be, usually in seconds ((Usually, but not always, protocols that convey this much information do it well enough to convey the information right in all cases))

	
  3. convey the number of half-hours to add to or subtract from UTC



The third option is the oldest, and works well in by far most cases, but not for Chatham Island and Nepal: Chatham Island Standard Time is UTC + 12:45, Nepal Time is UTC + 05:45.

Daylight Savings Time is determined by the government of the day, and is therefore completely unpredictable: In Chile, in 2008, daylight saving time was extended 3 weeks, due to a severe drought. Two years later, it was moved due to an earthquake ((See [here](http://www.timeanddate.com/news/time/chile-extends-dst-2010.html))). In 2011 the government decided to end daylight saving on the first Saturday of April. Later this was postponed to the first Saturday of May.

Israel is even worse -- you can read all about it on [Wikipedia](http://en.wikipedia.org/wiki/Israel_Summer_Time), but the rule is basically "after Passover and before Yom Kippur, there might be DST for about 150 days a year, more or less". Computers don't generally know what the Knesset is going to approve, so it gets very hard to configure a system to handle Israel Daylight Time correctly.
Most people just don't try.


* * *


**Note:** this post turned out to be a lot denser than I intended. Some things may need clarification: 

  1. IRIG-B is a US military standard to synchronize time systems. It is simple, primitive and elegant as well as robust. It a the single-minded military flavour


  2. IEEE StdTM 1344 defines communications for synchro-phasors, and includes an extension to IRIG-B to communicate time zone and quality information.


  3. IEEE StdTM C37.118 replaces IEEE StdTM 1344 and includes a different, equivalent but incompatible, extension to IRIG-B


  4. IEEE StdTM 1588-2002 defines PTPv1, the Precision Time Protocol which is effectively intended to replace NTP and displace IRIG-B and its extensions. It was adopted by the IEC in 2005.
The first version of PTP didn't meet the goals it set out to meet, so a second version was created. This second version is not compatible with the first and the standard, though well written, is uselessly complex (not complicated, mind you, but complex).
Because of this complexity and to facilitate adoption in the industry, a committee in the IEEE Power and Energy Society drafted a standard to tell the industry how to use 1588. That standard is C37.238-2011


So at the end you have a standard to tell you how to use a standard which replaces a standard that supersedes a standard extension of a standard.

Time zones and DST are another extreme example of design by committee -- legislative or governmental rather than technical, but committee nonetheless.
