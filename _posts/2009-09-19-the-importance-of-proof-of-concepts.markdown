---
author: rlc
categories:
- Problem Solving
- Software Development
- Project Management
- Business Analysis
- Concept Development
- Requirements Analysis
- Testing
- Risk Management
comments: true
date: 2009-09-19 01:18:00+00:00
layout: post
tags:
- Posts that need to be re-tagged (WIP)
title: The Importance of Proof-Of-Concepts
wordpress_id: 194
---

Any problem is an invitation to find a solution.

<!--more-->

Any solution - at least in my line of work - is an amalgam of concrete
implementations of abstract concepts. Each of those implementations
may or may not meet the requirements just like any of those concepts may
or may not be the right one for the situation at hand. You therefore need
to prove two things:

1. the solution proposed is the solution to the right problem

2. the solution proposed solves the problem

The solution being a concrete implementation of an abstract concept, needs
to be _proven_. Hence, you need a **Proof of Concept**.

## Why? When? What? How? Who?

These are the five basic questions you need to have answered before being
convinced of _anything_ - at least, I need to have answers to these
five basic questions before being convinced of anything and I try to have
answers to each of these whenever I try to convince someone of anything. So,
I will now try to answer each of these questions to convince you of the
importance of proofs of concepts.

### Why?

Ultimately, a proof of concept saves you money: it saves time because you don't
spend more time than necessary on a concept that you can't prove; it saves more
time because concepts that you can prove are known to work and can be built
upon as the project progresses; it instills confidence in the solution in your
management and development teams and it documents two things: what the solution
is meant to solve, and how the solution is meant to solve it. It therefore
also establishes two things - which are of vital importance to understand for
any solution: the _capabilities_ of the solution and the
_limitations_ of the solution.

I express functional requirements in terms of required capabilities or capacity
and permitted limitations, and I believe this is a universal way of expressing
functional requirements. Mind you that this does not express all types of
requirements - e.g. security requirements can (and should) be expressed in
terms of rights and obligations, but they are non-functional requirements (see
L. Chung, B. Nixon, E. Yu, and J. Mylopoulos, _Non-Functional Requirements
in Software Engineering_. Kluwer Academic, 2000; P. Devanbu and S.
Stubblebine, "Software Engineering for Security: A Roadmap," _The Future of
Software Eng._, A. Finkelstein, ed., ACM Press, 2000.; and D.G. Firesmith,
"Specifying Reusable Security Requirements," _J. Object Technology_, vol.
3, no. 1, pp. 61-75, Jan.-Feb. 2004. and many others). A proof of concept
proves beyond a reasonable doubt that the functional requirements that are
to be met by the solution can be met by the solution proposed. Though it is
not a complete implementation of the solution, it is enough of an
implementation to prove the feasibility of the solution and that it fits the
problem at hand. It should, however, be significantly less expensive to
develop than the solution itself, lest it not serve its purpose as a time and
money saver.

### When?

"Before it's too late, but no earlier".

It's too late to prove a concept when your design depends on the concept to
work, so you have to prove it before that. It's too early to prove a concept
if you haven't even analysed the requirements the solution is going to have
to meet yeat, so you need to prove your concept after that. It's no use to
create a formal proof of concept if there are already plenty of proofs around,
so you might not need to make your proof of concept at all (i.e. don't try to
prove the obvious).

"When in doubt, prove it!"

### What?

Some things are not concepts and should not be treated as such; a thing does
not become a concept just by sticking "conceptually" before it; and negatives
cannot be proven.

### How?

Say you want to use MySQL in a project written in C++, but you want the project
to be closed-source and you don't want to pay a license to MySQL AB (or Sun
Microsystems, or (soon) Oracle). You don't mind distributing MySQL's own source
code under GPL, but you don't want to GPL yours. Think about this for a bit.

