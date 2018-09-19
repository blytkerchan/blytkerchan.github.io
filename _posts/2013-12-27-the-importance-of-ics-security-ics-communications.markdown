---
author: rlc
comments: true
date: 2013-12-27 01:40:12+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2013/12/the-importance-of-ics-security-ics-communications/
slug: the-importance-of-ics-security-ics-communications
title: 'The importance of ICS security: ICS communications'
wordpress_id: 2456
categories:
- Industrial Automation
- Software Engineering
tags:
- ICS communications
- ICS security
---

For an ICS, having communications abilities generally means implementing some machine-to-machine communications protocol, such as DNP3 or Modbus. These protocols, which allow the device to report data to a "master" device and take their cue from those devices w.r.t. things they should be doing, are generally not designed with security in mind: most of them do not require, or expect, user authentication for any commands you might send them, and don't implement anything approaching what you'd expect from, e.g., a bank (confidentiality, integrity, authentication, authorization, non-repudiation).

<!--more-->

DNP3 is a notable exception: it is one of the few industrial M2M protocols that actually does include a secure authentication option. Regrettably, DNP3 Secure Authentication is often colloquially called "Secure DNP3" and thought to include several things it does not (such as authorization and non-repudiation).

Slapping TLS onto the protocol stack isn't always an option -- many devices use serial communications and have no transport layer, and therefore no transport layer security, to speak of, and many more devices simply don't have the processing power to accommodate TLS. When it is an option, is has to be well-implemented to be effective, allowing both peers to identify the other before accepting a connection, by properly implementing a public key infrastructure (PKI).

The industry still has a long way to go before getting to such a level of sophistication.

Currently, the industry mostly relies on security through the difficulty to access their networks: they use radio communications in a spectrum reserved to them, dial-up connections (for which you'd have to have or guess the phone number and passwords), serial connections, optic fiber networks, etc. Each of these is hard to access without the proper knowledge and equipment.

Of course, we already know that security through obscurity is no real security at all...
