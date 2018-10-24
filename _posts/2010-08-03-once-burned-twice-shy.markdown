---
author: rlc
comments: true
date: 2010-08-03 02:08:40+00:00
layout: post
permalink: /blog/2010/08/once-burned-twice-shy/
slug: once-burned-twice-shy
title: Once burned, twice shy
wordpress_id: 863
categories:
- Business
- Opinions
- Software Development
tags:
- Posts that need to be re-tagged (WIP)
---

"[Is Good Code Possible?](http://raptureinvenice.com/?p=63)" John Blanco asks on his blog. He goes on to tell a harrowing story on how he had to develop an iPhone app for a big retailer ("Gorilla Mart") in less than two weeks. Why he even accepted the contract is beyond me but then, he may not have had a choice.

In the scenario he described, there's really little chance of creating quality code, unless...
<!--more-->
I avoid contracts like the one John described like the plague: if the client doesn't know what they want, there's little chance for me to come up with a satisfactory solution. Then again, I am in a slightly different business than John is: I don't make applications for end-user devices. In stead, I make the software that runs under or behind it - embedded software, firmware and server software (either I work on the very small, or I work on the very big). In the last decade, I've written code for servers and code for embedded devices, but of that code, almost nothing has been visible to the end-user. Some has been visible to an operator on a packaging line, but that is just a small minority of the code I've written. However, I've worked with many of the same technologies as John apparently has: web services to get data, databases, etc. are among the things I've worked with, as he has. So, how do I go about avoiding contracts as the one John described?

The one thing in short-term contracts is to avoid surprises: you have to work with a third part, you have to know it from the outset. Nothing should be assumed: in any application, data has to come from somewhere (a source) and go somewhere (a sink); events need to be triggered and those triggers also need to come from somewhere; relations between all datasets need to be established from the outset, etc. Like I said: I don't usually work on end-user applications, but from my point of view, there are a few lessons to be learned from John's experience:
questions that needed to be asked, weren't. The feeling the execs wanted to have come across that the app was going to be "simple" was accepted at face value. I can understand that John didn't want to seem uncomfortable with that assertion, but seeing as _he_ was the specialist in the room, it was clearly up to _him_ to decide whether the app was simple or not - and it was up to him to show that such was not the case.



<blockquote>"But it's OK," Gorilla Mart Executive #1 says. "The app is simple."</blockquote>



This, of course, is the cue for "I'll be the judge of that!" or something in that order. The point is that there can be only one judge of the simplicity of an app, and that judge is the specialist. I'm always happy to explain how I intend to solve a given problem, and I am always happy to accept suggestions as to the solution. To go from there to accepting a solution from an exec, who may well have an MBA, is a step I am not willing to take without good arguments.

Now, I don't want to come over as a know-it-all, nor do I want to judge the way other people handle their contracts, so I'll propose a few anecdotes of my own.



## Anecdote #1: Purdy Please?!




<blockquote>
This was about a year ago. I'd put a notice up on this site that I was available for a new contract and got a phone call a few days later, if I would accept a two-week contract to interface an existing system to a brand-new web service for it to obtain geo-location data. The contract was to be done post-haste, so the person searching for a developer was in a hurry.

I have a list of developers that I can call if I have a contract that is too big for me to handle by myself, or if I don't have time to do the contract myself. These are all people I've worked with before and for whom I can vouch in terms of their being good programmers. When I had put the notice up on my site that I was available, I didn't expect to get calls quite that quickly, so with the deadline as close as it was, there was no way I could accept the contract myself. When pushed a bit (the guy was 300 km away from his client and needed to get a developer _right now_) I took out my list and made a few calls. I found a suitable developer, and earned a commission for the referral.

Crisis averted, and everybody happy: the programmer that got to do the job, the HR person looking for a programmer, the client and me all got what we wanted, and three out of four were a bit richer after the deal - the fourth had his product, so will be a bit richer by now as well.</blockquote>





## Anecdote #2: What do you mean: "what do you need?"?




<blockquote>A few months ago, I got a call asking me to develop the firmware for a new product. The call lasted about thirty minutes and ended with me asking for some material to at least give me a feel of what was needed - something I could base a draft architecture on.

They didn't have any such documentation - actually wanted me to come up with some. Naturally, I can't do that: I don't know the market for the device, nor do I know enough about marketing to come up with that kind of material. All I could do is give them a few pointers, and tell them to come back to me when they had some more information.

Now, this is a case in which no money exchanged hands and the amount of work on my part was really minimal: they basically got an expert opinion on a few questions they had and were happy with the answers they got. They also knew they had a bit more homework to do. Me accepting the contract without that homework being done first would be a waste of my time and theirs - and as my time is their money, they understood that I was saving them money with my questions.

When their homework is done and they do come back to me, the time I spent will have been a good investment on my part. If they don't do their home work or they don't come back to me, it will still have been a good investment on my part, but it will not have had the hoped-for return.</blockquote>





## Anecdote #3: Questions, questions...




<blockquote>There are few clients that like your work enough to pay you in advance for time they might not even use - just so they can call you any time during the day and ask a few questions. One such client wanted me to write a specification from a set of PowerPoint slides. Happy to oblige, I went through the PowerPoint slides and came up with a long list of questions. My continuing the work on the specification depends on getting the answers to those questions.

Now, these questions aren't technical in nature, but PowerPoint slides have a tendency to be vague and technical specifications can't really have that luxury, so choices have to be made at some point. E.g., when defining a security profile of a new device, do you want to emphasize confidentiality, integrity, authentication or non-repudiation? In embedded devices, you usually don't have enough space to have them all and I can't make such decisions on behalf of my clients - nor can I describe all options and have the development team make the choices (although I can describe and explain alternatives).</blockquote>



Now, does this mean that every time a client comes up with a vague question, I tell them to do their homework and go on my merry way? No. I am not _that_ financially independent. It does mean, though, that creating software-intensive systems requires real input from the system's stakeholders. I'm happy to work with stakeholders and think different scenarios through with them, and I'm very happy to explain alternatives to them, to analyse possible repercussions of different choices, etc. but I cannot, and will not, take their decisions for them.

Of course, all three of these anecdotes didn't actually result in me investing any significant amounts of time (except for the third one, in which I spent the better part of three days analysing the presentation and the repercussions for the existing architecture) and therefore didn't come at great cost to the client. In each case, the customer was helped along the way to the end-result they were going for, and in the first case, the project was eventually executed while the other two are still pending.

So, how is this approach different from the one described by John? Well, aside from none of these cases being particularly frustrating for me or for the client, I don't get "pumped" - I hardly ever get excited - for a job: getting too excited about anything usually ends up in disappointments for everyone involved. Now, that doesn't mean I haven't made my share of mistakes: committing to deadlines I couldn't live up to, working nights, etc. to "get the job done" and producing code that would have smelled the way it looked if code had any smell to it at all, but - knock on wood - those days are (hopefully) over... almost.
