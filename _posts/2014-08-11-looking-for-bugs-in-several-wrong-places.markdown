---
author: rlc
comments: true
date: 2014-08-11 20:30:11+00:00
layout: post
title: Looking for bugs (in several wrong places)
wordpress_id: 3254
tags:
  - debugging
---

I recently went on a bug-hunt in a huge system that I knew next to nothing about. The reason _I_ went on this bug-hunt was because, although I didn't know the system itself, I knew what the system was supposed to do, and I can read and write all the programming languages involved in developing the system (C++, C and VHDL). I'm also very familiar with the protocol of which the implementation was buggy, so not knowing the system was a minor inconvenience.

These are some notes I took during the bug-hunt, some of which intentionally kept vague so as to protect the guilty.

<!--more-->

The first thing I did, of course, was confirm the bug's presence in the latest version of the system, with a minimal configuration. The minimal configuration necessary turned out to be fairly minimal, and using the default settings of the system, so this was easier than I expected: it just took two systems (one doing the talking, one doing the bugging), a few wires and an oscilloscope -- all of which I had on or around my desk[^1].

[^1]: I try to walk at least 10,000 paces a day, but this bug wasn't going to get me away from my desk a lot...

I also confirmed that an older version of the system did not have the bug, thus verifying both my method of testing for the bug and the assumption that the bug was, in fact, new. That having been verified, I made my first mistake.

## The first mistake

Assuming that, the bug being new in the system, and the protocol being implemented in the system's firmware, the firmware _must have_ changed, I proceeded to installing the necessary tools to work with the firmware's code (the proper versions of the toolkits used for the chips in question: one FPGA and one DSP).

I then spent a good part of the day combing through the code of the FPGA and the DSP to understand how, together, they implemented this protocol. This is where I hit the first snag: if the DSP and FPGA were used properly, there was no way for the bug _not_ to occur -- i.e. I had a very hard time understanding how this could ever be expected work in the first place. So I thought "Eureka!" and went looking for the previous version of the firmware to confirm that this is how the bug had been introduced.

_This_ is where I found out that the firmware had in fact _not_ changed between the version that worked and the version that didn't: the code I was looking at hadn't been changed in nearly a decade -- and was therefore quite capable of working as expected, thank you very much.

Now, FPGAs can be a bit finicky about timing constraints, but **both versions of the system used the same binary for the firmware** -- this was not a question of the compiler spitting out random hogwash: something entirely different was going on (and I was obviously missing something in understanding the DSP firmware's code).

## The second mistake

I had come to the conclusion that, as the firmware hadn't changed between the version that worked and the version that didn't work, the bug therefore had to have been introduced in either the OS or the application software. One of the places I knew had changed was the configuration tool, so I added a trace in the OS to show how it had interpreted the configuration regarding the bit that I was interested in.

The trace told me the configuration bit for the feature I was interested in was interpreted correctly -- _so I discarded the configuration as an option for the culplit_.

I therefore set out searching for other parts of the code that had changed -- and there were plenty.

Most of these parts could be set aside because they weren't used in the configuration I was reproducing the problem with. Some were used, but turned out (after investigation) not to cause my bug. I was on a wild goose chase.

Having come to that conclusion, I turned back to the firmware, and wrote a tool to dump the firmware's status in both cases. Having written the tool, I executed it and compared the results for both of the versions -- and found no difference.

## Reboot

It had now become obvious that

1. there was something I didn't understand about the way the firmware worked; and
2. while the firmware hadn't changed, the way it was being used had changed, and all options were back on the table regarding that point.

I.e. I had overlooked something.

I therefore set out to narrow the field: find the version in which the problem had been introduced, look at the changes between the last version that worked and the first version that didn't, and find the problem.

This approach, although tedious and best left to an intern if you happen to have one, is very effective -- especially if you optimize it a bit. Your ingredients are basically this:

- _N_ versions, some of which work, some of which don't
- a fairly clear-cut way of distinguishing between a version that works and a version that doesn't; and
- the knowledge that Version 1 works, Version N doesn't.

Following the basic principles of a binary search and Dijkstra's search algorithm[^2] I set out to test whether Version $\frac{1}{2}N$ worked -- it did not. I then tested version $\frac{1}{4}N$, version $\frac{3}{8}N$, etc. until I had identified the last version that worked and the first version that didn't. As there were ten versions to pick from, I ran the tests on versions 5, 3 and 4 to find out that the bug had been introduced between versions 4 and 5[^3].

[^2]: The one where you have marbles of three colors: red, white and blue, and you need to put them in order looking at each only once.
[^3]: Had I done a linear search, I would have tested five versions to get the same information, so I saved myself two tests.

Having put all my options back on the table w.r.t. the components of the system that might have introduced the bug, I proceeded to eliminating those that were not configured in the system I was using, but keeping those that I had considered candidates before and eliminated with some other filter. The premise was that, while I had mistakenly discarded candidates before, software that is not installed on the system, neither when it has the problem nor when it does not, cannot cause the system to change its behavior.

I then proceeded to investigate the changes in the parts that I had discarded early in the bug-hunt, starting with the configuration tool (which was the first candidate I had originally discarded).

And that's where I found the bug, hiding in plain sight: a change in the configuration tool's GUI had changed a default setting that was supposed to be ignored by the firmware in the mode it was configured in -- but wasn't. Setting the value back to the old default fixed the bug.

## Conclusion

While I ended up with a better understanding of how the system works, that was not what I set out to do: I set out to find and kill a bug and, while I did that, I also ended up wasting time on a wild goose chase because I dismissed the location of the bug as a candidate when the setting I was looking at was reported correctly.

Had I started out with a black box approach, searching for the first version of the system with the bug and opening the box only then to see the difference between the last version that worked and the first one that didn't, I would probably have found the bug quicker[^4].

[^4]: We'll see how that works out the next time I have a bug to hunt in a complex system I don't know.
