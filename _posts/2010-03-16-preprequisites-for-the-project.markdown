---
author: rlc
categories:
- Software Development
- Programming
- Operating Systems
- Version Control
- Integrated Development Environments
comments: true
date: 2010-03-16 04:16:33+00:00
layout: post
title: Preprequisites for the project
wordpress_id: 481
---

In this installment, we'll get you set up to compile everything that needs compiling in our project. We'll try to keep it short and sweet and you'll be able to download most of what you need just by following the links on this page.

<!--more-->

## Prerequisites

I'll be doing most of the development on a PC running Windows, but if you're running something else, rest assured you can still participate in the project without any problems: _all_ of the software we'll be using is portable except for the compiler itself, but a portable equivalent of the compiler exists for any system you might be working on. The code will be set up such that it will compile with any standards-compliant C++ compiler. The tools and libraries we'll be using will all be available for free, though in some cases they may nor be Free/Libre Open Source Software - but we'll try to avoid those cases as much as possible.

The following text contains quite a few links. Don't start downloading right away: the important ones are repeated at the end (the alternatives aren't).

When working on Windows, you'll need the [Windows SDK](http://www.microsoft.com/downloads/details.aspx?FamilyID=c17ba869-9671-4330-a63e-1fd44e0e2505&displaylang=en). You are free to use [MinGW](http://www.mingw.org/) or [Cygwin](http://cygwin.com) in stead, but you'll have a lot more compiling to do (because I will be giving you pre-compiled binaries for most of our prerequisites, compiled with the Windows SDK).

We will also work on Linux, in which case I will be using [Debian Lenny](http://debian.org). You're free to use any other distro - or any other OS whatsoever - if you like. If you run unto trouble, I'll be happy to help you out if I can.

For version control, we will be using [Git](http://git-scm.com/). For convenience, on Windows, you can use [Tortoise Git](http://code.google.com/p/tortoisegit/) for integration with Explorer. You'll be able to get the latest code for each of the projects we'll be working on from Vlinder Software's public Git server, located at http://git.vlinder.ca**:8080**.

If you go to the public Git server, there's two things you can do there already: you can go to the vlinder-sdk project and download vlinder.7z (you'll need [7-Zip](http://www.7-zip.org/) to unpack it) - but make sure you read the README file first: there might be some changes later on as we progress in the projects. The source code of everything in the SDK is available at the same location, of course.

If you want to use an IDE, you can use [Microsoft Visual Studio Express Edition for C++](http://www.microsoft.com/express/Downloads/#2008-Visual-CPP). You can use it with [Git Extensions](http://code.google.com/p/gitextensions/) to integrate Git in Visual Studio (I actually haven't tried this, so YMMV). If you do choose to use MSVS Express Edition, install it _before_ you install the SDK: installing the SDK will point MSVS to the proper compiler etc. which will save you headaches later.

If you'd prefer using free software (free as in speech: MSVS Express Edition is free as in beer) you can use [Eclipse](http://www.eclipse.org/downloads/moreinfo/c.php), but you'll have to recompile the SDK sources using MinGW. If you do, feel free to contribute the compiled binaries by uploading them to Git!