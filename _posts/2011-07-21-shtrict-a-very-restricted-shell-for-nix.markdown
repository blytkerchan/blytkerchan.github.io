---
author: rlc
comments: true
date: 2011-07-21 02:47:08+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2011/07/shtrict-a-very-restricted-shell-for-nix/
slug: shtrict-a-very-restricted-shell-for-nix
title: 'shtrict: a very restricted shell for *nix'
wordpress_id: 1571
categories:
- Software
tags:
- software
- tools
---

I needed a restricted shell for my shell server - the one that's available from outside my firewall, so I wrote one. You can download it under the terms of the GNU General Public License, version 3.
<!--more-->
It allows you to define a number of commands, which are the only commands that your users will be able to run. Everything the user tries is logged through syslog.

An Ubuntu Natty package is available [here](http://rlc.vlinder.ca/wp-content/uploads/2011/07/shtrict-1.0.00.zip), rolled together in a ZIP (the DEB is inside).

Sources are available [here](http://rlc.vlinder.ca/wp-content/uploads/2011/07/shtrict_1.0.00.tar.gz).

On Gitorious, the code is here