After thinking about it for a bit, you may have come up with the solution "we
need an abstraction layer for MySQL that allows us to talk to the MySQL
database without using MySQL's own code". You mull on that a bit, think about
what that abstraction layer should be like and come up with something like this:
"We need a solution in which a closed-source object, can load an open-source
object at run-time; both expose the same or a similar API allowing to perform
database queries and the client application can use that API, talking directly
only to the closed-source part of the solution, to perform queries. The
closed-source object shall not depend on the open source object in any way
shape or form, but the open source object may depend on the closed source
object". Call the closed-source object "Manager" and the open-source object
"Driver" and you get ODBC.

You now have the following assertions:

- "ODBC allows us to perform SQL queries from within the C++ code on a MySQL
  database"

- "ODBC meets the performance requirements for our solution"

- "Using ODBC allows us to use the MySQL database without rendering our own
  source code GPL and without paying for a license"
  Each of these
  assertions is actually a _hypothesis_ and each of these hypotheses can
  be tested.. In order for a hypothesis to be tested, you need to be unable to
  falsify it - i.e. you need to try and fail at falsifying it; and you need to
  prove it practically feasible.

Our first assertions, "ODBC allows us to perform SQL queries from within the
C++ code on a MySQL database" is one that can only be falsified by trying to
prove its feasibility and failing. I've tried it - it's feasible (it's actually
very straight-forward). The second assertion, "ODBC meets the performance
requirements for our solution" depends on our performance requirements. Once
you have those, you can try to falsify it by building on your first proof of
concept - the one that proved that you can perform a query from C++ - by
performing queries that you conceive might not meet your requirements. You then
proceed by either failing to do so (all queries you can think of remain within
your performance requirements) or succeeding to do so and choosing a course of
action (optimize the proof of concept, or consider the concept a failure and
go back to the drawing boards). If you've passed this step (either by optimizing
your proof of concept or failing to produce queries that do not meet your
requirements; or perhaps by tailoring your requirements - it happens) you
verify that in all your proof of concept code, you have not used any MySQL code
that would render your implementation Free Software. You have thus proven your
third assertion: "Using ODBC allows us to use the MySQL database without
rendering our own source code GPL and without paying for a license".

While building your proof of concept, you are creating code. The code might not
meet all of the requirements production-level code would meet, but it should
be a very good starting point. Proof of concept code should therefore be
developed using the same standards as production code and should be conserved
in a working form - i.e. it should, during the development of the production
code, serve as your first tests.

So, for a more concise answer to "How?":

1. Analyse your requirements

2. Produce a set of assertions that are testable as hypotheses and of which
   proof will be sufficient evidence that the proposed solution is valid for the
   problem at hand

3. Find a solution that you think will meet the requirements

4. Conceive of tests to test each assertion (and make sure all stakeholders
   agree that the tests test the assertions adequately)

5. Develop and perform the tests, stopping as soon as one of your assertions
   fail.

You should test the assertion most likely to fail first: you should _**Fail Fast**_.

### Who?

The answer to this really depends on how you manage your human resources: as a
software analyst, I'd say my responsibility is to come up with solutions to
your problems and that would normally include proving that the solution I
propose is feasible and meets the requirements it sets out to meet - i.e. that
it solves the problem. I also happen to be a programmer some of the time, so
I don't mind programming some of the time. On the other hand, there is something
to be said for having a programmer - someone who will ideally be involved in
developing the final solution - code the proof of concept under the analyst's
supervision: the programmer will know what to expect when the time comes to
implement the final solution, and will have a far better understanding of what
requirements the solution should meet if he implemented the proof of concept
himself. That way, the proof of concept takes a bit longer to develop, but the
production code takes less time to develop.

So there's a trade-off, but from a business perspective, time-to-market will
usually win, as it should. Which allows for a shorter time to market depends
on the complexity and risk of the concept: higher-risk or more complex concepts
usually require more involvement from the analyst.

## Conclusions

Proofs of concepts are important: they save time, they save money and they
allow you to build your products on a solid foundation, with a better
understanding of both the problem and the solution. They require an investment
in the (potential) solution early on, but that's when investments have the
highest return and when modifications are least costly.