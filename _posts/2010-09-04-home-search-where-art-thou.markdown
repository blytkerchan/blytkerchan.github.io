---
author: rlc
comments: true
date: 2010-09-04 00:51:43+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/09/home-search-where-art-thou/
slug: home-search-where-art-thou
title: Home Search, Where Art Thou?
wordpress_id: 892
categories:
- Opinions
- Technology
tags:
- Posts that need to be re-tagged (WIP)
---

In my day to day life, there are few things I truly dislike doing: I'm a pretty happy person. There is one thing, though, that I really don't like - at all - and that strikes me as a truly pointless exercise in futility: searching. Shouldn't we have a solution for that by now?

It strikes me we already have all of the necessary technology to come up with a viable solution: I've worked with most of them! Let's have a look what this might look like.
<!--more-->


## How It Would Work


Let's say you've misplaced you pen: you whip out the portable device of your choice (in my case, my iPod Touch), launch the search app and type "pen". This would either access a local index over the network, or an index on the web, and would start looking where an item that matches "pen" was last seen. Say you have seven pens at your home: one in the bedroom, three in your home office, two in the living room (of which one in the couch, between the cushions) and one in the laundry room.

In order for the search service to know where your pen is, the amount of data you need is surprisingly small: it needs to know where you are, what a pen is, which pens you might be looking for and where those pens were last "seen". How would we go about getting this information?

Let's start by looking at how to know where the pens were last seen: in order for a computer to "see" anything, it needs a sensor of some kind. That sensor, in our case, needs to provide enough information for the computer to know where it is and what it has observed. If we look at solutions for similar problems (always a good way to start an analysis), we might take a look at EPCIS (Electronic Product Code Information System): it is a system based on event captures in which sensors among the supply chain generate events that are stored in an _EPCIS repository_ where they can later be analyzed. EPCIS events consist of several fields, including the EPC itself (an electronic product code), an action, a disposition and a read point. Each of these is identified by a URN that might look a bit like this: `urn:epc:id:sgtin:1234567.123456.123` (which would be an EPC). Some of the information is inherent to the scanner (e.g. the read point) or its context (action and disposition), but one of the bits of information is part of the product: the EPC.

An EPC contains a lot of information, some of which we don't need for our purposes: an SGTIN, for example, contains a serial number and a GTIN, which is a Global Trade Identification Number. The GTIN contains a Company Prefix and an Item Reference, which identifies the company that made (or imported, or distributed) the pen and the type of item it is (a pen). You can find the same information in a barcode. For example: 1-88874-84006-6 is a UPC-12 barcode that contains a company prefix 88874, identifying EMF Tea & Wares, and an item reference 84006, identifying a 120g container of "The au Jasmin". Now, the way that EPCs are usually read is either by scanning a barcode that contains the EPC (usually a data matrix barcode), or by reading an RFID tag. RFID tags are relatively expensive - sufficiently so to hamper their rapid adoption for serialization (for supply line security) in the pharmaceutical industry - so we shouldn't expect pens to be outfitted with RFID tags any time soon. However, while RFID tags are relatively expensive for production purposes, they are relatively _inexpensive_ for retail purposes: a tag costs a few cents. RFID tags are also fairly small: they can be embedded into a label you'd find on a bottle of pills, for example. A typical tag would be about a 2 cm wide square, most of which is the tag's antenna. It would be feasible, therefore, to tag objects you want to be able to search for with a stick-on RFID tag: you could basically put the tag inside the pen, rolled up, provided the pen is mostly made of plastic (or the tag could be embedded in a label that you stick to the pen).

RFID has the advantage of being "transparent" in two ways: because it works with radio waves, most objects are transparent to it (as are you, mostly), so your pen can be in your pocket and still be visible the the RFID reader. The other way it is transparent is that once you've stuck the tag on your object, you don't have to think about it anymore: when you carry it around, an RFID reader will see the tag and generate an appropriate event.

This takes care of half of our first problem: items that already have an RFID tag that has a GTIN or (better yet) an SGTIN in it are duly identified and are now visible to RFID readers. The ones you tag, you have to associate with the object, so you can imagine having an RFID reader with your computer and, when you tag an object, scanning it and answering a few questions about the object (such as what it is). This begs the question, though: how do we get those tags to tell the readers where they are?

The answer is: we don't. The tags I'm thinking of are _passive_ tasks, so they wouldn't normally be very chatty: they only talk when talked to (and get the energy to talk from the antenna, so there's no batteries required). Antennas would be strategically placed around the house, where it makes sense. In my case, I'd put one at the top of the stairs, at each doorpost (on the inside of each room) etc. That way, an tagged object in my house would be "seen" by those readers at those strategic places. It would be practicallty impossible for my pen to end up in the laundry room without going, one morning, from the master bedroom down the stairs and through the door of the laundry room. Even if one of the readers doesn't pick it up (e.g. the one in the laundry room) I can follow its trajectory down the stairs and have a good guess where it might end up if, say, the laundry basket took the same route at the same time.



## Security


So, we now have a basic solution. I think the use-cases are obvious (they are to me, at least). What about abuse cases? Say I tagged a diamond necklace, which I would happen to have laying about the house. A thief coming into the house and whipping out his iPad could do a quick inventory of the place, know exactly where everything is and clean me out in no time, right?

That's what you need security for: you don't want any-one to have an idea of the inventory of your home, so if at all possible, the information should stay in your home - which means this becomes a localized solution. The database and software could easily be housed in a little box that could be installed next to your home router, and to which the various RFID readers would send their info through wireless LAN or through a home-area network (they wouldn't have to be on-line all the time, either: battery-powered RFID readers would only need a simple motion sensor to turn themselves on, perform a reading, send the result and go back to sleep). The other bit of security - not allowing the burglar to read the data - is a question of securing your network and putting a password on the server. Of course, the readings being sent would have to be secured as well: both sides would have an X.509 certificate identifying themselves and thus allowing them to communicate.



## Roaming


So, let's say all of your friends have tagged their iPods, iPads, iMacs, laptops, pens, secret diaries, jewelery, family heirlooms, etc. as have you. You go to a party at one of your friends' and fall asleep on the couch. When you wake up, you want to check the time on your tagged thingamajig and find it missing. What do you do?

Well, because your friend conveniently places a reader at the front door, his system picked up a "foreign object" belonging to user ID 12345 (part of the tag you put on it). Your friend whips out his Android phone, fires up the app and instructs it to tell it where anything belonging to user 12345 is. Most of it, being on your person, is reported as being in the living room but, somehow, your thingamajig left a few hours ago. At about the same time, a whole bunch of stuff belonging to user 23456 left as well. User 23456 being your girlfriend, you rest assured and hope she isn't too mad at you for falling asleep on the couch (while she was talking to you).



## Conclusion


Our time of searching for stuff should be over! If some-one would be willing to come up with the venture capital, I'll be happy to make a product out of this idea. I already know everything I need to know to get the ball rolling and I can come up with a pretty good sketch of what both the software and hardware should look like pretty quickly.
