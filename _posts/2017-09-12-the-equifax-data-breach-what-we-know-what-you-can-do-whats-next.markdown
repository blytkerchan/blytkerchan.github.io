---
author: rlc
comments: true
date: 2017-09-12 01:48:09+00:00
layout: post
title: "The Equifax data breach: what we know, what you can do, what's next"
wordpress_id: 4252
categories:
  - In the news
tags:
  - class action
  - data breach
  - Equifax
  - financial system
  - hack
  - identity theft
  - in the news
  - security
---

{% include shadowbox.html text="<b>The TL;DR:</b>" open_only=true %}

<img src="/assets/2017/09/img_7368-141x300.jpg" alt="TL;DR mindmap">
</div>
<!--more-->

## What we know from Equifax

In May of this year, [Equifax suffered a data breach](https://www.equifaxsecurity2017.com/consumer-notice/). We only know this because they told the public about it after they had found it a few months later. The breach started in May and was closed in July.

From what Equifax has publicly said, the breached database contained identifying information about hundreds of thousands of people in the US and Canada. They did not give the total number of records that was accessible to the hackers, nor did they say what was in the database, exactly. They did say that there information included credit card information, driver's licences, dispute information, etc.

## What we know from the New York Attorney General

On September 8, the New York State Attorney General [issued a press release](https://ag.ny.gov/press-release/ag-schneiderman-launches-formal-investigation-equifax-breach-issues-consumer-alert) indicating they were starting a formal investigation into the breach. One very important thing came out of this press release: **Equifax has been low-balling the impact of the breach**: according to the AG, eighth million New Yorkers were impacted by the breach. New York State has 19.75 million inhabitants, so taking into account that Equifax deals in information about adults, that's about half the adults in New York State.

Extrapolating to the rest of Equifax clientele, which includes large swaths of North America, about half of all adults in North America may be affected by this data breach.

## What we don't know

We don't know who committed the breach. High-profile breaches like this are usually done by "advanced persistent threats" (APTs), either commissioned by some criminal organization or government, or on their own initiative. In the latter case they'll usually claim responsibility and put the "loot" (in this case, the personal information of potentially millions of North Americans) up for sale. Obviously, they won't just put it up in Ebay or some such public site, but there are sites for that (which I don't monitor so I wouldn't necessarily know if the days has been put up for sale). If it has been put up for sale, I haven't seen any reporting about it yet.

That also means we don't know who has our information now: Equifax has the personal information, including anything needed to commit identity theft, for millions of North American adults. We already know that at least part of that information has fallen into the hands of criminals, but we don't know what criminals. We have reason to hope it's a government entity (e.g. Russia or China) rather than a criminal enterprise if only because a government would be more likely to try to use the information gathered for extortion rather than identity theft, but that is the only reason we might hope that -- and then only if we have no particular reason to great extortion. Gathering the financial and personal information of potentially millions of North American adults seems a rather blunt instrument to obtain information to extort with, so any such hope would be fleeting indeed.

If the operation was one intended to obtain information to use for identity theft, the motivation was necessarily pecuniary, but pecuniary motives may also lead to other paths for profit: the information may simply be held for ransom or may be sold to the highest bidder. Here, again, we may hope for the scenario of the information being held for ransom, and Equifax having the means and intent to pay up. The criminals would, in such a case, likely get away with their misdeeds Scott free, but we would be reassured that if the is honour among thieves, our personal data will be safe in their hands -- another very precarious hope.

Faced with the impossibility of changing our identities _en masse_ we have but fleeting and precarious hope to rely on for the safety of those same identities and, with them, our good names and credit scores.

We also don't know how, exactly, the breach was committed not how the vulnerability that was evidently exploited was eventually mitigated. We only have Equifax's word that they hired professional help to mitigate the problem and analyse the source but, at the time of this writing, we neither know who they are nor what they've done. In situations like these, we may expect such parties to report done version of their findings to the public, as approved by Equifax, to allay the fears of the public and inform experts so those experts can then allay those fears some more with informed opinions in the media. We must look forward to such reporting, as we have none now and are utterly in the dark.

## What you can do to protect your identity

Identity theft usually entails taking up an account of some sort in the victim's name and using their good credit to endebt that account, and thus the victim. Using the services Equifax and their competitors provide, you can monitor for such accounts being created. Creating a credit card account is extremely ready when you have good credit: many stores will gladly open one for you, backed by MasterCard or VISA and with several thousands of dollars of credit -- and often after minimal identification. I can only imagine how much credit one can accumulate if one has evil intentions. Hence, closely monitoring, or subscribing to an alert service, is pretty much the only thing you can do. Added to that, you must act quickly and decisively if an account is opened in your name or if your credit card is charged for anything you did not expect. Your social security number, birth date, name, etc. have no expiry date in your lifetime and are often sufficient to open an account. Your existing credit cards, if known to Equifax, do have an expiry date but are worth monitoring nonetheless.

There have been rumours that Equifax required people signing up for monitoring services to opt out of joining a class action law suit. It is not clear that this is true, nor that it is false. Read any terms and conditions carefully before agreeing to them if you want to keep your options open.

## What will happen next

I would expect each of the following:

1. The investigation by the New York State Attorney General will most likely lead to charges being laid, and settled.

2. A class action law suit against Equifax will likely be brought. If admitted, an advertisement will probably be placed to let you know what the criteria to join the class are. Such advertisements are usually put in fault newspapers, so you might want to watch for that.

3. The hackers will either start using the information or will try to make money from it. The easiest way to do that is to auction it off. Slightly harder would be to start stealing identities. The skillset required to successfully hack a site like Equifax and the skillset to successfully steal identities overlap but are not the same, but there are millions to be made for the hackers in either case, so it will ultimately be a business decision for them to determine what they'll do with the information. I'd watch for news reports on the geeky side of the spectrum.

# Conclusion

<img src="/assets/2017/09/img_7371-150x150.jpg" alt="Equifax dip after announcing breach">

**We're all screwed.** The only sure way to prevent this from happening again is to seriously revise the financial system's way of dealing with their customers' personal information, which would come at significant cost and while Equifax lost a bit over 10% in market capitalisation over the last few days, analysts are already saying to ["buy the dip"](http://www.seekingalpha.com/news/3294739) and, taking into account how ingrained Equifax is in consumer credit, they'd be foolish not to.

A less-sure way is for companies to take development seriously, implement a security life cycle and do regular security audits. Even with such measures in place security issues will slip by, so the emphasis should always be on _deter, detect, deny, delay_.
