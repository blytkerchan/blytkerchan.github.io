---
author: rlc
categories:
- Software Development
- Source Code Management
- Version Control Systems
- Distributed Versioning Tools
- Documentation Management
- Integrated Development Environments
- Hardware Management
comments: true
date: 2010-01-08 04:24:21+00:00
layout: post
tags:
- software development (1.0)
- source code (0.9)
- documentation (0.8)
- integrated development environment (IDE) (0.7)
- hardware (0.6)
- intellectual property (0.5)
- version management system (0.5)
- distributed versioning tool (0.5)
- security (0.4)
- distributed software development (0.4)
- binary files (0.3)
- game development (0.3)
- version control system (0.3)
- Wiki (0.3)
- Mediawiki (0.3)
- SharePoint (0.3)
- collaboration (0.3)
- Visual Studio (0.3)
- Eclipse (0.3)
- C++ (0.3)
- Java (0.3)
- hardware manipulation (0.2)
- custom hardware (0.2)
- remote work (0.2)
- software tools (0.2)
- team collaboration (0.2)
title: 'Distributed Software Development Part 3: Tools Of The Trade'
wordpress_id: 439
---

For software development, there are a few things we need on a daily basis: our source code, our documentation, our integrated development environment (IDE) and our hardware. Without any one of these, a software developer is as useless as... well... something very useless.

<!--more-->

Source code, in software development, is our intellectual property. Although it should be readily accessible to the software developer when he needs it - and that would have to include the source code of any part of the system he works on and may have to debug - it should also be kept in a secure location most of the time and accessible only on a need-to-know basis. Once a developer has had access to the source code of any more or less stable part of the codebase, however, it doesn't make sense to restrict access to that part of the codebase unless you can make sure that the developer in question doesn't have the code in question anymore - which is really a nonsense proposition unless you can trust the developer in question, in which case you don't mind if he does have the source code. For a more volatile part of the codebase, it may make sense to restrict access to newer versions of the source code, but not necessarily to the ones he/she has already had access to, since those, through the volatile part of its nature, will be deprecated (of not obsolete) rather quickly. Hence, the value of the source code you have given a developer access to but want to restrict access to further down the road goes down rather quickly for volatile code, and it is more or less impossible to verifiably restrict access to stable code in the long run.

A centralized version management system, such as CVS, Subversion, TFS, etc., has the advantage of making it easy to control and restrict access to certain parts of the source code at your heart's content but has a distinct disadvantage in a distributed software development environment: it is ill-suited for such an environment because every time you need to access the source code, you need it to "phone home" - and every time you need to access any information _about_ the source code, you need it to "phone home" as well. This may be feasible in some cases, but can be a real strain on your productivity (something I ranted about in [a previous post](/blog/2009/11/microsoft-team-foundation-server-vs-git)). Hence, following the reasoning from the previous paragraph and the reasoning by which we want productivity to go up, rather than down, through the tools we use in software development (read [part 1](/blog/2009/12/distributed-software-development-the-safe-boom) and [part 2](/blog/2009/12/distributed-software-development-part-2) of this mini-series), what we really need is a distributed versioning tool.

Distributed versioning tools, such as Git, may not be suitable for all software development scenarios, especially when software development involves many binary files that need editing (such as [game development](http://web.archive.org/web/20130524033420/http://exdream.com:80/Blog/post/2009/09/20/Trying-out-Git-and-why-distributed-versioning-is-not-really-for-game-developers.aspx)). However, I am not in that kind of a market: the files I work on when developing software are mostly source files, and I do try to avoid storing _generated_ binaries under version control. Binaries that are actually hand-crafted do go under version control, but in my line of business, there aren't that many of them.

This caveat aside, there are many distributed versioning tools to choose from, and most of them, either directly or indirectly, provide the kind of security we really want: to not allow access to people who shouldn't have access (strong cryptography, identification, authentication, authorization), to clearly identify who's been doing what (non-repudiation), to clearly identify that what you have is what you ought to have (strong one-way cryptography).

Of course, a version control system would allow access to both the source code and the documentation, though arguably a Wiki, such as provided by Mediawiki, is a far better way to create documentation collaboratively and, yes, a Wiki is a centralized solution but one should only push distribution when it is useful to do so. Alternatives to a Wiki would be some sort of documentation publishing and versioning solution, such as SharePoint. Documentation, unlike source code, is usually not written as independent chunks by many different people, but is usually the result of a different type of collaboration, in which part of the documentation is written, made available to the other members of the team, discussed (e.g. through an instant messenger, such as Skype), edited, etc. until the documentation corresponds to some sort of compromise between the visions of the participating team members. Documentation doesn't "work" and can't be "executed", so it's not a question of debugging it, adding features to it, merging features in, etc.: it's far closer to a negotiation. In such scenarios, a centralized approach in which it is clear what the latest, canonical version of the documentation is, is a lot clearer to work in than a completely distributed approach.

Of course, there is always a middle ground: in some cases, the documentation may be better off being closer to the source code - e.g. if it documents the _expected_ behavior of that source code rather than the required behavior, but there is room for compromise.

Now, that takes care of the source code and the documentation. The other things the developer needs are the IDE, which should integrate well with the above-mentioned solutions. Though I am arguably not Microsoft's biggest fan, Visual Studio tends to beat the crap out of its competition when it comes to IDEs. Eclipse is a very good second but, in my field, which involves C++, it's second. Were my field more involved in Java, Visual Studio would get the crap beaten out of _it_, but that is not the case. Of course, you may need a few tools to integrate with the IDE of your choice.

Then there's the hardware. Most software development doesn't need all that much specialized hardware but, in some cases, servers are needed to run on, game consoles may be needed or you might be working on some kind of embedded device, in which case it may not be practical to ship those devices to the developers so they can play around with them. A lot can be done at a distance, but that lot does not include pressing the physical reset switch on the device or hooking up a cable to its serial console port for debugging. In those types of situations - i.e. when it is not feasible to provide the far-away developers with hardware - it may be necessary to have the developers come over or to have a technician not too far away to do the hardware manipulation for him/her.

So, there are still some challenges to be resolved: if you need custom hardware, you need access to that custom hardware; and you need to find a way that is appropriate for you and your way of working, where it comes to editing and maintaining your documentation. But there are also very important advantages to be had when working on software development in a distributed manner and there are tools that can help you with that.