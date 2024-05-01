---
author: rlc
categories:
- Economics
- Engineering
- Risk Management
- Quality Assurance
- Software Development
comments: true
date: 2012-06-02 13:45:11+00:00
layout: post
title: 'Robustness analysis: the fundamentals'
wordpress_id: 1840
---

Up until 2008, the global economy was humming along on what seemed like smooth sailing, doing a nice twenty knots on clear waters, with only an occasional radio message saying there were icebergs up ahead. Surely none of that was anything to be worried about: this new economy was well-designed, after all. Redundant and unnecessary checks had been removed but, in order for the economy to be robust, the engineers of the economy had made sure that at least two whole compartments could be flooded before anything really nasty would happen.

Sound familiar?

<!--more-->

What the engineers of the economy had done, as the engineers of another magnificent, and equally doomed, new vessel before them, was a robustness analysis -- but a faulty one (either that, or they hadn't followed their own advice afterward). When the proverbial excraments did hit the proverbial fan, another robustness analysis was in order. The one they did on the first vessel led them to abandon ship. The one they did on the second vessel led to drastic course corrections, at least in some countries.

The country I live in, Canada, analysed the economy and, from mid 2008 onward, told us that "the fundamentals of the Canadian economy are strong". Unlike other economies, the "redundant and unnecessary" compartimentization and checks had not been removed in the Canadian model and while that meant that our particular boat was a it slower than the "big one down South", it also meant it was still afloat. We would batton down the hatches, make the necessary changes and weather the storm.

In similar situations, a real-time embedded system running 24/7 without human intervention can't fall back on a new analysis: it has to be right the first time. The result of the a faulty robustness analysis (whatever they may have called it, and however explicitly it may or may not have been done), in the case of the Titanic cost the lives of over 1,500 people. In the case of the economy, it cost a sizeable chunk of cash and a lot of hardship. The result of a faulty robustness analysis in a 24/7 RTE system depends on the role of the system and on the problem it encounters, but can range from inconvenience to loss of life.

Robustness analysis does not have to be an expensive, lengthy exercise: in some cases, it is a simple matter of briefly looking at the project. Those cases are usually the bad ones, though: a serious large-scale project that is well-defined usually takes a while to analyse. So let's take a look into how a behavioral analysis of a large-scale 24/7 embedded system and the process to devise that system, with an emphasis on the robustness of the final product, can be made "short and sweet".

[![](http://geekandpoke.typepad.com/.a/6a00d8341d3df553ef01676627bd06970b-pi)](http://geekandpoke.typepad.com/geekandpoke/2012/05/simply-explained-wtf.html)Fundamentally, a project outcome is determined by the people working on the project, and how they do their job. To find out how they do their job, you can look at a few things:

1. What are the analysis and development processes?

2. How mindful are developers of robustness issues?

3. What are the high-level deliverables for the project?

4. How are common robustness issues addressed in system development?

The robustness of the project is a factor of the process through which the project is developed and the people developing it. If all the proper checks and balances (design reviews, code reviews, etc.) are in place, the robustness of the project's deliverables becomes a question of the mindfulness of the people working on the project and the measure in which the processes in place help them to transform that mindfulness into activity.

For example: if on a project committing a modification to the code requires review of that modification by a peer, but neither of the two peers (developer and reviewer) are mindful of robustness, any problem related to robustness is far less likely to be detected -- and for more likely to be present -- than if there is no review, but the developer is mindful of potential robustness problems.

Once you are satisfied that developers are mindful of robustness issues, the question becomes whether the higher-level design, which starts in the board rooms of the Marketing department, is also done with robustness issues in mind. While developers are the ones who ultimately implement the design and thus have the most direct impact on the robustness of the final product, Marketing requirements frame acceptance tests and functional requirements alike, and mandate R&D; to implement the necessary testing processes to make development of a robust RTE system possible.

Plainly: if robustness is not part of the initial requirements -- and defining quality as the measure to which the product meets its requirements -- robustness of the RTE system will not be considered as a factor in its quality, and will therefore be neglected.

In my [previous post](http://rlc.vlinder.ca/blog/2012/03/robustness-analysis-finding-faults/) I gave an overview of the kinds of faults that affect the robustness of a system. The list is incomplete, of course, but is a good starting point to check against, to see if existing procedures include measures geared to preventing these faults, and catching them early when to do occur.

Often, static analysis tools can go a long way toward automating code analysis. Many such tools are commercially available -- and some of them are really very good.

The reason why Canada's economy has weathered the storm -- and still is weathering the storm (because this storm ain't over) -- is precisely because the _fundamentals_ are strong. Robustness analysis is above all a question of looking at the fundamentals of the object of the analysis and, while I admit that the comparison between the global economy, a ship and a 24/7 embedded system is somewhat far-fetched (and will end here) this basic premise does hold for all three.

Once you are confident that the fundamental features of a mindful development process are in place, it may be time to look at the code: how the most relevant APIs are designed, if the proper error-prevention techniques are used, etc. However, one of the biggest challenges in robustness analysis is to not let it decay into a gigantic code review: while it may be necessary to look at _some_ details in the code, it is certainly not necessary to look at every detail of the code. The question is where to draw the line, but once you are satisfied that all the stakeholders are mindful of the issues at hand, code review becomes only one tool.