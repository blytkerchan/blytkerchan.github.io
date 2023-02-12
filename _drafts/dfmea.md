---
author: rlc
layout: post
excerpt: How to "easily" identify failure modes, and how to address them
title: DFMEA- Design Failure Mode and Effect Analysis
---

<img src="/assets/2023/02/cat.jpg" width="300px" align="right" alt="I wrote this by hand before typing it up, and drew a cat. This is the cat." />Design Failure Mode and Effect Analysis (DFMEA) is a software engineering technique that can help validate design decisions or improve upon them. It takes your existing design and puts eaach component and link under a magnifying glass, running it through a what-if scenario. In this post, I will walk through a DFMEA of a fictional website and on-line store for a fictional florist. If you read my other blog, [Applied Paranoia](https://applied-paranoia.com) you may already be familiar with that application.

The Crassula application uses a static website generated with Jekyll, and an Angular app embedded in that website for the purchasing workflow. The static front-end and angular app are served out of an S3 bucket behind a CloudFront proxy, the back-end for the store uses some serverless functions (lambdas), and S3 bucket to download invoices from, and a NoSQL database. The whole thing is tied together using AWS' Simple Queue Service and deployed using CloudFormation.

The S3 bucket that contains the front-end (static site and Angular app) is the first point of entry for any customer. The Angular app calls out to the API and implements the workflows, including downloading invoices from the second S3 bucket using SAS URIs, but unlike the static app it can handle temporary failures of the API or the S3 bucket with a modicum of grace.

To do a DFMEA on this application we go through three high-level steps, some of which have sub-steps. Before we start doing that, though, we should set a goal. For purposes of this analysis, we'll set a goal of 99.5% uptime. I've taken this number more or less arbitrarily, and getting to such a number is outside the scope of this post[^1], but it will be needed later on.

[^1]: The number defines a monthly "downtime budget". In this case, we're going for a "two nines" availability. As a rule of thumb, you can assume that every time you add a nine (e.g. 99.9% is three nines, 99.99% is four nines, etc.) you multiply the cost of your solution by ten. A 99.5% uptime objective gives you a downtime budget of 3:36 hours per month. There is no such thing as 100% uptime.

The steps are:

1. list all the components in the solution
2. create a diagram of the components and how they relate to each other
3. for each component and communications link, determine what failure looks like

The intent is to answer the question "How does this fail?" This is the first of three questions we will need to ask[^2]:

- How does it fail?
- How do I know it failed?
- What do I do when I know it failed?

[^2]: I shamelessly stole these questions from <a href="https://sre.google" target="_blank">Google's excellent resources on SRE</a>.

## Listing the components

The first step is to list all the components. In the case of this particular application, there are actually quite a few:

* **AWS CloudFront** is used as a content delivery network and caching reverse proxy. It has a cache, so most hits on the website will not hit the underlying S3 bucket.
* An **S3 bucket** is used to store the Jekyll-generated static site and the Angular-generated one-page store front-end as well as the associated static resources (such as images, style sheets, etc.).
* **AWS' DNS service** is used for the domain and sub-domains.
* **AWS' PKI** is used to secure the site. This is implemented using AWS Certificate Manager
* An **API Gateway** is used to serve the store application's API
* A second **S3 bucket** is used to share confidential files (invoices etc.) with the user.
* Several **Lambda functions**, all written in Node.js, are used. One of these is an identity-aware proxy, the others are business logic micro-services, and interface micro-services to third-party services.
* The **Amazon Simple Queue Service** is used to allow the micro-services to communicate with each other.
* Two services use a **DocumentDB** to store information about transactions etc.
* **AWS Cognito** is used for identity management.
* A third-party payment service is used to process payments.



<hr/>