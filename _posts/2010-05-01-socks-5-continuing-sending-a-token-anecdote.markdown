---
author: rlc
categories:
- Software Development
- Project Management
- Productivity
comments: true
date: 2010-05-01 12:00:31+00:00
layout: post
tags:
- Podcast (1.0)
- Programmer (0.8)
- Header files (0.9)
- Forward declarations (1.0)
- Preprocessor (0.7)
- Compile times (0.9)
- Development team (0.8)
- Project management (1.0)
- Productivity (0.9)
- Software projects (0.8)
title: 'Socks 5: Continuing Sending a Token - Anecdote'
wordpress_id: 584
---

Recording the latest episode of the podcast reminded me of a story that I'd like to tell you: a few years ago, I started working as a programmer on a project in which there was a policy to include the definitions of the classes used in a header - by including the headers that defined those classes - rather than what I recommended in the podcast: to use forward declarations. They also had a policy to use only the name of the file to include rather than the complete path (e.g. `#include "MyClass.h"` rather than `#include "path/to/MyClass.h"`). The reason for this was convenience: the preprocessor, when told where to look, would find the proper files and including them in the class' header meant you didn't have to use dynamic allocation (of which there was still a lot going on in the project) but you could use the objects directly, rather than references and pointers.

<!--more-->

It took me a while to realize how mis-guided this quest for convenience was: the project had grown rather big - and had remained monolithic - when I arrived and we were busily adding more code to it, so compile times could go into multiple hours (up to four hours when I decided to fix the problem, but too long for a lunch break already when I arrived) which meant we wanted to avoid recompiling "the planet" as much as possible. When it couldn't be avoided, we tried to start the build before leaving and running it during the night, it hopefully having finished when we got back to work in the morning. Of course, that wasn't always possible, so overtime was often necessary.

A few years into the project, I took the lead of the development team. At one point, I decided to fix the problem: from then on, we would use forward declarations as much as possible, we would remove unnecessary includes from header files and we would use complete paths to the header files. To kick-start that policy, I decided to do something radical: I removed the include path from the preprocessor directives and hit "build" - and kept doing that until it went through the build. That took me a little more than 40 hours, but it brought the compile time of the entire project down to about 40 minutes. In the time following that, I spent a lot of energy splitting the project up into smaller chunks, each of which build in ten minutes or less and each of which could be tested individually. This had the advantage of increasing quality as well as productivity.

Should you ever get started on a project on which the policy is one of "convenience" rather than one of productivity, you might want to keep this little true story in mind - or give the project lead my E-mail address. This is, sadly, not the only anecdote I have on project mis-management. In fact, in my opinion, _all_ productivity problems in software projects are project management problems.