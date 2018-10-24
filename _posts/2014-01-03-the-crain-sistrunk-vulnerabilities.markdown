---
author: rlc
comments: true
date: 2014-01-03 00:25:38+00:00
layout: post
permalink: /blog/2014/01/the-crain-sistrunk-vulnerabilities/
slug: the-crain-sistrunk-vulnerabilities
title: The Crain-Sistrunk vulnerabilities
wordpress_id: 2427
categories:
- Industrial Automation
- Software Engineering
tags:
- Crain-Sistrunk
- DNP3
- ICS security
---

In the two previous posts, I've shown that industrial control systems -- ICSs -- [are becoming more pervasive](http://rlc.vlinder.ca/blog/2013/12/the-importance-of-ics-security-pervasiveness-of-icss/), and that they [rely on security through obscurity](http://rlc.vlinder.ca/blog/2013/12/the-importance-of-ics-security-ics-communications/).

Now, let's make the link with current events.

<!--more-->

This is where the Crain-Sistrunk vulnerabilities come in: Adam Crain and Chris Sistrunk have discovered vulnerabilities in the vast majority of ICSs that implement DNP3.

The relevance of these vulnerabilities, which are documented as part of [Project Robus](http://www.automatak.com/robus/), is in the fact that they have exposed three things that were not known (or acknowledged) before: 

  1. serial communications are a viable attack vector to knock out a master device
  2. the vast majority of devices implementing DNP3 are vulnerable to attack, _regardless of whether they implement DNP3 Secure Authentication_
  3. _all_ of these vulnerabilities could have been found using negative testing when writing the protocol stack


Let's look at these three points, one by one:


### Serial communications are a viable attack vector to knock out a master device


Industry standards generally focus on TCP/IP communications for as far as they are concerned with security. In the context of smart grids, the [NERC (North American Electric Reliability Corporation) Critical Infrastructure Protection](http://web.archive.org/web/20151019112638/http://www.nerc.com/pa/Stand/Pages/CIPStandards.aspx) standards are a good example: CIP-005-3a, the electronic security perimeter standard, includes dial-up and non-routable protocols as entry points to the electronic perimeter (section B, requirement R1.1) but electronic access control is only required "where technically feasible" and only if access is interactive: 

<blockquote>**CIP-005-3a. Section B. Requirement R2.4**: Where external interactive access into the Electronic Security Perimeter has been enabled, the Responsible Entity shall implement strong procedural or technical controls at the access points to ensure authenticity of the accessing party, where technically feasible.</blockquote>



Monitoring electronic access is for dial-up and non-routable protocols is only required where technically feasible as well: 

<blockquote>**CIP-005-3a. Section B. Requirement R3.1**For dial-up accessible Critical Cyber Assets that use non-routable protocols, the Responsible Entity shall implement and document monitoring process(es) at each access point to the dial-up device, where technically feasible.</blockquote>



These requirements have generally been interpreted as meaning two things: 



  1. NERC-CIP requirements are generally construed as applying only to TCP/IP connections
  2. NERC-CIP security requirements are generally are only applied at the edge of a substation.


The fact that Crain and Sistrunk were able to crash devices or otherwise make them misbehave using only a serial connection means that the first premise -- security is only important for TCP/IP networks -- is patently false: security, especially when considering robustness a security issue, is an issue for any kind of communication, including serial communication.

The fact that a master device could be compromised through the type of attack Crain and Sistrunk performed is more serious: master stations routinely "call out" to outstation devices ("slaves") which may be located practically anywhere and contacted by radio, dial-up modem, etc. Alternatively, these devices may be expected to "phone home" when they have something interesting to say, or periodically. The first thing many of these devices do is send an unsolicited message, which may be normal practice and is mandated by the DNP3 standard, but which also exposes the master device to any vulnerability it may have when parsing such unsolicited messaged. The Crain and Sistrunk attacks showed that just such types of vulnerabilities exist.

This means you can crash a device at a substation near you from the metering device in your back yard -- not a very smart thing to do (pretty easy to trace) but I'm sure a smart criminal will be able to find a way to cover his tracks.



### The vast majority of devices implementing DNP3 are vulnerable to attack, _regardless of whether they implement DNP3 Secure Authentication_


DNP3 is one of the rare machine-to-machine protocols designed for SCADA (Supervisory Control And Data Acquisition) networks that has any security features whatsoever. The feature in question is DNP3 Secure Authentication.

As I mentioned above, this feature is often colloquially called "Secure DNP3" which is misleading in the sense that it implies that, apart from authentication, which DNP3 SA does provide, it would also provide confidentiality, integrity, authorization and non-repudiation. It does none of these things. Using TLS alleviates this, but is usually not applicable to serial connections, and is quite hard to implement properly -- especially for people who have no previous knowledge if IT.

The Crain-Sistrunk vulnerabilities don't really care whether you have secure authentication enabled or not: they exploit vulnerabilities in input validation, which happens regardless of whether the message being parsed is authenticated or not.



### _All_ of these vulnerabilities could have been found using negative testing when writing the protocol stack


DNP3 compliance is tested using positive tests of the "do this, the device should do that" variety. They test interoperability, not the robustness of the implementation, nor any aspect of security aside from authentication.

This means that a compliant DNP3-enabled device will be able to talk to another compliant DNP3-enabled device, but there is absolutely no guarantee that a compliant DNP3-enabled device will behave properly under any circumstance not explicitly tested in the compliance tests.

Most DNP3-enabled devices implement DNP3 by integrating a DNP3 stack -- the vast majority all use the same stack, which is actually very good. Integrating with a DNP3 stack to make a device compliant to a particular DNP3 subset level is far from trivial, however: you have to know the stack you're integrating with, have a passing knowledge of the DNP3 protocol and know your own device fairly well as well. Devices that were originally designed to speak Modbus, for example, may have a very hard time mapping their device's points to a DNP3 interface because DNP3 has a much richer set of object types, variations, etc.

Assuming you try to do your best to get all that right, most engineers won't think of trying to break their devices -- trying to get them to misbehave. That means that most engineers will have a strong bias for positive testing -- make sure the device does what you ask it to when you ask it to do it. Negative testing, including fuzzing, is often left by the wayside.

The Crain-Sistrunk vulnerabilities were all found through negative testing, using their "smart fuzzer": they tested boundary cases to see if they could get a device to misbehave, for example by asking for more data than the device could produce. This is the kind of thing black hat hackers (which Crain and Sistrunk are _not_) will do as well -- the difference is that they won't tell you about what they find: they'll either sell it to someone who wants to do harm, or do some harm themselves.



* * *



A large number of DNP3-enabled devices are connected directly to the Internet, do not use TLS, do not use Secure Authentication, and will not be immediately updated to fix these errors. They will remain vulnerable for the time being.

Crain and Sistrunk intend to release their smart fuzzer to the public in March 2014. This will have left enough time for manufacturers to update their firmware and maybe enough time for utilities to update their devices. However, this is Winter. March is the beginning of Spring. Winter is not a good time to update devices in the electrical grid (the load is high, and if you fail, everyone is cold -- and angry).
