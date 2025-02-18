---
author: rlc
categories:
- Technology
- Pharmaceutical Industry
- Barcode Inspection
- Data Matrix
- Vision Inspection Systems
- Research
- Privacy Concerns
comments: true
date: 2009-07-29 01:17:58+00:00
layout: post
tags:
- pharmaceutical industry (0.9)
- vision inspection systems (0.8)
- cameras (0.7)
- barcodes (0.9)
- datamatrix (0.8)
- Optel Vision (0.6)
- MIT (0.7)
- Bokode (0.8)
- RFID (0.6)
- positioning (0.7)
- privacy concerns (0.8)
title: Storing data in an optical illusion
wordpress_id: 90
---

For the past five years now, I've worked on vision inspection systems for the pharmaceutical industry. In those years, I have seen many applications in which cameras were used to read data on bottles, cartons, even tablets. Barcodes can be printed almost anywhere and can be of almost any size. One application I've worked on - with a whole bunch of other people, of course - had [Optel Vision](http://www.optelvision.com) systems inspect datamatrix 2D barcodes with ten digits in it (a 12x12 ECC200 datamatrix) printed on only 3x3 mm on the neckband of a vial. The system had to be able to inspect several dozens of these a minute, using VGA resolution cameras - and they were small enough that it was hard to find them if you didn't know where they were.
Let's just say this was one of the more challenging systems.

<!--more-->

Now, [researchers at MIT](http://web.archive.org/web/20150410133041/http://web.media.mit.edu/%7Eankit/bokode/) have come up with a new way to print data matrix barcodes: the barcodes are printed in a 3mm dot that looks like little more than a blot but, if looked at with a camera that's set out of focus, contains one or more data matrix barcodes. With that, the code will not just be hard to find - it will be all but impossible to find if you don't know it's there.

I'm wondering what this will be used for: storing information in almost anything is already possible, using RFID, for example. Even if Bokodes are very small and, for the naked eye, difficult to identify, it is a line-of-sight technology. Unlike RFID, which allows the Wal-Mart cashier to see that you have a bottle of blue pills in your pocket, a camera has to be in the line of sight of the Bokode, not just in proximity.

The authors suggest using it for positioning, encoding position information in each of the data matrices encoded in the Bokode, and show that it can be very accurate for that purpose. Use in research, and perhaps off-the-shelf video games, may be obvious uses that could be developed in the short term. I wonder, however, what's next? What would the privacy concerns for this be?