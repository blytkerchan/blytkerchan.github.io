---
author: rlc
comments: true
date: 2010-05-04 00:06:43+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/05/speaking-different-languages/
slug: speaking-different-languages
title: Speaking different languages
wordpress_id: 590
tags:
- Posts that need to be re-tagged (WIP)
---

As a dutchman living in Quebec, Canada - one of those parts of the world where francophones (french-speaking people) are surrounded by anglophones (english-speaking people) and yet thrive speaking french almost exclusively - I sometimes run into the "corner cases" of language related coding standards - e.g. the language comments are supposed to be written in.
<!-- more -->
In the computing industry, english is the de-facto language of choice for correspondence and documentation. Maybe in some more-or-less-distant future that will be mandarin, but I kinda doubt it. Most source files are presented to the compiler in ASCII, a 7-bit encoding that encodes most of the Latin alphabet - i.e. the subset used in english - and is sufficient to encode all of the C and C++ language's operators, functions, keywords, etc. That, of course, should come as no surprise.

What might come as a surprise to some is that the french language cannot be encoded in ASCII: french uses a lot of Latin letters - or glyphs I believe they're called - that are no available in ASCII because they have something added to them w.r.t. the ASCII equivalent. For example, "how are you", which the French literally ask as "how it goes", is written, in french, as "comment ça va?". "That won't work" translates to "ça ne marchera pas", etc. In "extended ASCII" - an 8-bit variant of ASCII, the C-cedil (ç) is character number 135.

Some compilers choke on such characters - most modern ones don't, but some still do - which leads to a strange kind of IM-french in comments, which comes pretty close to being unreadable, even for francophones. As a result of this, some corporate coding standards have started banning french from the comments, mandating english-only in stead. This has two effects, both of which are far from desirable. First, it's illegal for companies of more than 50 employees because of Quebec's language laws, which impose on companies that they have to allow for a french-speaking working environment for their employees (even for non-native non-french-speaking employees that aren't Canadian). This means that companies that enact such coding standards can face heavy fines unless they can justify the use of english (i.e. justify that the source code is to be read by anglophones - e.g. customers).

The second undesirable effect is that the quality of the english is often.. (let me put this mildly) lacking. This results in the comments - and parts of the code - being in a language commonly called "franglais": a weird mix of french and english that is hard to understand unless you read it out loud with a french accent and know it's this weird mix.

I've also seen one coding standard in which the norm is to use your own native language - which is presumably the language you can write best in and which assumes that everyone on the team can read the native languages of everyone else (or that comments aren't all that important). When I came accross this one, I pointed out that there would probably be no-one on the team that would be able to read dutch. They corrected me: there was another dutchman in the company but they agreed that I should write my comments in either english or french - which was (supposedly) what was meant by the standard's authors.

Running into these little issues is a good way to poke fun at our differences. I hardly think it illustrates anything other than "two-dimentional thinking" (as Spock said about Kahn in Star Trek II): intelligence without experience; and I would tend to argue that the same kind of flaw is apparent in Quebec's language laws, but I guess protecting one's national identity must sometimes take precedence over productivity.
