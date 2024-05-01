---
author: rlc
comments: true
date: 2013-11-30 20:11:40+00:00
layout: post
title: "Perl: Practical or Pathologically Eclectic? Both?"
wordpress_id: 2415
tags:
  - perl
---

There are two canonical acronyms for Perl: "Practical Extraction and Report Language" and "Pathologically Eclectic Rubbish Lister". Arguably, Perl can be both.

<!--more-->

I like Perl for a number of things: I sometimes run tests that generate a lot of raw data (temperature measurements, frequency measurements, etc.) and then run Perl scripts on that data to extract the information I need (e.g. distribution statistics). An alternative would be to dump the data into a spreadsheet and let an Excel look-alike play with it, but I usually have too much data for that, so I need Perl to pre-chew the data before I can let an Excel look-alike generate the nice little graphs that go into the reports.

Another thing I like Perl for is to take database dumps and convert them into code. One example of that type of use for Perl is taking the Unicode database's CaseFold.txt file and turn that into case-folding code (which allows case-insensitive string comparisons, among other things). This works remarkably well and also happens to be what I first used Perl for, back in the days when I did interactive television in France.

So, it's the practical side of Perl that keeps me coming back to it when I have a lot of data and I need to do extraction and reporting (or code generation).

Perl shows its eclectic side mostly in its error messages -- who knew you could bless a hashref? And who knew `keys` needed one of the unblessed variety?

Most of the time, these simply result in a snicker -- or maybe a good laugh -- which may be a welcome reprieve from the frustrations other parts of the job tend to present.

Another part of the eclectic side of Perl shows in its syntax: it is extremely versatile and, once you set your mind to it, strangely coherent, but, umm.. `@{${$t}{$_}}`? really? (That, by the way, is getting an array from an array reference from a hash reference at the key that is indicated by whatever is lexically "current").

But it really is strangely coherent: once you understand that `$_` is whatever is current, and you grok the logic of what "current" means, you can see that `${$t}{$_}` in which `$t` is a hashref, must be whatever is at that key in the hash referenced by `$t`.

So IMO, the jury is still out -- much like it is still out on the French Revolution: Perl is certainly eclectic, but perhaps not pathalogically so.

It is, however, certainly practical/
