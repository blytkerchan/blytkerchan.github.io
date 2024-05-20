---
author: rlc
comments: true
date: 2022-03-22
layout: post
published: false
title: "Coaching and problem solving: report"
---

It’s tedious, but it works!

In my [previous post](https://rlc.vlinder.ca/blog/2021/09/27/pcdit) I described an approach I was going to try for coaching, going through a set of analytical steps with the coachee as we resolve a problem. I thought I’d report on some results.

<!--more-->

I have now used this approach with four different developers, in two different languages (French and English) and three different countries (US, Canada, and India). The overall conclusion is that it's difficult to not get ahead of the person in coaching and not solve the problem in their place, even if it would be significantly faster to do so, but here's a bit more detailed review.

## Better understanding

There's a clear improvement in understanding the problem and the solution on the coachee's part when I don't provide the answers unless they really can't find them. I've found that I have a tendency to provide too much information when I explain things, which tends to overwhelm the person I'm explaining to, so channeling Deanna Troi and asking "What do you think?" seems to be the best approach.

That doesn't mean I don't tell them where to look or what to look for, though: I do that by confirming (or not) the road to take. The questions are guided: "Why do you think that?" (try to find your mistake); "Do you think that approach is more complicated than it needs to be?" (it is!); "Have you written a unit test for this?" (you haven't, and you should)

## Short sessions

Daily 15-minute sessions with some flexibility to go over time have worked best for me so far: look at the previous day's code, answer questions, provide hints. Sometimes these sessions get canceled. That's fine, as long as they are regular. Having a hiatus of several days doesn't help keep the cadance going.

## Take notes

I found myself taking copious notes of the sessions, noting where the coachee had progressed in the project and what the next question was that needed to be answered. I noted the hypotheses that were put forward and I took my own notes as to how likely I thought those hypotheses would be, but I did not necessarily tell the coachee what I thought about their hypotheses because sometimes you need to find out for yourself why something is unlikely.

These notes helped me to remember where we left off the last time we discussed the problem and gave me an idea of what the progress was going to look like. I found that taking these notes helped me slow down and rein in the tendency I had to solve the problem myself. sometimes the person I was coaching went a lot faster than I expected from one session to the next: they had found a solution to a part of the problem that I had not expected them to find or that had not occur to me. In other cases the person I was coaching turned out to have less knowledge of the C++ programming language tonight expected and we needed to diverge into C++ syntax and structure before we could go back to the problem at hand. In any of these cases, my notes at least reminded me where we had left off and helped me guide the person who the problem even when sometimes the solution seemed clear.

I should note that in each of the cases that I'm describing now, the person being coached was working on something that I have worked on for years and was new for them, either adding a feature or fixing a bug in a complex system written in C++. The problem with legacy systems is that they are usually clear as mud to someone new to the code base and "claire comme de l'eau de roche" (clear as springwater) to someone who has been in that CodeBase for quite a while. This is why coaching is important in the first place: Documentation doesn't cut it especially when working code is valued over comprehensive documentation.

## Test-driven development

Any new code should be covered by unit tests and coverage should be at least 85%. With that in mind, and targeting understanding as well as working code, taking a test-driven development approach makes a lot of sense. Out of my four experiments with this new approach to coaching, I have insisted on test-driven development only in the last case. in the other cases I still required unit tests to be a written, but they could be written once semi-working code was achieved. It turns out, though, that the test-driven approach was the more successful one: the final code quality was better than in the other three cases, and is the spite the additional difficulties the developer in question had. I don't have enough data to be able to affirm with any type of certainty that test-driven development is universally better, but I will certainly put a bit more emphasis on unit tests in my next endeavors.

## Adjust expectations

on a daily basis I work with a lot of very talented senior developers who have worked in the same system for decades. This has skewed my expectations
