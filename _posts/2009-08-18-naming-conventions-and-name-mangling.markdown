---
author: rlc
comments: true
date: 2009-08-18 20:33:53+00:00
layout: post
title: Naming conventions and name mangling
wordpress_id: 171
tags:
  - naming
  - Posts that need to be re-tagged (WIP)
---

In C++, any name that starts with and underscore followed by an uppercase letter and any name that contains two consecutive underscores is reserved for any use [lib.global.names] and any name that begins with an underscore is reserved in the global namespace.<!--more--> The intent for this, as explained by several people on [comp.std.c++](http://groups.google.com/group/comp.std.c++/browse_thread/thread/6457179542578406) is to allow C++ name mangling to result in valid names in C (because the two underscores restriction does not exist in C).

A naming convention I have been using for a few years now includes a rule about scope: anything with member scope has one underscore at the end; anything with global scope (including static class members and enumerators) have two. Technically, this breaks the requirement of [lib.global.names]. I have yet to find a standards-compliant compiler, however, that is not able to handle this correctly. If you know of one, let me know.
