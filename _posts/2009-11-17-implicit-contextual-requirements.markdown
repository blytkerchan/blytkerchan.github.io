---
author: rlc
comments: true
date: 2009-11-17 20:59:37+00:00
layout: post
title: Implicit, Contextual Requirements
wordpress_id: 379
categories:
  - Opinions
  - Software Design
  - Software Development
tags:
  - Posts that need to be re-tagged (WIP)
  - requirements
---

We tend to forget what we know implicitly: if we've been working in the same domain for long enough, we tend to forget that not everybody knows the same things and has the same experience we do. For example, some-one who has been working in distribution for a long time may think it's obvious that, even if you do switch to RFID, you will still need line-of-sight machine-readable codes (because RFID might fail and because the technology for using line-of-sight machine-readable codes is much mire ubiquitous than RFID is) and when they think of line-of-sight machine-readable codes, they think of barcodes and, depending on what and where they distribute, they might think of Data Matrix codes, UPC-12 codes, or any number of other barcodes.

<!--more-->

For some-one who has been working in a different field, e.g. travel documents, "moving to" RFID has an entirely different meaning: it enables adding biometric data to those travel documents, it enables reading those documents at a certain distance, etc. It doesn't necessarily make sense to have barcodes on travel documents, so the requirement of having them may be far less obvious.

As long as we all stick to our industries, that's just fine. But as soon as we change the industry we work for, these "implicit" requirements may make quite a difference - especially if they are not written down in documents such as requirements specifications.

Similarly, some requirements _are_ written down that may seem obvious to the reader, whereas they are not all that obvious to the author of the specification. You'd think that that would be a far lesser evil, until you find that your readers are starting to skip whole chapters because they think you're kicking in an open door.

This type of mis-communication is almost always a real problem: requirements that are not correctly understood because they are not explicit enough or because they were hidden among other requirements that seemed so obvious that the reader skipped them cost money both in the short term (discarding them for whatever reason may influence the design of the solution in such a way that supporting them later costs more) and in the long term (adding support for requirements later in the development process tends to be more expensive, and verification and validation tend to follow the same requirements specifications as development does, so lack of support for discarded requirements are often found later than broken support for requirements that were understood.
