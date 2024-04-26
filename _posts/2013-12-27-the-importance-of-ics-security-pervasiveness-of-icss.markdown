---
author: rlc
comments: true
date: 2013-12-27 01:12:13+00:00
layout: post
permalink: /blog/2013/12/the-importance-of-ics-security-pervasiveness-of-icss/
slug: the-importance-of-ics-security-pervasiveness-of-icss
title: 'The importance of ICS security: pervasiveness of ICSs'
wordpress_id: 2453
categories:
- Industrial Automation
- Software Engineering
tags:
- ICS security
---

Industrial Control Systems (ICSs) are becoming pervasive throughout all branches of industry and all parts of our infrastructure: they are a part of every part of the electricity grid, from the nuclear power station to your home; they're found in the traffic lights of virtually every crossing; they regulate train traffic; they run the cookie factory that makes your favorite cookies and pack the pills your doctor prescribed.

<!--more-->

For this article, and for the following articles in the series of which this will be the first, I will concentrate on the power grid.


* * *


The metering device at your home, which measures how much electricity you use, can also measure when you use that electricity -- to a point where a utility can see, from your usage data, when you get up and whether you like your bread toasted or not (if you do, your toaster will cause a spike in your energy usage every morning)[^1].

[^1]: The spike in my household is a bit bigger because I don't toast my bread -- I make my own, which means baking it.

Smart metering devices, such as the at your home (or coming soon if not already there) are part of a larger "smart grid" which adds resilience to the electricity grid, as well as making it more energy efficient. This relies on the adoption, by utilities, of intelligent electronic devices (IEDs -- not to be confused with improvised explosive devices, which are also IEDs) or, more generally, industrial control systems. 

To make the power grid "smart", all these devices have to communicate with each other. Most of these devices have communications abilities but are generally not designed with security in mind.

Seeing as ICSs are becoming more and more pervasive, that also means the attack surface -- the number of points of entries the "bad guys" can use to break the system -- is getting bigger and bigger. Add to that that many ICSs currently in use are nearing their end-of-life, and that the business models of most utilities are based on stretching the life-time of ICSs they have in the field as far as they can stretch them, the smart grid is starting to look less smart, and more fragile.
