---
author: rlc
comments: true
date: 2021-09-06
layout: post
title: Contents of the Quebec vaccine passport -- TMI?
---
While driving this afternoon, my wife and I had a chat about the contents of the QR code that encodes the vaccine passport here in Quebec. I had some ideas on how I’d design it, but I didn’t know how it actually worked. 

<!--more-->

![](/assets/2021/09/IMG_9C01CED190C6-1.JPEG){: align="right" width="100px"}

So, I handed her the wheel (stopping at a side road, of course) and scanned the QR code on my vaccine passport. The code was a string starting with “shc:/“ indicating it was a “simple health card” encoding. SHC is a signed JSON format containing health-related information, so I looked up some code on Github and found a number of projects that could decode the card. The one I ended up using was by [frpoulx](https://github.com/fproulx/shc-covid19-decoder), because it was on-line and the code looked OK. What I found was kinda scary.

The use-case being addressed by these vaccine passports is for the government to attest to the vaccine status of a citizen, so the way I would have designed this would be using standard X.509 certificates, signed using a special-purpose government intermediate CA and containing the citizen’s name as the subject. Standard software would then be able to parse the QR code, extract a base64-encoded certificate and validate that. The certificate would have a valid-from date, and the government would publish a certificate revocation list to revoke any certificates that are no longer valid due to expired vaccine status, bad batches, etc. With an approach like this, the clerk at the local coffee shop would know my name and the fact that I’m certifiably vaccinated, but nothing more. Significantly, they wouldn’t know when or where I was vaccinated, nor what my birth date is.

The European standard is close to this: it contains a unique identifier for the QR code, the name and the birth date of the citizen, but no specific information about the vaccine. The birth date seems unnecessary when an age group would suffice (e.g. 40 to 45 years old) to validate the age, so a birth decade would have been enough if that’s to be included in the use case.

The Quebec vaccine passport actually contains a signed JSON object with the citizen’s first name, last name, birth date, and detailed information about each dose of the vaccine including type, lot number, the date you got the shot, and the location you got the shot. Ostensibly, this is to allow the reading software to apply a set of rules to the vaccine passport to validate it, so if any particular batch of Pfizer is invalidated, anyone with that batch can be denied. A certificate revocation list would have the same effect.

When I started thinking about this issue and all the information included in the QR code, I first thought using a certificate validation protocol such as OCSP would be a good option, but I can see how you would not want the government to know your coffee habits. A certificate revocation list does not have that issue, as it does not present the certificate currently being validated to the server with the list, but simply regularly downloads the list.

**Too much information?** For the use-case in question, there is definitely more information here than needed: if the restaurateur is to validate my identity, all they need is my name and a check mark. The “VaxiCode Verif” tool doesn’t give the person’s age, so there’s no need to include it in the QR code. If that becomes an issue, a half decade should be close enough. Anything beyond that is a needless intrusion on the bearer’s privacy.
