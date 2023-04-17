---
author: rlc
layout: post
excerpt: How to "easily" identify failure modes, and how to address them
title: DFMEA- Design Failure Mode and Effect Analysis
---

<img src="/assets/2023/02/cat.jpg" width="300px" align="right" alt="I wrote this by hand before typing it up, and drew a cat. This is the cat." />Design Failure Mode and Effect Analysis (DFMEA) is a software engineering technique that can help validate design decisions or improve upon them. It takes your existing design and puts each component and link under a magnifying glass, running it through a what-if scenario. In this post, I will walk through a DFMEA of a fictional website and on-line store for a fictional florist. If you read my other blog, [Applied Paranoia](https://applied-paranoia.com) you may already be familiar with that application.

The Crassula application uses a static website generated with Jekyll, and an Angular app embedded in that website for the purchasing workflow. The static front-end and angular app are served out of an S3 bucket behind a CloudFront proxy, the back-end for the store uses some serverless functions (lambdas), and S3 bucket to download invoices from, and a NoSQL database. The whole thing is tied together using AWS' Simple Queue Service and deployed using CloudFormation.

The S3 bucket that contains the front-end (static site and Angular app) is the first point of entry for any customer. The Angular app calls out to the API and implements the workflows, including downloading invoices from the second S3 bucket using SAS URIs, but unlike the static app it can handle temporary failures of the API or the S3 bucket with a modicum of grace.

To do a DFMEA on this application we go through three high-level steps, some of which have sub-steps. Before we start doing that, though, we should set a goal. For purposes of this analysis, we'll set a goal of 99.5% uptime. I've taken this number more or less arbitrarily, and getting to such a number is outside the scope of this post[^1], but it will be needed later on.

[^1]: The number defines a monthly "downtime budget". In this case, we're going for a "two nines" availability. As a rule of thumb, you can assume that every time you add a nine (e.g. 99.9% is three nines, 99.99% is four nines, etc.) you multiply the cost of your solution by ten. A 99.5% uptime objective gives you a downtime budget of 3:36 hours per month. There is no such thing as 100% uptime.

The steps are:

1. list all the components in the solution
2. create a diagram of the components and how they relate to each other
3. for each component and communications link, determine what failure looks like:
   1. determine how likely it is to fail, and exclude anything that is too unlikely to be worth our time
   2. determine which remaining services are on the critical path for any service that has availability requirements, and exclude anything that isn't
   3. determine what the failure mode is
   4. determine what the user-visible effect or business impact of failure is
   5. determine how that failure can be detected
   6. determine how the failure can be mitigated
      1. within the design
      2. outside of the system
   7. determine how the failure can be remediated

The intent is to answer the three questions[^2]:

- How does it fail?
- How do I know it failed?
- What do I do when I know it failed?

[^2]: I shamelessly stole these questions from <a href="https://sre.google" target="_blank">Google's excellent resources on SRE</a>.

We want to be methodic in this approach, but we also want to quickly exclude anything we can exclude, so anything we deem isn't worth our time will be excluded from the analysis as soon as we can do so. We can always come back to it later.

## Listing the components

The first step is to list all the components. In the case of this particular application, there are actually quite a few:

- **AWS CloudFront** is used as a content delivery network and caching reverse proxy. It has a cache, so most hits on the website will not hit the underlying S3 bucket.
- An **S3 bucket** is used to store the Jekyll-generated static site and the Angular-generated one-page store front-end as well as the associated static resources (such as images, style sheets, etc.).
- **AWS' DNS service** is used for the domain and sub-domains.
- **AWS' PKI** is used to secure the site. This is implemented using AWS Certificate Manager
- An **API Gateway** is used to serve the store application's API
- A second **S3 bucket** is used to share confidential files (invoices etc.) with the user.
- Several **Lambda functions**, all written in Node.js, are used. One of these is an identity-aware proxy, the others are business logic micro-services, and interface micro-services to third-party services.
- The **Amazon Simple Queue Service** is used to allow the micro-services to communicate with each other.
- Two services use a **DocumentDB** to store information about transactions etc.
- **AWS Cognito** is used for identity management.
- A third-party payment service is used to process payments.

The DevOps components are out of scope for this analysis because if they fail, it prevents the site from being updated for the duration of the failure, but the site is not operationally affected.

Having now identified the components to include in the analysis, we can go on to the next step: creating a diagram of the architecture.

## Creating an architecture diagram

<a href="/assets/2023/02/step1.svg"><img src="/assets/2023/02/step1.svg" width="200px" align="right" /></a>We start this step by just placing all the components we just identified on a diagram. It’s usually a good idea to use some type of light-weight software for this, such as <a href="https://draw.io" target="_blank">draw.io</a> or <a href="https://lucidchart.com" target="_blank">Lucid Chart</a>. Things may need to move around a bit, so don't worry about putting things "in the right place" just yet.

Next, we'll add communications links to the diagram. To complete that picture, we need to add the client application as well as functional dependencies. Because this this application is built using a micro-service architecture in which individual micro-services are de-coupled from each other using an event bus (SQS in this case), you'll see there are actually very few direct dependencies and even fewer direct communications lines. For example, any API call from the client (shown in blue in the diagram) goes into the API gateway, which calls into the identity-aware proxy. That proxy, assuming authentication passes muster, will send a message onto the SQS bus for any POST or PUT request. For GET requests, it will fetch data from the associated DocumentDB, kept up-to-date by the aggregator service. If an entry is not found in the database but is expected to exist, the proxy will send a request onto the SQS bus and return a 503 error (in which case the front-end will retry, giving the services some time to respond and the aggregator to update the database).

<a href="/assets/2023/02/step2.svg"><img src="/assets/2023/02/step2.svg" width="200px" align="right" /></a>As shown in the diagram, all lambda services in the application depend on the SQS service, which all services directly communicate with. Because of this, and because of the de-coupled nature of the application, we don't really need to look at other types of dependencies for the lambda functions. They do warrant mentioning though (the application isn't just lambda functions talking to each other over SQS after all) and there is at least one example of each in the diagram. The first is data flow: from the user's perspective, the three components they need to exchange data with are the DNS, CloudFront, and the API Gateway. DNS doesn't really depend on anything outside of itself, but CloudFront depends on the S3 buckets to get its data, and on the certificate management system to implement PKI. For those dependencies, the data flow is actually in the other direction, but I prefer highlighting functional dependencies over highlighting data flow in such cases.

