---
author: rlc
comments: true
date: 2014-01-05 05:24:12+00:00
layout: post
permalink: /blog/2014/01/ics-security-and-regulatory-requirements/
slug: ics-security-and-regulatory-requirements
title: ICS security and regulatory requirements
wordpress_id: 2490
categories:
- Industrial Automation
- Software Engineering
tags:
- ICS security
- regulation
- regulatory requirements
- requirements
---

In North America, ICS security, as regards the electricity grid, is regulated by [NERC](http://www.nerc.com/), which provides and enforces, among other things, the Critical Infrastructure Protection (CIP) standards.

In this post, I'll provide a quick overview of those standards, provisions slightly more in-depth information than in my [previous post](http://rlc.vlinder.ca/blog/2014/01/the-crain-sistrunk-vulnerabilities/).

<!--more-->

Industry standards generally focus on TCP/IP communications for as far as they are concerned with security. In the context of smart grids, the [NERC-CIP (Critical Infrastructure Protection)](http://web.archive.org/web/20151019112638/http://www.nerc.com/pa/Stand/Pages/CIPStandards.aspx) standards are a good example: CIP-005-3a, the electronic security perimeter standard, includes dial-up and non-routable protocols as entry points to the electronic perimeter (section B, requirement R1.1) but electronic access control is only required "where technically feasible" and only if access is interactive: 

<blockquote>**CIP-005-3a. Section B. Requirement R2.4**: Where external interactive access into the Electronic Security Perimeter has been enabled, the Responsible Entity shall implement strong procedural or technical controls at the access points to ensure authenticity of the accessing party, where technically feasible.</blockquote>



Monitoring electronic access for dial-up and non-routable protocols is only required where technically feasible as well: 

<blockquote>**CIP-005-3a. Section B. Requirement R3.1**For dial-up accessible Critical Cyber Assets that use non-routable protocols, the Responsible Entity shall implement and document monitoring process(es) at each access point to the dial-up device, where technically feasible.</blockquote>



CIP-002-3 provides the regulatory guidelines to identify critical cyber-assets.



<blockquote>**CIP-002-3 Requirement R3**: Critical Cyber Asset Identification — Using the list of Critical Assets developed pursuant to Requirement R2, the Responsible Entity shall develop a list of associated Critical Cyber Assets essential to the operation of the Critical Asset. Examples at control centers and backup control centers include systems and facilities at master and remote sites that provide monitoring and control, automatic generation control, real-time power system modeling, and real-time interutility data exchange. The Responsible Entity shall review this list at least annually, and update it as necessary. For the purpose of Standard CIP-002-3, Critical Cyber Assets are further qualified to be those having at least one of the following characteristics:
**R3.1.** The Cyber Asset uses a routable protocol to communicate outside the Electronic
Security Perimeter; or,
**R3.2.** The Cyber Asset uses a routable protocol within a control center; or,
**R3.3.** The Cyber Asset is dial-up accessible.</blockquote>



So a "cyber asset" is only considered critical if it uses a routable protocol, is dial-up accessible or is necessary for the operation of another critical asset.

These requirements have generally been interpreted as meaning two things: 



  1. NERC-CIP requirements are generally construed as applying only to TCP/IP connections
  2. NERC-CIP security requirements are generally are only applied at the edge of a substation ((because inside the substation, most devices (still) use serial communications.)).


As I will show in my [previous post](http://rlc.vlinder.ca/blog/2014/01/the-crain-sistrunk-vulnerabilities/), the Crain-Sistrunk vulnerabilities blow the premises on which this interpretation, and some of the standards, are based out of the water.

[aside status="closed" type="note"]The standards that are most important w.r.t. the subject matter (firmware quality and ICS security) are [CIP-005-3a (Cyber Security - Electronic Security Perimeter(s))](http://www.nerc.com/_layouts/PrintStandard.aspx?standardnumber=CIP-005-3a&title=Cyber%20Security%20-%20Electronic%20Security%20Perimeter(s)) and [CIP-007-3a (Cyber Security -- Systems Security Management)](http://www.nerc.com/_layouts/PrintStandard.aspx?standardnumber=CIP-007-3a&title=Cyber%20Security%20%E2%80%94%20Systems%20Security%20Management)[/aside]

Other parts of industry, such as the pharmaceutical industry, have more stringent requirements w.r.t. security. The pharmaceutical industry has the 21CFR.11 requirements which, although not always strictly applied, require cryptographic authentication of users, audit logs, etc. It creates a distinction between an "open" system, which is controlled by people who are not responsible for the electronic records they contain, and a "closed" system, which is ((21CFR.11.3 "(9)Open system means an environment in which system access is not controlled by persons who are responsible for the content of electronic records that are on the system.")). Closed systems are subject to the following restriction: 


<blockquote>**21CFR.11.10**: Persons who use closed systems to create, modify, maintain, or transmit electronic records shall employ procedures and controls designed to ensure the authenticity, integrity, and, when appropriate, the confidentiality of electronic records, and to ensure that the signer cannot readily repudiate the signed record as not genuine.</blockquote>


As you can see, **Confidentiality**, **Integrity**, **Authenticity** and **Non-Repudiation** are all there.

The requirements for open systems are more stringent that for closed systems, because they can be accessed by people who are not responsible for the electronic records they produce.

Note that, contrary to the NERC-CIP requirements, there is no "electronic perimeter" within which everything is deemed safe: there is only the integrity and authenticity of records (i.e. data) produced by the systems which has to be safeguarded and the actions of the people operating on that data which may not easily be repudiated.

In the electricity grid, which is a critical part of our overall infrastructure and without which our society would not be able to function, an operator can perform maintenance actions on any device to which he physically has access and can effectively render part of the grid vulnerable or inoperable for extended periods of time without there being a regulatory requirement for non-repudiation or even timely notification.

In the mean time, any non-OTC drug in California (the most populous state of the US) will have to have an electronic pedigree by July 1, 2017 (the end date of the introduction of the E-pedigree according to the Ridley-Thomas bill of 2008). Work of integrating Electronic Product Codes throughout the supply chain, at tremendous cost, almost all assumed by industry, started around 2006. This includes ICSs generating electronic records about every single product, including a serial number for every single product, from the packaging line through the entire supply chain down to the pharmacy, all meeting or exceeding 21CFR.11 requirements.

Yet, the critical infrastructure that is the electricity grid, which is called a "smart grid" because it is so advanced technologically ((tongue firmly in cheek here)) has far less stringent regulatory requirements.

The problem is this: the grid is aging and using some fairly old hardware and firmware. A new generation of intelligent electronic devices, remote terminal units, data concentrators and other power systems devices is making it's way onto the market as I write these lines, but those devices are build for a aging infrastructure with requirements that were designed for that aging infrastructure. When new requirement meant to improve the standard of technology are discussed, there is significant push-back from the industry because there is cost involved and security is not seen as a problem.

Adam Crain and his team are showing there is an iceberg, it has a tip, and it's becoming visible. Before the political will to do something about it is mustered, New York may have to lose power for a week or two.
