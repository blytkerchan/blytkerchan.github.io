---
author: rlc
comments: true
date: 2015-06-25 10:17:41+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2015/06/bayes-theorem-in-non-functional-requirements-analysis-an-example/
slug: bayes-theorem-in-non-functional-requirements-analysis-an-example
title: Bayes' theorem in non-functional requirements analysis -- an example
wordpress_id: 3540
categories:
- Anecdotes
- DNP3
- Industrial Automation
- Quality
- Smart Grid
- Software Engineering
tags:
- Bayes' theorem
- non-functional requirements
- requirements analysis
---

[caption id="attachment_3543" align="alignright" width="147"][![Bayes' theorem](http://rlc.vlinder.ca/wp-content/uploads/2015/06/BayesTheorem.png)](http://rlc.vlinder.ca/wp-content/uploads/2015/06/BayesTheorem.png) Bayes' theorem[/caption]I am not a mathematician, but I do like Bayes' theorem for non-functional requirements analysis -- and I'd like to present an example of its application. ((I was actually going to give a _theoretical_ example of availability requirements, but then a real example popped up...))
<!-- more -->
Recently, a question was brought to the DNP technical committee about the application of a part of section 13 of IEEE Standard 1815-2012 (the standard that defines DNP). Section 13 explains how to use DNP over TCP/IP, as it was originally designed to be used over serial links. It basically says "pretend it's a serial link", and "here's how you do TCP networking".

[caption id="attachment_3639" align="alignright" width="320"][![Network diagram — Bayes](http://rlc.vlinder.ca/wp-content/uploads/2015/06/Network-diagram-—-Bayes-New-Page-1-1024x645.png)](http://rlc.vlinder.ca/wp-content/uploads/2015/06/Network-diagram-—-Bayes-New-Page-1.png) Network diagram of the use-case[/caption]The use-case in question involved a master device talking to several oustation devices over a single TCP connection. The TCP connection in question really connected to a port server, which transformed the TCP connection into several serial connections.

The standard tells the master and the outstation to periodically check whether the link is still alive, and to close the TCP connection if it isn't. This works fairly well in the specific (but most popular) case where the master connects to a single outstation using a TCP connection. I.e. in that case (here comes Bayes' theorem):
[latex]P(tcp|dnp)=\frac{P(dnp|tcp)P(tcp)}{P(dnp)}=\frac{P(tcp)}{P(dnp)}\approx 1[/latex]
I.e. the probability that the TCP connection is broken given that the DNP link is broken is equal to the probability that the DNP link is broken given that the TCP connection is broken, times the probability that the TCP connection is broken (at any time), divided by the probability that the DNP connection is broken (at any time). As the probability that the DNP link is broken given that the TCP connection is broken is 1 (the DNP link is wholly dependent on the TCP connection), this is really the probability that the TCP connection is broken divided by the probability that the DNP link is broken. The probability that a DNP link breaks, given a production-quality stack, should be very low, and about equal to (but strictly higher than) the probability that the TCP connection breaks, so one may safely assume that if the DNP link is broken, the TCP connection is also broken. ((I should note that this implies that [latex]P(dnp|\neg tcp)[/latex] is very small indeed which, given that w're talking about link status requests, which are implemented in the link layer and in most implementations don't require involvement of much more than that, is a fairly safe assumpion.))

For the remainder of this article, we will assume that the devices on the other end of the TCP connection are more _much_ likely to fail than the TCP connection itself. While this was not our assumption before, and is not an assumption I would expect the authors of the standard to have, applying this assumption to a case where there is only one device at the other end has very little effect on availability, as closing the TCP connection does not render any other devices unavailable, while it a disconnect/reconnect _may_ fix the problem -- the near-zero negative effects of a false positive far outweigh the positive effect in case it's not a false positive: even if you have a 90% chance that a disconnect/reconnect doesn't work, it can't hurt. This is obviously not the case in our use-case, where such a false-positive rate greatly diminishes the availability of other devices on the same connection. I.e., we will assume five-nines (99.999%) uptime for the TCP connection and four-nines (99.99%) uptime for the DNP3 devices.

The use-case in the standard -- one master, one outstation, one connection -- is the use-case the member came up with, which involved one TCP connection, but [latex]N[/latex] DNP links -- the other DNP links were still working, for as far as we could tell.

The probability that all DNP links go awry _at the same time_ is very small indeed  
([latex]P(dnp_{all})=P(tcp) + P(dnp|\neg tcp)^{N}[/latex] -- i.e. the probability that the TCP connection is down plus the probability that all DNP links are down while the TCP connection is still alive -- to be precise), but still strictly greater than [latex]P(tcp)[/latex], so our equation now becomes:
[latex]P(tcp|dnp_{all})=\frac{P(dnp_{all}|tcp)P(tcp)}{P(dnp_{all})}=\frac{P(tcp)}{P(dnp_{all})}\approx 1[/latex]
but the probability that the TCP connection is broken given that _only one_ DNP link is broken is very small, namely:
[latex]P(tcp|dnp_i \bigwedge \neg dnp_{all \, except \, i})=\frac{P(dnp_i \bigwedge \neg dnp_{all \, except \, i}|tcp)P(tcp)}{P(dnp_i \bigwedge \neg dnp_{all \, except \, i})}=0[/latex]

Note: it is impossible for a DNP link that is wholly dependent on the TCP connection to be available while the TCP connection is not. Hence, as long as one DNP link is still available, the TCP connection is necessarily still alive. This means that deciding to break the TCP connection on the assumption that it was already broken while some DNP links are still communicating has the clear effect of _reducing_ availability (the opposite of the intent).

So, if you don't decide to cut the TCP connection as soon as you see a DNP link going down, when do you decide to cut the connection?

The issue with this question is that, while as long as there is only one link for any connection we can think in terms of "good" and "bad" links, as soon as we have more than one link we have to add the notion of an "unknown" state and a "device failure" state.

[caption id="attachment_3592" align="alignright" width="320"][![Link status OK](http://rlc.vlinder.ca/wp-content/uploads/2015/06/link-status-OK1-1024x352.png)](http://rlc.vlinder.ca/wp-content/uploads/2015/06/link-status-OK1.png) Flow chart indicating what is done when a message is received re: the link and connection statuses[/caption]If any message is received from any device whatsoever, it is clear that the TCP connection is still alive and that any device link that is down at the moment is due to a device failure.

That means that in any assessment of the likely state of the TCP connection, any devices that were previously marked as having a "bad" link status are no longer relevant: they most likely failed because of a device failure.

[caption id="attachment_3600" align="alignright" width="320"][![Link status request time-out](http://rlc.vlinder.ca/wp-content/uploads/2015/06/Link-status-request-time-out-1024x649.png)](http://rlc.vlinder.ca/wp-content/uploads/2015/06/Link-status-request-time-out.png) Link status request time-out[/caption]So, when a link status request times out, we really only know that the link status of the device for which it timed out is "bad", and that we can no longer assume that the devices for which it was "good", it still is "good". This is the moment where we should assess whether the TCP connection is at fault -- in which case it should be closed -- or whether something else is wrong. What we need to know is [latex]P(tcp|dnp_i)[/latex].

As shown above, [latex]P(tcp|dnp_i) = \frac{P(tcp)}{P(dnp_i)}[/latex]. ((Because [latex]P(dnp_i|tcp)=1[/latex])) Now, if we have five-nines uptime for TCP and our-nines uptime for DNP3, [latex]P(tcp|dnp_i) = \frac{P(tcp)}{P(dnp_i)}=\frac{0.0001}{0.00001}=0.1=10\%[/latex] -- hence the "90% chance that a disconnect/reconnect doesn't work" I mentioned earlier.

If, however, we find that there are _two_ DNP links that are down, [latex]P(tcp|dnp_i \wedge dnp_j) = \frac{P(tcp)}{P(dnp_i \wedge dnp_j)}[/latex]. This is somewhat more difficult to calculate correctly, because while it would be tempting to say that [latex]P(dnp_i \wedge dnp_j) = P(dnp)^2[/latex], that is clearly not accurate as we know, due to the complete dependency of the DNP link on the TCP connection, that [latex]P(dnp_i \wedge dnp_j) > P(tcp)[/latex], so [latex]P(dnp_i \wedge dnp_j)[/latex] is really [latex]P(dnp_i \wedge dnp_j) = P(tcp) + P(dnp \wedge \neg tcp)^2[/latex], which, in our case, assuming five-nines for TCP and four-nines for the DNP3 link, means  
[latex]P(tcp|dnp_i \wedge dnp_j) = \frac{P(tcp)}{P(dnp_i \wedge dnp_j)}=\frac{P(tcp)}{P(tcp)+P(dnp \wedge \neg tcp)^2}=\frac{0.00001}{0.00001+(0.0001-0.00001)^2}=99.919\%[/latex].

So, while with only one system's link down the probability of the TCP connection being the problem is only 10%, when the second link goes down, absent knowledge of the link being OK between the first and second down, the probability of the TCP connection being the problem shoots up to nearly 100%. This means that there is no need, at that point, to probe the other devices on the connection.

Note that this is _regardless_ if how many devices there are on the other end of the connection: as soon as there are two devices that have failed to respond to a link status request and no devices have communicated between those two failures, it is almost certain that the TCP connection is down.

