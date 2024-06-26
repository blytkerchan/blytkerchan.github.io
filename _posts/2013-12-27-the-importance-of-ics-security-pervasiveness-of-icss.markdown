---
author: rlc
categories:
- Industrial Control Systems (ICSs)
- Power Grid
- Smart Grid
- Smart Metering Devices
- Energy Efficiency
- Cybersecurity
comments: true
date: 2013-12-27 01:12:13+00:00
layout: post
tags:
- Industrial Control Systems (ICSs) (1.0)
- Power grid (0.9)
- Smart metering devices (0.8)
- Smart grid (0.7)
- Electricity grid (0.6)
- Energy efficiency (0.5)
- Communication security (0.4)
- Infrastructure (0.3)
- Resilience (0.3)
- End-of-life (0.2)
title: 'The importance of ICS security: pervasiveness of ICSs'
wordpress_id: 2453
---

Industrial Control Systems (ICSs) are becoming pervasive throughout all branches of industry and all parts of our infrastructure: they are a part of every part of the electricity grid, from the nuclear power station to your home; they're found in the traffic lights of virtually every crossing; they regulate train traffic; they run the cookie factory that makes your favorite cookies and pack the pills your doctor prescribed.

<!--more-->

For this article, and for the following articles in the series of which this will be the first, I will concentrate on the power grid.

---

The metering device at your home, which measures how much electricity you use, can also measure when you use that electricity -- to a point where a utility can see, from your usage data, when you get up and whether you like your bread toasted or not (if you do, your toaster will cause a spike in your energy usage every morning)[^1].

[^1]: The spike in my household is a bit bigger because I don't toast my bread -- I make my own, which means baking it.

Smart metering devices, such as the at your home (or coming soon if not already there) are part of a larger "smart grid" which adds resilience to the electricity grid, as well as making it more energy efficient. This relies on the adoption, by utilities, of intelligent electronic devices (IEDs -- not to be confused with improvised explosive devices, which are also IEDs) or, more generally, industrial control systems.

To make the power grid "smart", all these devices have to communicate with each other. Most of these devices have communications abilities but are generally not designed with security in mind.

Seeing as ICSs are becoming more and more pervasive, that also means the attack surface -- the number of points of entries the "bad guys" can use to break the system -- is getting bigger and bigger. Add to that that many ICSs currently in use are nearing their end-of-life, and that the business models of most utilities are based on stretching the life-time of ICSs they have in the field as far as they can stretch them, the smart grid is starting to look less smart, and more fragile.