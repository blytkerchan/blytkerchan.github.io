---
author: rlc
categories:
- Software Development
- Agile Methodologies
- Project Management
- Quality Assurance
- Configuration Management
- Documentation
- Process Improvement
comments: true
date: 2009-09-29 02:51:02+00:00
layout: post
title: Can Agile and CMMI Come Together?
wordpress_id: 227
---

I just finished reading a [report](http://www.sei.cmu.edu/library/abstracts/reports/08tn003.cfm) by the [Software Engineering Institute](http://www.sei.cmu.edu/) that accomplishes something that earlier literature, including "[SCRUM Meets CMMi - Agility and discipline combined](http://www.ddj.com/cpp/201202684)" didn't accomplish: it takes a rational step back from both methods, shows where they're from and why they're different, how much of that difference is real and where the perceived differences come from, and how the two can come together. So, the short answer to my title is "yes".

<!--more-->

One thing I have often said about, and to, self-proclaimed agilists, is that diving into code head-first isn't agile - it's just plain stupid. It gives agile a bad name and it is bad for both the software and the clients that pay for the software. That doesn't mean that everything should be documented and specified before you start coding: I agree with the [Manifesto for Agile Software Development](http://agilemanifesto.org), and I'll even quote it completely here:

<blockquote>We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:<br/>
<br/>
<b>Individuals and interactions</b> over processes and tools<br/>
<b>Working software</b> over comprehensive documentation<br/>
<b>Customer collaboration</b> over contract negotiation<br/>
<b>Responding to change</b> over following a plan<br/>
<br/>
That is, while there is value in the items on the right, we value the items on the left more.</blockquote>

There is an importance to the contents of the last line: _while there is value in the items on the right_. I.e., processes and tools are still needed - just look at all the scrum tools that are cropping up everywhere to visualize burndown charts and if a daily stand-up meeting and a weekly sprint isn't a process, I don't know what it is.

Documentation is still needed, though some documentation is more needed than other documentation, and some can be generated straight from the source code rather than trying to document first and code afterwards. Requirements, however, need to be written down somewhere, as do user stories and other such documentation tools. Sometimes, you need to establish a clear standard because you need to communicate with sometimes yet-to-be-written third-party software, so you need to document your protocols first. _Bref_, there is value to documentation.

Contracts still need to be negotiated as well: no-one likes to work for free and many clients need non-disclosure agreements and other legalities in order to be able to do business. Perhaps the emphasis should no longer be on "what is the application going to do, exactly?" and should rather be on "under what conditions will the application be made?" but there is still a contract that needs to be negotiated, or there will simply not be a customer to collaborate with.

Plans should not be underestimated as assets either: a well thought-out plan will take care of the big picture while allowing many, many details to go less planned. For large projects, plans should be _less_ detailed, not more, than for small projects. If both a small and a large project can be planned in five steps, the steps for the small project will be smaller, and therefore more detailed. The whole question is how to find a balance.

And that's where CMMI comes in: while iterative and incremental design and development is a cornerstone for all agile methodologies I know of, it pre-dates all of them by decades. CMMI provides a number of models in which iterations have an important place (it's not like either the authors of CMMI or the authors of the diverse agile methodologies re-invented the wheel). The explicit goal of CMMI, and of its predecessor CMM, is to increase software quality and decrease the risk of software failure, failure of software delivery and failure of software to be "up to spec". Agile methods actually have the same goals, but may have a different approach to reaching them in that they make the approach explicitly iterative and incremental, focusing on the small increments that might (or very well might not) end up with the end goal. CMMI focuses on the end goal and CMMI users are usually less interested in the individual increments.

In order for a process to become more mature, it has to progressively add and follow-up on configuration management, process and product quality assurance, planning of all kinds, etc. etc. (actually, that's mostly level 2):

![Capability_Maturity_Model](/assets/2009/09/Capability_Maturity_Model.jpg)

So merging CMMI and Agile really comes down to one thing: doing all that, in small steps, for every iteration. That's really all there is to it!