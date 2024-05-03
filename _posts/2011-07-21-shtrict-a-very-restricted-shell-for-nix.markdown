---
author: rlc
categories:
- Software Development
- Open Source
- Linux
- Security
- Programming
comments: true
date: 2011-07-21 02:47:08+00:00
layout: post
tags:
- restricted shell (1.0)
- shell server (0.8)
- firewall (0.6)
- GNU General Public License (0.9)
- commands (0.7)
- syslog (0.5)
- Ubuntu Natty (0.4)
- package (0.6)
- ZIP (0.4)
- DEB (0.3)
- sources (0.7)
title: 'shtrict: a very restricted shell for *nix'
wordpress_id: 1571
---

I needed a restricted shell for my shell server - the one that's available from outside my firewall, so I wrote one. You can download it under the terms of the GNU General Public License, version 3.

<!--more-->

It allows you to define a number of commands, which are the only commands that your users will be able to run. Everything the user tries is logged through syslog.

An Ubuntu Natty package is available [here](/assets/2011/07/shtrict-1.0.00.zip), rolled together in a ZIP (the DEB is inside).

Sources are available [here](/assets/2011/07/shtrict_1.0.00.tar.gz).