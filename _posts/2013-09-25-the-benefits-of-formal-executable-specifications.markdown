---
author: rlc
categories:
- Software Development
- Formal Specifications
- Programming Languages
- Haskell
- System Design
- Bug Fixing
- Verification
- Testing
- User Interface Design
comments: true
date: 2013-09-25 16:36:23+00:00
layout: post
title: The benefits of formal, executable specifications
wordpress_id: 2387
---

While a specification should not specify the C++ code that should be implemented for the specified feature, it should specify the feature in a verifiable manner. In some cases, formal -- and even executable -- specifications can be of great help.

<!--more-->

For the last few weeks, I've been working on the way a rather complex system presents itself to the user of that system, though a LED and a number of binary inputs, and through statistics that can be read with a specialized client. For the LED and the binary inputs, we found several bugs in the original specification, to the point that we decided to re-do the specification from scratch, on a whiteboard.

When I started writing on the whiteboard, I found myself writing Haskell code on the whiteboard. It looked a bit like this:

    cas m q c =
        let bA = m /= 0xffff
            bB = ((q <= m) && (q /= 0xffff))
            bC = (c <= m) && (bA || bB)
        in [bA,bB,bC]

followed by a truth table mapping the three bits to the states the binary inputs and the LED should have.

In Haskell, this defines a function `cas` that returns a list of three Booleans as a function of four integer values. I copied what I'd written on the whiteboard into a text file and ran it through ghci, the interactive Haskell interpreter, with a number of values.

I soon found out that there was a transition of the state of `m`, `q` and `c`, where `m` and `q` were both `0xffff`, where the LED and one of the binary inputs did not behave as I wanted it to: I had to take another variable, which we'll call `l`, into account. The Haskell code on the whiteboard now became:

    cas m q c l =
        let bA = m /= 0xffff
            bB = ((q <= m) && (q /= 0xffff))
            bC = (c <= m) && ((bA || bB) || ((c <= l) && (l /= 0xffff)))
        in [bA,bB,bC]

and I added a bit of code put the look-up table in:

    data Led
        = OFF
        | GREEN
        | AMBER
        | RED
        deriving (Show)

    toLU c = case c of
        [False, False, False] -> (  OFF,  False  ,  False  )
        [False, False,  True] -> (  OFF,   True  ,  False  )
        [False,  True, False] -> (GREEN,  False  ,   True  )
        [False,  True,  True] -> (GREEN,   True  ,   True  )
        [ True, False, False] -> (  RED,  False  ,  False  )
        [ True, False,  True] -> (AMBER,   True  ,  False  )
        [ True,  True, False] -> (  RED,  False  ,   True  )
        [ True,  True,  True] -> (GREEN,   True  ,   True  )

As it was rather late in the evening, and my colleague -- who would be implementing this part -- had already left for the day, I left it at that.

The next morning, when I arrived at the office, my colleague had already started implementing the spec from what was on the white board. While he doesn't "speak" Haskell, the logic is clear enough (and he's familiar with the subject matter) for him to implement it without needing to "speak" Haskell at all.

He had the wherewithal to add traces to his implementation that mapped the inputs he received to the (numbered) case on the whiteboard (numbered 0 through 7) so his implementation told us "from the current state of the system, I'm in state 5" (just not so verbose). We found that in state 5, the color of the LED was wrong (red in stead of "amber"). We had half a minute of "is this right?" but ghci showed us that the LED should be amber with the inputs we had, from the spec we had on the whiteboard, so we knew where the bug was.

We now had a specification that corresponded to what we wanted in terms of behavior, and that we could test against easily: each of the parameters of the Haskell function correspond to states in the system that can be measured and reported. With the Haskell interpreter, we can say what the system should do with those states -- and with the binary inputs and the LED, we can see what it does.

---

I wasn't usually a big fan of _executable_ formal specifications -- I wasn't all that big a fan of formal specifications, for that matter -- but I've been working on the "state presented to the user" (HMI)-side of this project for a few weeks now. The specifications of what the HMI should do are, as they say, a "_floue aritistique_" which means that for the last few weeks, I've been working more or less in the dark w.r.t. what I can prove does or doesn't work.

Formally specifying the expected behavior of the system and being able to test it against that formal specification was like a breath of fresh air in this case: it took all of a few minutes to copy the Haskell code from the white board to a text file and run it in the interpreter, to find a bug in the specified behavior, discuss it, fix it, update the Haskell code (on the white board and in the text file) and have something we can test against. We now have a verifiably correct implementation of the specification -- and the behavior we want.

I was honestly surprised by how little overhead a formal specification (for and admittedly small case like this one) incurred. In this case, the overhead was clearly much smaller than the several back-and-forths to arrive at an informal specification, with all its artistic fuzziness and an impossible-to-verify implementation that would have been -- and it has given me a new appreciation for formalism.