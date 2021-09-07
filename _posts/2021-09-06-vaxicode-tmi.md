---
author: rlc
comments: true
date: 2021-09-06
layout: post
title: Contents of the Quebec vaccine passport -- TMI?
---
While driving this afternoon, my wife and I had a chat about the contents of the QR code that encodes the vaccine passport here in Quebec. Apparently there had been some questions to the premier and the minister of health about "hackers" getting to its contents, and the privacy implications of such "cracks". I had some ideas on how I’d design it, but I didn’t know how it actually worked, and I was clueless as to what a hacker could well crack (regardless of the color of their hat). Surely the contents would be signed and there'd be no more than strictly necessary encoded in the "passport"?

<!--more-->

![](/assets/2021/09/IMG_9C01CED190C6-1.JPEG){: align="right" width="100px"}

So, I handed her the wheel (stopping at a side road, of course) and scanned the QR code on my vaccine passport. The code was a string starting with “shc:/“ indicating it was a “simple health card” encoding. SHC is a signed JSON format containing health-related information, so I looked up some code on Github and found a number of projects that could decode the card. The one I ended up using was by [frpoulx](https://github.com/fproulx/shc-covid19-decoder), because it was on-line and the code looked OK. What I found was kinda scary.

### Use case
The use-case being addressed by these vaccine passports is for the government to attest to the vaccine status of a citizen. A coffee shop clerk scans the QR code with a government app, which simply shows whether the person is sufficiently immunized, and shows their name. No other identifying information is shown to the person validating vaccine status. So the way I would have designed this would be using standard X.509 certificates, signed using a special-purpose government intermediate CA and containing the citizen’s name as the subject: the government CA signature would, by its nature, attest to the vaccine status of the person who can show the signed QR code, and CA infrastucture can be used to manage and revoke certificates as needed. Standard software would then be able to parse the QR code, extract a base64-encoded certificate and validate that against the government CA certificate. The certificate would have a valid-from (or "not valid before", in X.509 parlance) date, and the government would publish a certificate revocation list to revoke any certificates that are no longer valid due to expired vaccine status, bad batches, etc. With an approach like this, the clerk at the local coffee shop would know my name and the fact that I’m certifiably vaccinated, but nothing more. Significantly, they wouldn’t know when or where I was vaccinated, nor what my birth date is.

The European standard is close to this: it contains a unique identifier for the QR code, the name and the birth date of the citizen, but no specific information about the vaccine. European apps show the person's name and age, as well as the vaccine status. The European app uses a different format, but on the whole it's similar.

But even if you want the coffee shop clerk, or waiter, or whoever, to be able to validate a person's age, the birth date seems unnecessary when an age group would suffice (e.g. 40 to 45 years old) to validate the age, so a birth decade would have been enough if that’s to be included in the use case.

### The contents of the Quebec vaccine passport
The Quebec vaccine passport actually contains a signed JSON object with the citizen’s first name, last name, birth date, and detailed information about each dose of the vaccine including type, lot number, the date you got the shot, and the location you got the shot.

Ostensibly, this allows the reading software to apply a set of rules to the vaccine passport to validate it, rather than having to use a revocation list, so if any particular batch of Pfizer, Moderna, Atrazeneca, etc. is invalidated, anyone with a shot from that batch can be denied. A certificate revocation list would have the same effect and would arguably be less error-prone to implement.

### Implementation options, keeping privacy in mind
The only information you need to validate the passport is:

1. the person's name
2. the person's approximate age (so a 16-year-old can't use a 50-year-old's passport)
3. a signature from the government
4. rules to know whether the certificate is (still) valid

The first three can be encoded in the passport itself, the fourth is the hard part.

When I started thinking about this issue and all the information included in the QR code, I first thought using a certificate validation protocol such as OCSP would be a good option, but I can see how you would not want the government to know your coffee habits, so on-line verification of the passport is off the table.

The Quebec version addressed this by adding extra information to the passport, to which you can apply regularly-updated rules (at least two vaccines, last one at least two weeks ago, etc.). The European version doesn't contain that type of information, so it presumably uses a revocation list-based approach.

A certificate revocation list does not have any privacy issues, as it does not present the certificate currently being validated to the server with the list, but simply regularly downloads the list. The revocation list would need to be sufficiently recent, and would therefore need to be updated regularly. Revocation lists for certificates that do not expire can also grow indefinitely, but there are only a few billion people on earth so the maximum size of a revocation list that covers the entire population of the world is still bounded and manageable, even for a phone-based app. The burden would be on the coffee shop to have hardware that can handle a list of up to 64 GB, but by the time we get there we can probably just get rid of the CA cert and start anew.

The passport itself could also expire after a year or so, and automatically renew if it's still valid: these are software-based passports, so it's quite reasonable for them to update once in a while to update their expiry dates.

In any case, I don't see why Tim Horton's needs to know when and where I got my vaccine, what lot number it was, etc. A clerk scanning those code with a kink for intrusion of privacy could very well skim every QR code they see coming through and set up a list of the birth dates of everyone who got a double double since September 1.

### Too much information?
For the use-case in question, there is definitely more information here than needed: if the restaurateur is to validate my identity, all they need is my name and a check mark. The “VaxiCode Verif” tool doesn’t give the person’s age, so there’s no need to include it in the QR code. If that becomes an issue, a half decade should be close enough. Anything beyond that is a needless intrusion on the bearer’s privacy.

### Can this be fixed?
These vaccine passports are software-based and the software needs to be updated regularly so yes, it can be. All that's needed is for the app, at its next update, to request a new QR code that encodes the name and birth decade of the person, rather than the entire COVID-related medical record. The verification app, at its next update (which should precede the customer update) should accept both QR codes for a month or so.
