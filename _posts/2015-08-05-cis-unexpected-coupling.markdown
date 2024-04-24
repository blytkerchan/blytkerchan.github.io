---
author: rlc
comments: true
date: 2015-08-05 23:12:10+00:00
layout: post
permalink: /blog/2015/08/cis-unexpected-coupling/
slug: cis-unexpected-coupling
title: 'CIS: Unexpected Coupling'
wordpress_id: 3266
categories:
- Common Issues with Synchronization
tags:
- coupling
---

One of the most common problems with synchronization occurs when things need each other that you didn't expect to need each other.
<!--more-->
Consider, for example, a server application where the client establishes a connection to the server and, after some hand-shaking and polling, expects to be notified if "anything of interest" occurs. The server has a database (e.g. it might be a financial system and "something of interest" might be a transaction on a specific account). The database is set up in such a way that a write to a specific table, when it meets specific requirements, triggers an event message to be written to the connection.

This is all fine, as long as it's implemented correctly: as anyone who has worked with databases will tell you, triggers are tricky: they can't be rolled back, so if the transaction fails the message will still have been sent but when the client comes to check on the table, the value hasn't changed (time stamps are still the same, etc.) -- has the transaction not finished yet, or has it failed?

Depending on how the database and the communications are implemented, the trigger itself may stall, or fail: if the trigger's action is done synchronously (which is often the case) it will actually construct the message and write to the socket. It may even wait for the client's confirmation! Any of this may take time, throw exceptions, etc.

We now have a situation where any process that writes to the database is unexpectedly coupled to a process that reads from a socket to obtain notifications from the server.

Of course, there are less consequential examples of unexpected coupling (and this one hopefully wouldn't get through peer review) but the pattern is often the same: one process expects a retro-action from another, but the API used doesn't give any hint that such an interaction exists.

Of course, there are subtler retro-actions than a confirmation message as well: just look up the difference between the `PostMessage` and the `SendMessage` function of the Windows API, or look up some of the caveats with using Windows' anonymous pipes.

Coupling isn't necessarily evil, but it should be explicit if at all possible.


* * *


**PS**: The first draft of this post used the example of an array of potato launchers that, though independent, were coupled by a targeting controller. I even made a drawing of such a launcher (though not the entire array). While the text of that draft would need an awful lot of work, I thought I'd at least share the drawing:
{% include image.html url="/assets/2014/08/Potato-launcher-300x185.png" caption="Potato launcher" %}
