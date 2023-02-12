---
author: rlc
layout: post
excerpt: How to "easily" identify failure modes, and how to address them
title: DFMEA: Design Failure Mode and Effect Analysis
---
<img src="/assets/2023/02/cat.jpg" width="300px" align="right"a/>Design Failure Mode and Effect Analysis (DFMEA) is a software engineering technique that can help validate design decisions or improve upon them. It takes your existing design and puts eaach component and link under a magnifying glass, running it through a what-if scenario. In this post, I will walk through a DFMEA of a fictional website and on-line store for a fictional florist. If you read my other blog, [Applied Paranoia](https://applied-paranoia.com) you may already be familiar with that application.

The Crassula application uses a static website generated with Jekyll, and an Angular app embedded in that website for the purchasing workflow. The static front-end and angular app are served out of an S3 bucket behind a CloudFront proxy, the back-end for the store uses some serverless functions (lambdas), and S3 bucket to download invoices from, and a NoSQL database. The whole thing is tied together using AWS' Simple Queue Service and deployed using CloudFormation.

The S3 bucket that contains the front-end (static site and Angular app) is the first point of entry for any customer. The Angular app calls out to the API and implements the workflows, including downloading invoices from the second S3 bucket using SAS URIs, but unlike the static app it can handle temporary failures of the API or the S3 bucket with a modicum of grace.

