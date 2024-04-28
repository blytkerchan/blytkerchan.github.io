---
author: rlc
comments: true
date: 2016-04-02 19:16:09+00:00
layout: post
title: Shutting down servers
wordpress_id: 3810
categories:
  - Continuous Integration
  - Software Development
  - Software Engineering
tags:
  - cloud services
  - SaaS
---

I used to have a server with five operating systems, running in VMs, merrily humming away compiling whatever I coded. I say "used to have" because I shut it down a few weeks ago. Now, I have those same operating systems, as well as a large number of others, running on systems I don't need to worry about.

<!--more-->

Vlinder Software has never been in the business of maintaining servers: I've been running Continuous Integration builds on my software, building for all target platforms with all supported configurations, for the last several years now and have been doing that on my in-house server; but that was never a core business -- it was a necessity.

A few weeks ago, my server suffered a disk failure. I didn't have time at the time to do anything about it, so I just turned it off and let it be for a while: I wasn't working on anything that needed by CI build system, so aside from the daily builds the whole CI system was idle anyway.

Then I started hacking on [OpenDNP3](https://dnp3.github.io/) a bit: OpenDNP3 is a free, open-source DNP3 stack designed and implemented by Adam Crain[^1]. It's a nice stack and it appears to be fairly well-designed on the whole, but there are a few loose ends that I would address before using it in a product. For one thing, the database implementation is tightly coupled with the stack itself, which for my purposes is more than a nuisance.

[^1]: The same Adam Crain I mentioned earlier when talking about [the Crain-Sistrunk vulnerabilities](/blog/2014/01/the-crain-sistrunk-vulnerabilities/) and the then-upcoming [Aegis release](/blog/2014/03/what-the-industry-should-do-with-the-upcoming-aegis-release/).

So, I started hacking on OpenDNP3 a bit and, having added my [CMake configuration files](https://github.com/VlinderSoftware/cmake) as a dependency to allow for centralized configuration management (which allows us to generate configurations based on platform, environment, usage profile, etc.). I sent it as a push request to Adam's GitHub repo and, when I went to take a look, saw that a check had failed: [AppVeyor](https://appveyor.com) had failed to fetch the submodules and therefore failed to build.

As soon as I had fixed the issue, I decided to take a look at AppVeyor for my own Continuous Integration -- see if it could replace my in-house server. When I found it couldn't, I started looking around a bit and came accross [Travis-CI](https://travis-ci.org), which is mostly the same thing but running Ubuntu and OSX. That doesn't quite cover what my in-house boxes do, but it comes _very_ close.

While experimenting with this, at one point, a push into a public GitHub repository would start **34** build jobs in parallel. That might be over-doing it a bit for daily development...

I ended up toning it down to just four parallel builds -- two on Ubuntu and two on windows -- and for my release process I'll still have to resurrect my CI server to build and test my target platforms. For day-to-day work, however, Travis and Appveyor should do very well.

So, while my in-house server will still need to be repaired to use it for the builds that can't be done by Travis and AppVeyor at the moment, I _might_ also leave that alone and just run those builds manually in the release process...