The other flow we need to highlight, and the only dependency that gets two arrows in the diagram, is a control flow dependency: the identity-aware proxy depends on the Cognito identity management system and, at least for some workflows, calls into that service are functionally synchronous (that is: a call into the proxy will fail if a call into Cognito times out or fails). In the type of architecture we're looking at here, such tight cooupling is rare -- as it should be. That is why those dependencies are highlighted with extra arrows.

Now that we have all the dependencies in our diagram, we can proceed to the next step.

## Exclude things too unlikely to fail

We will look at each component in the system design, see how likely it is to fail, and determine whether we should take a closer look at the failure modes. As we're building the service on AWS, this mostly means looking at SLAs. We'll exclude anything from our analysis that has an availability that is significantly higher than our 99.5% objective, or for which a failure would be effectively invisible to our users. Once we're done with this step, we will update our diagram to match. Let's treat the components in order, starting with CloudFront.

<style type="text/css">
  dt {
    font-weight: bold;
    //display: inline;
  }
  dd {
    //display: inline;
    padding-left: 3em;
    //text-indent: 3em;
  }
</style>

<dl>
    <dt>CloudFront</dt>
<dd>According to the <a href="https://aws.amazon.com/cloudfront/sla" target="_blank">Amazon CloudFront Service Level Agreement</a> AWS guarantees 99.9% average monthly uptime. CloudFront has more than 400 edge locations that, together, constitute a caching content delivery network.

