---
author: rlc
comments: true
date: 2010-10-27 02:48:23+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/10/events-in-soa/
slug: events-in-soa
title: Events in SOA
wordpress_id: 1103
categories:
- Business
- Software
tags:
- Posts that need to be re-tagged (WIP)
---

In a recent article [on ZDNet](http://www.zdnet.com/blog/service-oriented/gartner-soas-next-step-is-managing-events/5972), Joe McKendrick writes that Roy Schulte, the Gartner analyst who helped define the SOA space more than a decade ago, says as SOA becomes embedded into the digital enterprise realm, organizations are moving services to support event-driven interactions, versus request/reply interactions.

This, of course, is old news...
<!-- more -->
EPCGlobal was formed in 2003, as a successor to the MIT Auto-ID lab, which dates back at least to the year 2000. They had been working on the Auto-ID infrastructure, which has since become the Electronic Product Code Information System, or EPCIS.

EPCIS is a classic example of service-oriented architecture: it exposes a Query Control Interface in which you can query a database, and a Capturing Interface to which devices send events. The events are sent using a non-WSDL XML-over-HTTP format. It is those events that are stored in the EPCIS repository and it is that repository that is queried using the Query Control Interface.

Various services have been built on top the the EPCIS repository by various businesses. Two giants in that market -- IBM and SAP -- both have their own implementations of EPCIS which come with various business analysis tools that are well beyond my scope of knowledge, except for the fact that they exist.

It may well be that mr Schulte has identified a trend that the rest of the SOA field is picking up, but event-driven SOA is at least as old as SOA itself -- if not older. After all, ten years ago, no-one was talking about SOA yet.
