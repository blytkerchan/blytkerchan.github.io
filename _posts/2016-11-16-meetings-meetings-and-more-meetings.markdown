---
author: rlc
categories:
- Project Management
comments: true
date: 2016-11-16 12:08:33+00:00
layout: post
title: Meetings, meetings, and more meetings
wordpress_id: 4126
---

Recently, I spent a significant part of the day in a meeting reviewing the year's progress on several projects, including the introduction of an agile methodology -- Scrum. The approach in the meeting was simple: write on a sticky note what we did well, and on another what we should not repeat or how we should improve. The subject was "Scrum/agile". I only wrote one sticky note: "get rid of Scrum".

<b><i>The TL;DR:</i></b><br/>
Scrum, in my opinion, is (moderately) useful for small teams with a single, short-term project -- something like a web application. The overhead it imposes _vastly_ outweighs the benefits for larger teams and larger projects.

<!--more-->

Imagine you're running a team of 20 or so developers, each of which work on different parts of a complex platform that has almost two decades of legacy code in it -- about a thousand person-years of legacy code. The team is tasked with adding new features to that platform. They work 40 hours a week, 50 weeks per year -- which amounts to 40,000 person-hours per year of work on the platform.

Of these 40,000 person-hours, about 4,000 are spent on uncompressible overhead regardless of the management methods used: meetings, water cooler talk, brain storms, paperwork, you name it. At least 10% of your time cannot be pure development activity.

Now, of the remaining 36,000 hours, you need to maximize the amount of time actually spent on adding features. The way this is done in Scrum is to add the following to the mix:

1. for each three-week period, add a fifteen-minute daily meeting which will take place in what may be the most productive part of the day, interrupting any other activity taking place (and thus effectively doubling the impact to thirty minutes a day) -- cost: 3,000 hours

2. for each three-week period, add six hours of meetings to review the previous three weeks and plan the next three weeks -- cost: 2,000 hours

3. for each three-week period, have every developer plan their three-week period of work individually, between those two meetings (the review and retro meeting, and the planning meeting) -- cost: 1,000 hours

You've now spent 15% of your time talking about what you'd like to do -- but you haven't actually done anything yet. You're down to 30,000 hours of effective work that can still be done.

But aside from the overhead, what's wrong with daily progress meetings? Well, Michael O. Church has a [pretty comprehensive overview](https://michaelochurch.wordpress.com/2015/06/06/why-agile-and-especially-scrum-are-terrible/) of the ills of Scrum, that doesn't look at the economics. Personally, I think the economic argument is pretty compelling: if you want to translate as much of your work time as possible into whatever the equivalent of billable hours is in your business, you don't start by adding a 15% project management overhead.