Because of the way CloudFront is set up, and because we essentially only use it to deliver static content (we're not using the edge lambda feature nor any of the other more advanced features of CloudFront), CloudFront can be excluded from further analysis.</dd>

<dt>S3</dt>
<dd>According to the <a href="https://aws.amazon.com/s3/sla" target="_blank">Amazon S3 Service Level Agreement</a>, the uptime guarantee offered by AWS depends on the service tier used. Failure of the S3 service can manifest in the following ways:
<ul>
<li>A user trying to download the front-end application and hitting a cache miss in CloudFront also hits a failure in the S3 bucket, resulting in a partial or complete failure to load. This is very unlikely, as it requires both a cache miss and a failure, but the effect is visible.</li>
<li>A user trying to download an invoice gets an error and has to retry. This is the most likely visible effect as these files will not be cached by CloudFront.</li>
<li>The invoicing lambda fails to store a generated invoice PDF in the bucket. This is high-impact and would possibly require human intervention to manually retry the PDF generation and upload.</li>
</ul>
So, we need to keep S3 in the analysis.</dd>
<dt>DNS</dt>
<dd>AWS' Route53 has a 99.99% <a href="https://aws.amazon.com/route53/sla" target="_blank">SLA</a>. Additionally, DNS is a globally-distributed, caching database with redundant masters, so its failure is excluded from further analysis because it is just too unlikely.</dd>

<dt>AWS Certificate Manager (PKI)</dt>
<dd>CloudFront only needs access to the `us-east-1` instance of the AWS Certificate Manager at configuration, do a deployment of the stack will fail if the certificate manager is not available, but there is no operational impact in that case. As we're not concerned with deployment failures for this analysis, we can therefore exclude the certificate manager.</dd>

<dt>AWS API Gateway</dt>
<dd>The AWS API Gateway has an <a href="https://aws.amazon.com/api-gateway/sla" target="_blank">SLA</a> of 99.95%. If it does fail, the front-end (website and application) is still available and can therefore retry calls into the API if such calls time out or result in an HTTP 5xx error, indicating a failure in the back-end. That does require some foresight on our part, so we will need to include it in the analysis, even if the expected availability is very high.</dd>

<dt>Lambda functions</dt>

<dd>The lambda functions are much more likely to fail due to our own code misbehaving than they are due to some failure on Amazon's part, so regardless of the SLA Amazon offers, they need to be included in our analysis.</dd>

<dt>Simple Queue Service</dt>

<dd>The SQS bus is the glue that binds all the functions together. It is essential to the functioning of the application, so any failure of the service needs to be mitigated despite its 99.9% <a href="https://aws.amazon.com/messaging/sla" target="_blank">SLA</a>.</dd>

<dt>DocumentDB</dt>
<dd>The application stores all of its data in DocumentDB. The service has a <a href="https://aws.amazon.com/documentdb/sla" target="_blank">99.9% SLA</a> for availability, and backup capabilities with restore-from-snapshot functions. It maintains <a href="https://aws.amazon.com/documentdb/faqs" target="_blank">six copies</a> of the data and allows you to control creating more copies and backups.

As we use to to store all the data, we will include it in our analysis. As we're not talking about disaster recovery right now, we'll leave the backup capability out of scope, though, and concentrate only on availability issues.</dd>

<dt>Cognito</dt>
<dd>Cognito is used to for Identity and Access Management for the application and is used whenever a user logs in. It has a <a href="https://aws.amazon.com/cognito/sla" target="_blank">99.9% SLA</a>. As it is on the critical path for anything that requires authentication (which is basically everything), we will incude it in our analysis.</dd>

<dt>Third-party payment service</dt>
<dd>In this hypothetical application, let's assume we use a third-party payment service that provides a 99.5% SLA. We will include it in our DFMEA because payment is critical to the business.</dd>
</dl>

### Update the diagram -- concluding the first step
<a href="/assets/2023/02/diagram.svg"><img src="/assets/2023/02/diagram.svg" width="200px" align="right" /></a>With this in mind, we can now update the diagram and indicate what is, and what isn't, included in our analysis. The nice thing about this type of diagram is that you can use the same diagram, and much of the same approach, for things like thread modeling and architecture review as well. We obviously won't do that right now, but it's good to keep in minde that the diagram we just created will be an asset for that type of analysis.

What we've just done is set the *service level expectations* for each of the services we depend on. We can also represent this as a table (usually a spreadsheet) and show what we intend to exclude from further analysis.

| Component            | Group   | Type        | Description                                               | SLE    | Exclude |
| ---                  | :-:     | ---         | ---                                                       | --:    | :-:     |
| CloudFront           | infra   | CDN         | CDN used by the application front-end, and for SAS URIs   | 99.9%  | x       |
| AWS API Gateway      | infra   | API Gateway | API Gateway used for API management                       | 99.95% |         |
| Identity-aware proxy | compute | Lambda      | Authenticating entry-point and policy enforcement point   | 99.5%  |         |
| Aggregator           | compute | Lambda      | Micro-service for front-end optimization                  | 99.5%  |         |
| Invoicing            | compute | Lambda      | Micro-service for invoice generation                      | 99.5%  |         |
| Inventory            | compute | Lambda      | Micro-service for inventory management                    | 99.5%  |         |
| Profiles             | compute | Lambda      | Micro-service for customer management                     | 99.5%  |         |
| Payment              | compute | Lambda      | Micro-service front-end to third-party payment service    | 99.5%  |         |
| Simple Queue Service | infra   | Bus         | Bus used by micro-services to communicate with each other | 99.9%  |         |
| Data cache           | data    | DocumentDB  | Cache used by aggregator and front-end for optimization   | 99.9%  |         |
| Database             | data    | DocumentDB  | Database used to store all business data                  | 99.9%  |         |
| Cognito              | infra   | IAM         | Identity management service                               | 99.9%  |         |
| Payment service      | N/A     | Service     | Third-party service used to process credit card payments  | 99.5%  |         |
| Front-end bucket     | data    | S3          | Data store used to host the front-end                     | 99.9%  |         |
| Invoice bucket       | data    | S3          | Data store used to host invoice PDFs                      | 99.9%  |         |
| Route53              | infra   | DNS         | DNS service                                               | 99.99% | x       |
| Certificate Manager  | infra   | PKI         | Certificate management service                            | 99.9%  | x       |

## Validate critical paths

Our next step in the analysis is to determine which of the remaining components are on the critical path of a service that has high availability requirements. In our example, there are four services that we want high availability for: purchasing flowers, invoicing those flowers, updating the inventory, and the payment processing service for flowers purchases.

<dl>
<dt>AWS API Gateway</dt><dd><p>The API gateway is used, from a user's perspective, to request a purchase, and to authorize a payment. In both cases, the user uses the front-end, which calls the API to request the purchase and to authorize the payment. The user is not directly involved in inventory management (which will restrict the flowers available for purchase and update the inventory when a purchase is requested, the latter being a side-effect of the request) or invoicing (which is a side-effect of the payment request, but does not have direct user interaction through the API).</p>

<p>In any case, the API Gateway is on a critical path and therefore has to remain in-scope for the analysis.</p></dd>
<dt>Identity-aware proxy</dt><dd>The identity-aware proxy gives the user access to everything behind the APIs, and is therefore on the same critical paths as the API gateway itself.</dd>
<dt>Aggregator</dt><dd>The aggregator is only used as an optimization to prepare the presentation shown by the front-end application. It never interacts directly with the user nor is it used by any of our four services. It can be excluded from further analysis.</dd>
<dt>Invoicing</dt><dd>The invoicing service receives a purchase request and an authorization, both of which will contain enough information to generate an invoice PDF and a message sent back to SQS. This is essentially what our customers want from the invoicing service, which places this micro-service on the critical path for that service.</dd>
<dt>Inventory</dt><dd>&nbsp;</dd>
<dt>Profiles</dt><dd>&nbsp;</dd>
<dt>Payment</dt><dd>&nbsp;</dd>
<dt>Simple Queue Service</dt><dd>&nbsp;</dd>
<dt>Data cache</dt><dd>&nbsp;</dd>
<dt>Database</dt><dd>&nbsp;</dd>
<dt>Cognito</dt><dd>&nbsp;</dd>
<dt>Payment service</dt><dd>&nbsp;</dd>
<dt>Front-end bucket</dt><dd>&nbsp;</dd>
<dt>Invoice bucket</dt><dd>&nbsp;</dd>
</dl>

Note that we didn't put retrieving the results of the aggregator service through the API (including the list of available invoices and the list of available flowers) on the critical path. This is debatable, 

| Component | On critical path for purchase | On critical path for invoicing | On critical path for inventory | On critical path for payment | Critical |
| ---                  | :-: | :-: | :-: | :-: | :-:   |
| AWS API Gateway      | x   |     |     | x   | TRUE  |
| Identity-aware proxy | x   |     |     | x   | TRUE  |
| Aggregator           |     |     |     |     | FALSE |
| Invoicing            |     | x   |     |     | TRUE  |
| Inventory            |     |     | x   |     | TRUE  |
| Profiles             | x   | x   |     | x   | TRUE  |
| Payment              |     |     |     | x   | TRUE  |
| Simple Queue Service | x   | x   | x   | x   | TRUE  |
| Data cache           | x   |     |     |     | TRUE  |
| Database             | x   | x   | x   | x   | TRUE  |
| Cognito              | x   |     |     | x   | TRUE  |
| Payment service      |     |     |     | x   | TRUE  |
| Front-end bucket     |     |     |     |     | FALSE |
| Invoice bucket       |     | x   |     |     | TRUE  | 


## Determine the failure mode

The next step in the analysis is to determine the failure mode of each identified component. For SaaS, PaaS, and IaaS components, this requires some analysis of the component’s documentation which will tell you, for example, that storage failure may result in storage becoming temporarily read-only, or becoming significantly slower than normal. I will not go into the details of each service the Crassula application uses, because that is not the focus of this post. What I will point out, though, is that those documented failure modes should inform your code’s design.

For example, storage temporarily becoming read-only may result in write operations to that storage failing. When that happens, depending on which part of the application you’re in and the code for that particular micro-service, that could result in any one of three things: either the operation fails, failure is reported into some logging mechanism, and human intervention is needed to retry the operation; the operation fails but is kept alive and retried until it succeeds; or the operation is canceled, the message the micro-service was acting on is either never consumed or put back on the queue, and it will eventually be tried again.

Depending on the application and the use-case, any one, or all three, of these options may be acceptable, or human intervention may never be acceptable. It really depends on what the business impact of failure is -- which will be our next question.

The same goes for failures of the API Gateway, any of the Lambda functions, the Simple Queue Service, the DocumentDB, Cognito, and the third-party payment service: their documentation will tell you how they can fail, and how to detect such failures. Your architecture and your code will tell you how failures are handled, and whether there’s a trace of failure in your logs (which allows you to monitor the health of the system), whether a human needs to be made aware of the failure, etc.

## Determine what the user-visible effect or business impact of failure is

If at all possible, when a user has submitted their request to buy a beautiful flower and the website has accepted that request, the user should be confident that the beautiful flower they chose to buy will be delivered to them (or their sweetheart) in due time. They will be charged for that service, but their job is done at that point.

Of course, we know that once every 2000-or-so orders, something may go wrong: the invoice may not have been generated even though the order went through, was paid for, and the flowers were delivered, there may have been a behind-the-scenes intervention by a human to get the payment settled, etc. This may not really be a problem: perhaps most of our customers never look at their invoices anyway. It may also be a huge problem if that error happens when a wedding planner can’t get their invoice for the thousands of flowers they bought for the royal wedding, and because of that can’t get paid for their own services or fail an audit.

This part of the analysis, then, is to determine two things: for each of the failure modes identified, how would a user, a paying customer, the person we don’t want to piss off, be impacted; and what is the business impact on our company? Essentially, this tells us the cost of failure.

Again, I won’t go through the entire application step-by-step for this post, but you are probably familiar with the “as a ... I want to ... because ...” formulation of use-cases. This analysis requires a bit more than that: it requires you to step through the workflows for each of those use-cases, determine whether the failure modes you’ve identified affect those use-cases or that workflow, and decide how bad that would be for your user, and for the company.

## Detecting failure

Any error or failure that is not handled in the application in such a way that there is no impact to the end-user (e.g. by successful retries) should be logged with sufficient information for the effects to be mitigated or, if there is an underlying bug, for that bug to be found and fixed. Those logs should contain enough information for customer complaints to be traced back to original failure, and should be machine-readable as well as human-readable.

This is both harder and easier than it seems: it is not that hard to catch every error and log it, it is also not that hard to assign a correlation ID, or a tracking ID, to every request and include it in every log pertaining to that request. Technically, this is all feasible and fairly straight-forward. Where it becomes more complicated is when you're not in control of all of the software you're using in your application -- and you almost never are. Software tends to hide failures, and hide pertinent information about failures. Some errors are ignored by default, especially if they don't result in exceptions, and many errors are explicitly ignored by a "catch all" construct that will simply pretend nothing happened.

Failure detection is also hard to test, because most failures are unexpected. If you haven't done the failure mode analysis up-front and are doing it after the fact, you are likle to have missed failure modes in your unit tests, code reviews, etc.

Many IaaS, PaaS, and SaaS services generate their own logs as you use them, so outside of your application code there may be a treasure trove of logs with detectable errors that you can tie back to your own failure logs with those same, system-generated, correlation IDs. There are also log analysis tools like CloudWatch, as well as third-party tools, that can be part of a monitoring solution.

Aside from logging, there are other tools you can employ to make sure your application is still running. You could, for example, set up availability probes to make sure your micro-services are still all healthy by having them all report the version of the running software and the health of the underlying resources. You could also implement regular "synthetic transactions": real transactions that just won't end up with a flower being delivered because the delivery address is the shop's own address and your employees know what to do with those particular orders. Depending on how "deep" you go with synthetic transactions, how much work is actually done for each of them, there may be a cost that may make it prohibitive for automation. For example, if your synthetic transaction really charges $100 to your company credit card and you therefore still have the third-party payment service's service charge to pay, you may only want to do it if you have a doubt about some part of the system working correctly.

Regardless of how failures are detected (application logs, resource logs, synthetic transactions, availability probes, etc.), there are two things you will want to monitor: you'll want to be sure that you are notified if (and only if) human intervention is needed, and you'll want to be able to see, at a glance, whether your system looks healthy. If you see a trend of certain types of failures that may lead to your online shop going down, you'll want to know about it before any significant events (Valentine's day, Christmas, etc.) occur.

## Mitigation, remediation, restoration

Once you've figured out how things can fail and how you know they failed, you need to decide what to do when you know they failed. There are three categories of things you can do: you can limit the fall-out, accepting that things can and will fail and actively limiting the impact of such failures; you can try to make sure it never happens again, completely eliminating the threat of that particular failure mode; or you can accept that the failures will happen with the impact they have, and fix whatever impact that is when it happens. These three categories are *mitigation*, *remediation*, and *restoration*.

When you're looking for mitigation strategies, the low-hanging fruit is usually bunched up inside the application: error handling, retries, 

1. within the design
2. outside of the system



### S3
### AWS API Gateway
### Lambda functions
#### Identity-aware proxy
#### Aggregator
#### Invoicing
#### Inventory
#### Profiles
#### Payment front-end
### Simple Queue Service
### DocumentDB
### Cognito
### Third-party payment service


<hr/>