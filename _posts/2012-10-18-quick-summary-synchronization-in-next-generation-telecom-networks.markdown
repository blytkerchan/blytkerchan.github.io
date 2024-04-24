---
author: rlc
comments: true
date: 2012-10-18 16:28:47+00:00
layout: post
permalink: /blog/2012/10/quick-summary-synchronization-in-next-generation-telecom-networks/
slug: quick-summary-synchronization-in-next-generation-telecom-networks
title: 'Quick Summary: Synchronization in Next-Generation Telecom Networks'
wordpress_id: 1932
categories:
- Interesting stuff
- Technology
tags:
- next-generation networks
- time synchronization
---

This is a quick summary of the [ComSoc webinar on Synchronization in Next-Generation Telecom Networks](https://web.archive.org/web/20160620200541/http://webcast.you-niversity.com/youtools/companies/viewarchives.asp?account=395247&affiliateId=99&routing=b2d50ec7&stm=PDKIKX0D)

Over the last few years, communications networks have changed radically: their use has gone from predominantly voice to predominantly data and they have themselves gone from predominantly synchronous networks to predominantly packet networks.

Time synchronization requirements, in terms of quality of time, have only gotten stricter, so new methods for clock synchronization are now required - i.e. NTP can't do the job to the level of accuracy that's needed.

<!--more-->

As the first presenter, Ravi Subrahmanyan, noted, for various reasons, two synchronization protocols have won out over all others: Synchronous Ethernet, which synchronizes the clock frequencies of the Ethernet PHYs, and IEEE-1588 PTP.

The second presenter, Silvana, Rodrigues, explained some of the reasons on why PTP is designed as it is: PTP is an Ethernet-based network that, at its most basic level (like NTP) assumes a symmetrical network, However, because Ethernet networks are hardly ever symmetrical (that is: the time it takes for a packet to get from A to B is not necessarily the same as the time for a packet to get from B to A) different PTP profiles were developed to work around this. These profiles are a key feature of PTP (i.e., IMHO, they constitute the most important enhancement of PTP over NTP).

The third presenter, Michael Mayer, gave us an overview of what the carrier's point of view will be: the way networks are set up is evolving towards an Ethernet network in which large parts are over-the-air.  The network will be increasingly heterogeneous, which increases the need for a more-or-less universal synchronization solution.
