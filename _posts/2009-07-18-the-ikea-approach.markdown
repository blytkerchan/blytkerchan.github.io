---
author: rlc
categories:
- Software Development
- Programming
- API Design
- Software Architecture
- Software Deployment
comments: true
date: 2009-07-18 16:40:34+00:00
excerpt: 'spring cleaning brings it

  perhaps not any cleaner -

  at least much leaner

  '
layout: post
title: The IKEA Approach
wordpress_id: 14
---

Software usually comes as a single, monolithic block: you download a setup.exe or install.exe file, double-click it and see what happens. That's when the nightmare begins: except for a few software vendors, which include Apple, Sun and Microsoft but do not include some other big players, software doesn't usually integrate very well with.. software. Most Windows machines today are packed with applications that look out-of-place, don't interact well with other applications on the same machine, etc.

But the real problem is under the hood: it's why most applications are simply buggy. Most programmers will tell you that spaghetti code is probably the worst thing that can happen to them - especially if they didn't make it themselves. APIs are not well-defined, functions tend to do things you don't expect them to do, etc. A very clear example of this problem was given by Michi Henning in his recent article "[API Design Matters](http://queue.acm.org/detail.cfm?id=1255422)", in which he describes how the _select_ function is over-designed, and badly so. He goes on to design a better version of the well-known API function, that fixes a lot of the problems with the original, but is also less efficient (because it relies on the original to do the hard work).

The _select_ function is an excellent example of a poorly understood function that is used all over the world. There are several implementations of this function in several programming languages, but most are based on the [Single Unix Specification for select](http://www.opengroup.org/onlinepubs/009695399/functions/select.html), which defines both select and pselect and basically allows the implementation to implement select as a wrapper around pselect.

When you look at that specification, you can see how much effort went into trying to salvage the original BSD implementation. Most real-world implementations, however, ignore the first argument and aren't very efficient when there's more than a few file descriptors (see the discussions on [comp.programming.threads](http://groups.google.com/group/comp.programming.threads/topics?hl=en&lnk) on this topic). Hence, it's a good example of how things can get very bad very quickly. Of course, each of the browsers I mentioned above probably uses this function a lot...

Personally, I much prefer a _predictable_ approach to software design: every function is named for what it does (_functionally_), does only one thing, has a set of clear pre-conditions, fulfills a set of clear post-conditions (see [this search](http://www.google.com/search?hl=en&q=design+by+contract) for more info), gives a clear [guarantee](http://www.boost.org/community/exception_safety.html) (minimal, strong or no-fail) and is clear about [failing](http://www.google.com/search?hl=en&q=fail+fast) when it does. This extends beyond functions, of course, to object-oriented design.

I recently had a discussion about adding a "remote search" feature to a web browser. The person I had the discussion with wanted to have the browser access other running instances of the browser, search through its cache and perhaps have the other browser tunnel connections or do some of the searching for it [some of the details here are changed to protect [the guilty](/assets/guilty.html)]. I proposed to develop a separate daemon/service so the browser's development team wasn't affected by the remote search code, and could integrate it through a simple API. The person I talked to preferred the code to be integrated directly into the browser's core, to be forced to shut it down when the browser shuts down (something for which I had thought of a command channel into the daemon). That would (arguably) make GUI development a bit easier and would, according to the person in question, avoid being dependent on me for future updates.

Now, the kind of code I write generally allows for "easy access" in the sense that any-one who knows about C++ (or whatever the programming language I am using at the time) and english can read and understand the code, so the "dependency on me" argument - which is always the hardest to get out of - didn't stick very well. Any code I would write would be re-read and approved by the browser's core developers anyway, to make sure they do, in fact, understand the code and would be able to maintain it. My argument for creating a separate daemon was basically an argument against monolithic code that started with "don't get me started on monolithic code, please: too many bad experiences".

The point is: services like this (remote searching, distributed caching, etc.) are very good fits with a service-oriented architecture just like most (but not all) problems can be good fits for an object-oriented architecture. This is where IKEA comes in.<!--more-->IKEA ships their furniture in flat boxes that you can stack neatly together and that include everything you need to put your furniture together - except a screw driver. It containst the instructions to put everything together as a set of pictures (a picture is worth a thousand words and you don't have to translate them) and contains all the pieces with all the holes in the right places and all the screws of the right sizes. All you need to add is some sweat and some swearing - okay, no swearing.

That's how software should be. Of course, most software can't be completely picture-only in its documentation, but there's a lot you can do in a picture or in a video to explain what needs explaining (which is why I introduced demo videos as Vlinder Software). You open the box (double-click setup.exe or install.exe), follow the set-up wizard and install what you need, putting it all together as it should be.

## Good examples\*\*\*\*

The following are a few applications that I think are good examples on the _deployment_ side

- [![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/emptystar.png)](http://www.joomla.org/)[**Joomla!**](http://www.joomla.org/)
  is relatively easy to install, is based on Mambo and has extentions that allow you to extend almost any part of the CMS and customize it. The reason why I give it only a four-star rating is that it needs a bit more documentation.
- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)[**WordPress**](http://www.wordpress.org/)
  is very easy to install and lets you download and add plugins, themes, etc. from inside the installed application (something Joomla doesn't do)
- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)**[Debian GNU/Linux](http://debian.org)**
  Debian comes with an excellent installer that allows you to install the OS on practically any system. It also comes with an excellent package manager - apt - that tracks package dependencies very well and is very stable. IMHO, it's the best Linux distro around.

Notice that I didn't put any of my own software in here: in my first post, I promised not to do any gratuitous publicity on this blog :)

On the "under the hood" side of things, though, I can't get around using the examples I know best, which evidently include my own software.

- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png) [**Funky**](http://funky.vlinder.ca), for example
  embeds the interpreter as a single class but uses quite a few classes behind the scenes. Each function has well-defined behavior and does only what you would expect it to do. The one bug that got shipped, _ever_ was an assertion failure when your script had a valid, but unexpected, layout. Removing the assertion fixed the problem.
- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)Another example is [**Joomla**](http://joomla.org), again
  the people who designed Joomla have evidently understood the Model-View-Controller design pattern very well, and have made an excellent implementation of a CMS using it. I have used Joomla's code to explain the MVC design pattern on several occasions, as it is without a doubt the clearest example of it that I have seen so far.
- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)[Qt](https://web.archive.org/web/20170808091903/https://www.qt.io/developers/) is another excellent example
  originally created by TrollTech, then Qt Software, now Nokia, Qt is an excellent C++ framework for GUI design and implementation that is cross-platform, stable and pretty efficient for something that portable. [KDE](http://kde.org) is based on Qt, as are most of the interfaces of C++ programs we write at [Vlinder Software](http://vlinder.ca) today. Qt comes with excellent documentation, a predictable design and a full set of features for cross-platform development.
- ![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/fullstar.png)![](/assets/emptystar.png)**[the Linux kernel](http://kernel.org)**
  started out as a monolithic kernel, but has become more and more modular ever since and is now a very flexible kernel with a pretty good design where the internal APIs are concerned.

Each of these follow the basic rule of good design: being **predictable** and making simple blocks that fit together but do not depend on eachother. Just like a screwdriver doesn't depend on a particular screw and a screw doesn't depend on a particular screwdriver.