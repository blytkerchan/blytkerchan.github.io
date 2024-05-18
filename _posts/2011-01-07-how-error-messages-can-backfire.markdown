---
author: rlc
categories:
- Cybersecurity
- Software Development
- Error Handling
- Encryption
- Information Security
comments: true
date: 2011-01-07 00:46:11+00:00
layout: post
tags:
- error messages (0.9)
- ASP.NET (0.8)
- vulnerability (0.7)
- hackers (0.6)
- deciphering encrypted data (0.5)
- Advanced Encryption Standard (0.4)
- Triple Data Encryption Standard (0.4)
- Microsoft (0.4)
- security researchers (0.3)
- malicious users (0.3)
- feedback (0.3)
- custom error codes (0.3)
- decryption (0.3)
- passwords (0.3)
- sensitive information (0.3)
- programming (0.2)
- Windows (0.2)
- incorrect parameter (0.2)
- experience (0.2)
title: How error messages can backfire
wordpress_id: 1144
---

Error messages should provide enough information for the user to correct their error, but they shouldn't provide any more than that, or malicious users could abuse them - as shown recently with the ASP.NET server.

<!--more-->

While going through my reading list, I came across the following news brief:

<blockquote>Security researchers have found a vulnerability within Microsoft’s ASP.NET Web-application-development framework that could let hackers get information useful for deciphering encrypted data. By default, ASP.NET provides detailed error messages when a system doesn’t properly decrypt ciphertext. Using this feedback, an attacker could learn enough to decrypt the ciphertext, which could potentially expose passwords and other sensitive information. The attack works equally well against both the Advanced Encryption Standard and the Triple Data Encryption Standard. Microsoft advised organizations to enable ASP.NET custom error codes to generate a response without detailed information for all failed decryption. -- G. Lawton; News briefs; IEEE Security & Privacy Vol. 8 No. 6; Nov/Dec 2010</blockquote>

I have to admit, this made me chuckle a bit, though I also have to admit this is a very easy mistake to make.

Usually, the problem is that you don't get enough feed-back to fix a problem: when programming under Windows, the error message "The parameter is incorrect" can be very frustrating: it doesn't tell you why it's incorrect, which parameter we're talking about, etc. and the documentation of the function in question may well be enigmatic to the point of not giving you any helpful information either - so you're stuck with fiddling and looking for code that does the same thing and does work, to try to figure out what you're doing wrong. Experience helps to avoid many problems but, sadly, not all.

Here, the problem is actually the opposite: it's like saying: "wrong password: you have 'hello' but the password is 'world'" - but less obvious.