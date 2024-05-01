---
author: rlc
categories:
- Software Development Models
- Object-Oriented Programming
- Agile Development Methods
- Use-Cases
- Software Engineering Education
- Constructivism
comments: true
date: 2010-02-16 21:40:09+00:00
layout: post
tags:
- Posts that need to be re-tagged (WIP)
- use-cases
title: 'Use-Cases Part 2: What Use-Cases Are For (The history, present and future
  of use-cases)'
wordpress_id: 388
---

In the late 1980s and early 1990s, the "waterfall" software development model, which had been around (with that name) since the 1970s (see, for example, Boehm, B.W. Software engineering. IEEE 7~ans Comput. C-25, (1976), 1226-1241) was starting to be progressively "refined". When that happens, it usually means that there are problems with the model that need to be addressed - or the model will crumble and fall. Object-oriented programming was becoming more or less main-stream and early versions of C++ were cropping up. "Good practice" documents for programming on non-OO languages started to stress the use of OO-like APIs and soon enough, object-oriented programming would no longer be a mere buzzword.

<!--more-->

One article from that time, now two decades years old, was published in the Communications of the ACM journal: "The object-oriented systems life cycle" ([Volume 33, Issue 9 (September 1990), Pages: 142 - 159](http://portal.acm.org/citation.cfm?id=83880.84529&jmp=cit&coll=ACM&dl=ACM&CFID=1154054&CFTOKEN=24694148#CIT)). Though this article very clearly describes a waterfall process, it also very clearly states that the user of the final solution has something to say: "The analysis phase
covers from the initiation of the project, through to users-needs analysis and feasibility study (...) In general, the problem is first defined and an analysis of the requirements of current and future users undertaken, usually by direct and indirect questioning and iterative discussion. (...) The users requirements
definition is _in the language of the users_ so that this can be agreed upon by both the software engineer and the software user." This goes to show that the discussion between analyst/programmer and end-user is not new to iterative, "agile" programming schemes. The authors (Brian Henderson-Sellers and Julian M. Edwards, both from the University of New South Wales, Kensington, N.S.W., Australia) stress the point that this part of the life-cycle is still well-grounded in the "problem space": "At this requirements stage, however, the domain of interest is still very much that of the problem space. Not until we move from (real-world) systems analysis to (software) systems design do we move from the problem space to the solution space".

In today's more "agile" methods, we have a tendency to expect the developer to switch between the problem space and the solution space: to think of the real-world problem as he develops the software solution. Agility is really about taking the three phases of waterfall development (analyze, design and build) into iterations in which we do all three. If they're done by different people (which is to be avoided in agile methods) they can be done in parallel. This has the advantage of shortening the time-to-market and of making it clearer to the developer how the solution will be brought to the market (marketed), which allows the developer to better suit the solution to the needs of marketing.

It would take another decade for the agile manifesto to be published, but the trends were already there: I will once again cite the same article saying "The software life cycle (...) is frequently implemented based on a view of the world interpreted in terms of a _functional decomposition_; that is, the primary question addressed by the systems analysis and design is WHAT does the system do viz. what is its function?" Though functional decomposition goes a lot further than today's functional analysis does, modeling the universe as a set of functions that just happen to work on data, it is still an important part of the way systems are described: we still do a lot of process analysis (especially in applied economics) and process optimization. In object-oriented software analysis, we just happen to give a more important role to data, modeling the data as objects on which those functions (from functional decomposition) are applied. Applying those functions is now part of one or more actions and those actions are (directly or indirectly) taken by users.

While in the beginning of the 1990s, we were moving away from pure functional decomposition and moving towards object-oriented analysis, "stressing instead (of the functional decomposition) the encapsulation of data and procedural features together, exemplified by the clear and concise specification of the module interface" (the class), we are now moving back to a more functional approach, allowing the developer to see the user's perspective and, from that perspective, the functions the system has for the user. Those functions are used by the user to accomplish a certain set of goals, which are the system's use-cases.

Use-cases were first introduced (as far as I can tell) in 1992, in the book _Object-Oriented Software Engineering_ by Ivar Jacobson (Addison-Wesley Publishing Company, 1992). They were further developed by the [OMG](http://omg.org) and can be modeled using UML (which is an OMG standard). Use-cases specify the actors (significant users of the system) and the transactions they have when inter-operating with the system (the use cases) as well as the preconditions for those transactions to take place, the basic course of action for the use-case and an alternative course of action in case a precondition is not met. In UML, use-cases are modeled as classes that can "derive from" each other (i.e. a use-case can be a generalization of another use-case and/or a use-case can extend another use-case), aggregate each other (i.e. a use-case can include another use-case) and be associated with each other.

Use-cases, and their application, were developed throughout the 1990s and the first decade of the 21st century (the 2000s?) and became an especially important tool for capturing user requirements - and an especially important artifact in the development process - as agile development methods were developed.

Let's take a look at the [Agile Manifesto](http://agilemanifesto.org/):

<blockquote>
<h2>Manifesto for Agile Software Development</h2>
We are uncovering better ways of developing<br/>
software by doing it and helping others do it.<br/>
Through this work we have come to value:<br/>
<br/>
<b>Individuals and interactions</b> over processes and tools<br/>
<b>Working software</b> over comprehensive documentation<br/>
<b>Customer collaboration</b> over contract negotiation<br/>
<b>Responding to change</b> over following a plan<br/>
That is, while there is value in the items on<br/>
the right, we value the items on the left more.<br/>
<br/>
Kent Beck, Mike Beedle, Arie van Bennekum, Alistair Cockburn, Ward Cunningham, Martin Fowler, James Grenning, Jim Highsmith, Andrew Hunt, Ron Jeffries, Jon Kern, Brian Marick, Robert C. Martin, Steve Mellor, Ken Schwaber, Jeff Sutherland, Dave Thomas</blockquote>

While the Agile Manifesto could have been just another bold statement by a group of frustrated individuals, this bold statement started a (tranquil, velvet) revolution in the software development community. As agile development methods were developed, the focus shifted from managed teams to self-managed teams; from projects that were chronically late and never came out as the customer expected to projects that were developed with constant customer input. The customer was no longer kept in the dark but became, aside from a stakeholder of the process, an important source of information for the developers who, at first much to the dislike and the fear of management, had a chance to directly interact with the customers. This empowers both the customer and the developer - but takes quite a bit out of the hands of management until management embraces the idea and learns how to deal with it.

These self-managed teams needed a way to capture user requirements that focused on working software rather than comprehensive documentation, which is what use-cases already did and, arguably, why use-cases became such an important asset.

Today, use-cases are used to document user requirements quickly and efficiently. They are seen as a productive way to capture functional requirements that may well lack perfection, but is usually "good enough" to go on.

While the written-down and drawn-out version remains an important asset in the development process, use-cases are also often used in "thought experiments": without actually drawing them out or writing them down, use-cases are used to think through usage scenarios. As such, when discussing whether or not a feature is required (or even wanted) the question isn't "is it useful" but "what are the use-cases for it" and then "do we want to support those use-cases". The latter question is often a matter of weighing the risks involved in implementing it vs. the risk that a user might actually need it to do his job - and might be unable to do his job without it, rendering the product useless.

In Software Engineering Education (i.e. the courses new software engineers follow to become software engineers), the topic of use-cases is still relatively new. In 2005, Mary Shaw, Jim Herbsleb and Ipek Ozkaya [published](http://portal.acm.org/citation.cfm?id=1062563&dl=GUIDE&coll=GUIDE&CFID=72120033&CFTOKEN=76543455) "Deciding What to Design: Closing a Gap in Software Engineering Education" in which they described a new course being given at Carnegie Mellon (called "Deciding What to Design") that was intended to "bring together a variety of methods for understanding the problem the client wants to solve, various factors that constrain the possible solutions, and approaches to deciding among alternatives" (because "customers and users usually don’t know precisely what they want, and it is the developer’s responsibility to facilitate the discovery of the requirements"). In this course, "students should learn that good solutions come not from applying processes “by the book” but from genuinely understanding their client’s real needs, then selecting and applying whatever techniques are appropriate to solving their client’s problem". Use-cases are part of the "Eliciting technical needs" competence taught in the course. This means that in at least one major university started teaching a course including use cases as of 2002 (accounting for the time to develop the course, teach it at least once, evaluate it, present it, write about it, etc.) - a mere decade after they were first introduced. (This is not a tongue-in-cheek remark: it takes time to pick up a new trend, decide whether to include it in the curriculum, develop the course, etc.)

On a more philosophical note, Said Hadjerrouit [published](http://portal.acm.org/citation.cfm?id=1113875&dl=GUIDE&coll=GUIDE&CFID=72120126&CFTOKEN=59021832) an article on "Constructivism as guiding philosophy for software engineering education", in 2005. He proposed a pedagogical model based on constructivism, of which he says: "The defining characteristic of constructivism is that knowledge cannot be transmitted from the teacher to the learner, but is an active process of construction. A pedagogy that relies on the constructivist philosophy, requires a set of pedagogical guidelines and strategies that can be translated into practice." In lieu of these guidelines and practices, he proposes **Construction**, **Cognitive Skills**, **Authentic Tasks**, **Related Cases**, **Collaboration** and **Information Technology**. According to Hadjerrouit, "A suitable pedagogical model must help learners to play an active role in their own learning, discovering things for themselves, rather than being told by a teacher" (which would fit nicely with the concept of "C++ for the self-taught", by the way). It also fits nicely when we move learning out of the classroom.

What is "eliciting technical needs" or "eliciting user requirements" if it isn't learning? The software engineer (or developer, whichever term you prefer) has to _learn_ about the context of the system in order to be able to "decide what to design", and have to do so by interactive with a customer or user that "usually doesn't know what they want". Using a constructivist approach, asserting that the software engineer must "play an active role in his own learning, discovering things for himself", the software engineer is invited to take an interest in the problem domain: to learn about the context in which his solution will run and try to understand what it is his client (the customer or user) is talking about. Use-cases are a tool in this process, and they should be used as such, but they are not the only tool. Perhaps, a decade from now, we will have (re-)discovered another tool to help improve the interaction between the developer and the customer. Hopefully, use-cases will still be in the toolset then, though.