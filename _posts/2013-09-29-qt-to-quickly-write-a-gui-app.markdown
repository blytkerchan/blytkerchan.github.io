---
author: rlc
categories:
- Software Development
- GUI Frameworks
- Programming Languages
- User Interface Design
- Productivity Tools
comments: true
date: 2013-09-29 03:14:51+00:00
layout: post
tags:
- GUI
title: Qt to quickly write a GUI app
wordpress_id: 2393
---

Today, my wife asked me to write an app that would tell her to sit straight every 15 minutes. I know apps like that already exist and I could've pointed her to one, but I decided to write one myself. The result is tannez-moi (which is French for "bother me").

<!--more-->

It's written in C++ and uses Qt as a GUI framework. It allows you to set a message, an interval and a start and stop time and displays the message in the system tray at the given interval between the given times. It stores its configuration in the registry so it remembers it when you start it.

It's been a while since I last used Qt to write anything new. It has a few flaws: the moc framework (which does the signals and slots) could use a better parser so it would pick up typos at compile-time; there's probably a lot more code than necessary; and it turns C++ RAII on its head, but for GUI apps, that's not really a problem.

It's very easy to build a functional app in a few hours with Qt Creator, which is what I wanted to do: less than 500 lines of code to get the thing to create a scrolling group of custom widgets, create a system tray icon with a menu, and create a timer that has it show a message from time to time -- really not bad.

I can't really compare it with anything though: this is the first time I did any GUI work in over three years, and back then I used Qt as well. I've never used Gtk+, .NET, wxWidgets, etc. with the exception of the app for this blog for Windows 8, which was more "configuring" than "developing".

Still I was pleasantly surprised by how easy it was to build this app...