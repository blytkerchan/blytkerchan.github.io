---
author: rlc
comments: true
date: 2016-05-21 17:48:27+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2016/05/technocracy/
slug: technocracy
title: Technocracy
wordpress_id: 3883
categories:
- Software Development
- Software Engineering
tags:
- technocracy
---

In a discussion with a "Product Owner" recently, I told him I take a more technocratic approach to project management than they did. We discussed different project management styles for the next hour or so.

[dropshadowbox effect="lifted-right" border-width="1" inside_shadow="false"]**TL;DR:** I believe that



	
  * to effectively and efficiently run a large team of developers who are collectively responsible for a product with a large code-base, that team needs to be organized as a network of smaller teams with experts leading each of those smaller teams, and

	
  * to successfully manage an "agile" development team and create a viable product, one has to have a vision and break it down from there.

[/dropshadowbox]
<!--more-->
Well-running teams tend to be able to execute their tasks efficiently, but large development teams do not necessarily have a clear vision of where the product, or product line, is going and therefore don't necessarily know what direction to take the code in. This may have an adverse effect on the product's system architecture, especially with agile teams that tend to decide the architecture by the seat of their pants.

This is why I tend to take a more "technocratic" approach to project management and team management: I do not believe that every person in a large team is equally apt to work on every part of a large system architecture. Rather, the architecture should be compartmentalized and each part of the architecture should have a small group of designated "experts": people that know that part of the system inside out and work on it whenever work needs to be done on it.

The way I implemented this in previous teams was to designate a lead for each part of the architecture (which could be the author of that part of the architecture or just someone with experience with, and affinity for, that part of the architecture). That person would then have to designate two more people within the team who would share the responsibility for that part of the architecture. In french, I called this "_un responsable, deux adjoints_" -- one responsible person, two assistants ((Remember I work in the french-speaking part of Canada)).

It is the responsibility of each of these three persons to make sure they know the part of the architecture they're responsible for. The designated leader has the additional responsibility to _either_ author _or_ review all of the code (and in the interest of the two assistants being able to take over if the leader gets hit by a bus, they have to each write a significant part of new code as well). Code reviews of code written by the leader are done by _both_ assistants; code written by one of the assistants is reviewed by the leader. Any one of the three can block a commit from becoming "canonical" -- I've never had to step in to unblock but I did, of course, reserved the right to do so.

With proper encapsulation and well-defined interface contracts between each of the components (contracts which all follow the same, small set of patterns appropriate for the entire architecture) this means that individual parts of the architecture can be approached as individual, smaller projects. Sharing team members among different parts of the architecture -- a person responsible for one part is the assistant on at least two others -- means everyone has at least some knowledge of the entire product and knows a significant part of the architecture well.

The PO I was discussing this with is the PO of a large software/firmware platform with hundreds of individual components, all of which is tightly coupled to an OS that is going to be obsolete in a few years. The current software and firmware platform must be supported for at least another ten to fifteen years, but a replacement firmware platform (including OS) must be in place within five years from now.

The team being entirely composed of human beings and human beings being what they are, I recommended setting out a three-year vision toward which the current three-week iterations they work with would strive. That means they have about 50 iterations to get there. When I did that little piece of math and came up with the number 50, which is a nice, small, manageable number, those three years seemed to have gotten a lot shorter in his mind all of a sudden.

My approach would be as follows:



	
  1. Formulate a clear vision statement: the vision should be clear and enunciate a specific, measurable, attainable goal of what the product platform should look like in three years: e.g. "90% of our most-used configurations can be configured to functional equivalence using the new firmware platform" -- note that the system behavior will be functionally equivalent but not necessarily the same; note that not all configurations are to be supported but "only" 90%, in order of most use by customers. Both of these caveats should be made explicit in a single paragraph to accompany the vision statement.

	
  2. Formulate ten milestones, each five iterations apart, to work toward that goal. The first milestone should be to determine what those most-used configurations are and what it means to be functionally equivalent. With five three-week iterations that gives the team fifteen weeks to come up with answers (while also working on change requests, bugs, etc.) -- which is not a lot of time.
The milestones following that would, in my approach, be to develop the firmware platform and required functions for the new firmware platform in order of dependence.

	
  3. For each sprint, set goals that are specific to reaching the next milestone.



Lively discussions are sure to ensue, but with the inevitability of the vision and the need to reach that envisioned reality by the deadline, team buy-in is virtually guaranteed (and is necessary for motivation) and the whole thing is specific, measurable, attainable, relevant and time-boxed.
