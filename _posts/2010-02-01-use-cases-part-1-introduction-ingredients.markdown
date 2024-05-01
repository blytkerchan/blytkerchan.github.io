---
author: rlc
categories:
- Software Development
- Programming
- Agile Development
- User Stories
- Use Cases
- UML Diagrams
comments: true
date: 2010-02-01 17:00:06+00:00
layout: post
tags:
- Posts that need to be re-tagged (WIP)
- use-cases
title: 'Use-Cases Part 1: Introduction & Ingredients'
wordpress_id: 383
---

In the "C++ for the self-taught" series, we're about to embark on a new project. In order to describe that project and in order to figure out what we want the result of that project will be, we will be using a tool called the use-case. So, I think an intermezzo on use-cases is in order.

<!--more-->

In the series on use-cases, we will discuss:

- what use-cases are for
- what use-cases are **not** for
- what use-cases are
- what use-cases are **not**
- how to write a use-case
- who to write a use-case for

We will take a short look at use-case diagrams in UML, how one use-case can depend on another and how much detail should go into a use-case. But first, we'll take a look at the ingredients of a use-case and, more generally, of a functional specification.

## Ingredients

_Use-cases_ are basically _goals_ your _users_ will want to reach when _using_ your system. They are different from _user stories_, which describe how the user would _attempt to reach_ his/her goal.

_Stakeholders_ are the people who have a _stake_ or an _interest_ in the software and/or the project that develops it. Stakeholders do not necessarily use the software. It is important to keep them in mind, however - e.g. for example to decide whether a use-case is valid or not.

When we'll be talking about use-cases, we will (more often than not) be using user stories as well. User stories are an important _artefact_ in agile development and when we will be working on user stories, we will often use a few standard actors, taken from the cryptography community:

- **Alice**, **Bob**, **Charlie** and **Dave**

in stead of using "person A" and "person B", when users interact with the system, we will give them names. These names have been around for a few decades now, for the purpose of making user stories easier to read. When reading about cryptography, you'll find these same names being used (Alice usually wants to send a message to Bob, gets help from Charlie and, if a fourth person is necessary, Dave and tries to avoid Eve from eavesdropping..

- **Eve**, **Oscar** and **Trudy**

these names will be used for malicious users

Each user story focuses on describing how to achieve a goal or how achieving that goal is prevented. The user story describes the goal of the user, whether that goal fits in the interests of the stakeholders of the system (and therefore whether we should accommodate the goal or not) and describes the interaction between the user and the system.

A lot of though can (and often should) go into describing use-cases: they help the designers, the implementors and the stakeholders communicate with each other and, keeping use-cases in mind they help to avoid getting off-track. A good understanding of the intended use-cases of the solution can help make the design of the solution a lot better right from the offset, which will save time and money in the end.

In the next installment, we'll take a look at what use-cases are (and aren't) for: the problem they are intended to solve, how they came about and where they're going.