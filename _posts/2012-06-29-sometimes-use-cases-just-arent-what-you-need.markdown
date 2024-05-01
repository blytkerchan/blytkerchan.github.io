---
author: rlc
comments: true
date: 2012-06-29 03:50:47+00:00
layout: post
title: Sometimes, use-cases just aren't what you need
wordpress_id: 1878
tags:
  - requirements
  - requirements analysis
  - use-cases
---

I've written about use-cases on this blog before (parts [one](/blog/2010/02/use-cases-part-1-introduction-ingredients/), [two](/blog/2010/02/use-cases-part-2-what-use-cases-are-for-the-history-present-and-future-of-use-cases/) and [three](/blog/2010/03/use-cases-part-3-what-a-use-case-really-is/) of the sidebar on use-cases in my podcast come to mind) but I haven't really talked about when to avoid them.

When you get a new piece of hardware and a vague set of requirements, what do you do?

1. try to get the most out of the hardware you possible can
2. design to meet the need, using use-cases to guide you
3. a bit of **a**, a bit of **b**
4. other... (leave a comment)

<!--more-->

On a recent project, I was given a chunk of hardware (with specs! accurate ones too!) and a description of a function that hardware was to perform. The function in question was to interpret certain signals from various sources, allowing the selection of those sources through various criteria[^1]. The mandate was to build a future-proof chunk of software with a stable, high-level API and all the necessary logic between that high-level API and the actual hardware. This meant that the implementation would need to be able to stand the test of time: a number of years from now, future products using very similar hardware would only need to have the hardware-specific parts changed while the vast majority of the code would remain un-touched.

[^1]: The actual requirement was only slightly less vague.

Being presented with such a case implies that you need to identify a number of choices that will have to be left to future generations. Those choices, such as the weight of a piece of data from one source vs. the weight of the same kind of data from another source, would have to be documented and made configurable. The question is: configurable to whom?

The project in question already had the necessary tools and methods in place to convey configuration so, as I set to work specifying the chunk of software I was about to write, developing proofs of concept for the different concepts that needed proving and developing the software, a number of choices were made, documented, and made configurable. The user of the software would be able to provide default values, override values and diverse tweaks of the different algorithms in the code.

When the time came to specify the parts of the configuration that the end-user would be allowed to configure, however, the question quickly became, for each of the points that could be configured, "What is the use-case for this paramter?"

Use-cases are very good at capturing current end-user requirements. They are not so good at capturing requirements when those requirements need to be future-proof. That is because use-cases put you in a mode of thinking that is not helpful for future-proofing a system: they make you ask "what would the user do?". I.e. they restrict you to thinking about a specific task at hand that is a current or near-future need of an actual customer. This is an excellent approach for designing user interfaces, but it is no good if what you're designing is a complex system that will have to remain the same for a number of years and will have to interface with hardware that hasn't been invented yet. In such cases, you need to design on a more abstract (and therefore less concrete) level than use-cases allow for.

In fact, in cases where you need a long-term, innovative solution to a problem you know you will eventually run into but you don't have today, use-cases are harmful.

Yesterday, I read [this article](http://spectrum.ieee.org/semiconductors/processors/how-we-found-the-missing-memristor) about the discovery of the memristor. The first hint at the existence of the memristor arrived in 1971 in a theoretical paper by Leon Chua. The paper was difficult to understand and gathered dust for over thirty years before it finally served its purpose, explaining the findings of a group of researchers at an HP lab in California. Those researchers weren't given any specific use-case when they started their work on memristors: here's how the author of the IEEE Spectrum article, R. Standley Williams, describes it:

<blockquote>our goal was electronics that would keep improving even after the devices got so small that defective ones would become common. We ate a lot of pizza washed down with appropriate amounts of beer and speculated about what this mystery nanodevice would be.</blockquote>

The problem they were trying to solve was still 10-15 years away and all they really knew was that they wanted something _small_. The rest of their approach was mainly based on their collective experience and scientific curiosity. If they had been burdened with specific use-cases to solve (e.g. being able to store the contents of the library of congress on a thumb drive) they might well have taken a vastly different approach, we still wouldn't have a notion of memristors today and Chua's paper would still be gathering dust.
