---
author: rlc
categories:
- Technology
- Software Development
- Linux
- Git
- CentOS
- RPM Package Management
comments: true
date: 2009-09-25 22:06:09+00:00
layout: post
tags:
- CentOS (0.9)
- Git (0.9)
- RPM (0.8)
- Source build (0.7)
- Development server (0.6)
- Dependencies (0.6)
- Installation (0.6)
- Home directory (0.5)
- Opt (0.5)
- Clone (0.5)
title: Installing Git on CentOS 5.2
wordpress_id: 216
---

I'm pretty sure that I'm not the first one to run into this, so I thought I'd blog how this works.<!--more-->

As I said [earlier](/blog/2009/09/running-a-lamp-debian-vs-centos/), one of my clients uses CentOS 5.2 in their production environment, so I need a CentOS 5.2 development server set up. I use [Git](https://git-scm.com/) for all projects I can use it on so I needed to install Git on CentOS 5.2. There is no RPM package for CentOS 5.2 for Git (the RPM package at kernel.org is for Fedora) so I had to build from source. Here's how I did it:

## Ingredients

- Git sources:

  $ wget

- Build-time dependencies:

  $ sudo yum install curl-devel expat-devel

Now you can make git by running

    $ make

Personally, I install packages like these, which are not part of the OS, in my home directory, under opt, which you can do like this:

    $ make prefix=${HOME}/opt

This should build without warning or error. You can now install it like this:

    $ make prefix=${HOME}/opt install

(Don't forget to re-specify the prefix: not doing so will force a complete re-build).

If you want to make your own RPM of Git, you need to clone git from the git repository: the "rpm" target uses git-archive, which needs to be run in a git repository.

HTH