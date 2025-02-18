---
author: rlc
categories:
- Technology
- Operating Systems
- Web Development
- Linux distributions
comments: true
date: 2009-09-22 02:35:32+00:00
layout: post
tags:
- CentOS (0.9)
- Debian (0.9)
- web application (0.7)
- PHP (0.6)
- server setup (0.5)
- Linux systems (0.5)
- RedHat (0.4)
- computer science (0.4)
- RPM format (0.4)
- apt (0.4)
- yum (0.4)
- LAMP (0.8)
- Linux Standard Base (0.3)
- package availability (0.3)
- user-friendly interface (0.3)
- maintenance (0.3)
- development (0.3)
title: 'Running a LAMP: Debian vs. CentOS'
wordpress_id: 197
---

One of my clients uses CentOS for the production platform of their (web) application (written in PHP). They've asked me to take over the development and maintenance of their web application, so, naturally, I set up a new server with CentOS 5.2, rather than the Debian installation I would normally use.

<!--more-->

I like Debian for a lot of reasons: it is generally a stable system that is well-documented, secure and easy to handle. The "easy to handle" part is, of course, because I happen to know my way around a Debian system. When I started out, seven years ago, professionally working on Linux systems, I started out on the then-current RedHat distro.

A lot has changes since then.

Sometimes I feel like a real geezer when I say that, but having memory go back a decade or more in computer science is like having a living memory go back to the middle ages in history: "civilization" started a few thousand years ago in "real" life, while it started only a few decades ago where computers are concerned. The age when computers arrived in the household is recent enough for me to remember it.

Anyway, back to the topic at hand. There are actually very few differences between CentOS and Debian: in many respects, they are very similar. I would argue that the CentOS installation is a bit more user-friendly in the way it set up its interface by default, but Debian has a better installer (apt) that CentOS does (it uses yum), though yum uses the RPM format while apt uses its own format - and RPM is the Linux standard, at least in the [Linux Standard Base](http://www.linuxfoundation.org/collaborate/workgroups/lsb).

Debian has a lot more packages available, though - but for running a LAMP, that doesn't change much.

So basically, for running a LAMP, I found them pretty much equivalent - though I will continue to prefer Debian because I know my way around better. Both do the job of running a LAMP just fine, both have a "when it's ready" approach to releasing and both are well-documented.