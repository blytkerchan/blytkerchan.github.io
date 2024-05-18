---
author: rlc
categories:
- Technology
- Business Analysis
- Service-Oriented Architecture (SOA)
comments: true
date: 2010-10-27 02:48:23+00:00
layout: post
tags:
- Gartner (0.9)
- SOA (0.9)
- Event-driven interactions (0.8)
- EPCGlobal (0.7)
- Auto-ID lab (0.6)
- EPCIS (0.8)
- Service-oriented architecture (0.8)
- Query Control Interface (0.7)
- Capturing Interface (0.6)
- XML-over-HTTP (0.6)
- IBM (0.7)
- SAP (0.7)
- Business analysis tools (0.6)
title: Events in SOA
wordpress_id: 1103
---

In a recent article [on ZDNet](https://web.archive.org/web/20201205153641/https://www.zdnet.com/article/gartner-soas-next-step-is-managing-events/), Joe McKendrick writes that Roy Schulte, the Gartner analyst who helped define the SOA space more than a decade ago, says as SOA becomes embedded into the digital enterprise realm, organizations are moving services to support event-driven interactions, versus request/reply interactions.

This, of course, is old news...

<!--more-->

EPCGlobal was formed in 2003, as a successor to the MIT Auto-ID lab, which dates back at least to the year 2000. They had been working on the Auto-ID infrastructure, which has since become the Electronic Product Code Information System, or EPCIS.

EPCIS is a classic example of service-oriented architecture: it exposes a Query Control Interface in which you can query a database, and a Capturing Interface to which devices send events. The events are sent using a non-WSDL XML-over-HTTP format. It is those events that are stored in the EPCIS repository and it is that repository that is queried using the Query Control Interface.

Various services have been built on top the the EPCIS repository by various businesses. Two giants in that market -- IBM and SAP -- both have their own implementations of EPCIS which come with various business analysis tools that are well beyond my scope of knowledge, except for the fact that they exist.

It may well be that mr Schulte has identified a trend that the rest of the SOA field is picking up, but event-driven SOA is at least as old as SOA itself -- if not older. After all, ten years ago, no-one was talking about SOA yet.