---
author: rlc
categories:
- Technology
- Programming
- Crime prevention
- Urban development
comments: true
date: 2009-08-10 01:42:40+00:00
layout: post
tags:
- debugging
- Posts that need to be re-tagged (WIP)
title: Crime, Debugging and the Broken Window Rule
wordpress_id: 147
---

In the late 1980s New York City was cleaned up from under the ground up: from 1984 to 1990, the New York subway was cleaned of its grafiti, then of its non-paying passengers. After that, when the chief of tge New York transit police became the chief of the New York city police, the city was cleaned up in the same way, and crime rates dropped dramatically.

<!--more-->

The people responsible for this clean-up believed that taking care of the details - the petty crimes and broken windows - would dissuade the (potential) criminals from criminal behavior and, apparently, they were right.

I think the same is true for code: the way the human psyche works, messy code doesn't invite the programmer to behave him/herself but seems to rather invite him/her to let go of his/her restrictions and just add a few hooks and patches until things seem to stick together. When there's no apparent discipline in the code as it _was_ written, there usually won't be any when there's code being added or modified. When there's no apparent structure in the existing code, there is rarely any after a necessary, but most likely unwanted, modification.

I have seen this happen: I have seen inexperienced programmers get lost in huge piles of code and, through mere desperation, just start adding code to see if it works. I have subsequently see the mediocre tests on those huge piles of code succeed, the software shipped and the fragile equilibrium that kept the thing together simply, but loudly, fall apart. This is how code becomes a maintenance nightmare.

I believe that code should be readable, structured and neat. Neat meaning something like "tidy", not like "cool" - though that's OK too. When the code looks clean, the programmer will have a harder time messing it up, will be more inclined to do a good job and leave no visible traces of his passing - other than, perhaps, a bug that is no longer there. When the code is well-structured, even if that structure doesn't allow for the modification the programmer would like to make, the programmer will try to retain the structure and will be less likely to hook things together that weren't intended to be together. If the structure doesn't allow for the thing the programmer is trying to accomplish, he will be more inclined to replace the structure with a better, more flexible one, rather than for the existing structure into obedience.

Readable code, finally, doesn't mean it should be littered with comments: code should _definitely not_ try to chronicle its own history, as some "good practices" would have us do: there are tools to do that, such as Git, Subversion, CVS. MKS, SourceSafe, Bazaar, etc. Even using RCS directly is better than trying to do it in the code itself. Comments also have a tendency to lie about the code, so they should not be allowed to describe the code in any way, shape or form. No function should look like this:

    void foo(struct X x)
    {
    }

    void baz(struct X x)
    {
    }

    void bar(int m)
    {
        // create a VLA of Xs
        struct X xs[m]
        unsigned int n;
        // for each X in x, call foo
        for (n = 0; n < m; ++n)
        {
            baz(xs[n]);
        }
    }

Not only do the comments not add anything that is actually useful, but they lie: if you look closely, on line 17 of the example, baz is called, while on line 14, the comment said we'd call foo. In this case, the comment and the code were far enough from each other that the programmer who made the change changed the code, but not the comment.

Comments should explain rationale, and in some cases contracts. They may be useful for generating documentation, but they aren't useful for describing the code itself.