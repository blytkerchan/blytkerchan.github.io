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
3. for each component and communications link, determine what failure looks like:
   1. determine how likely it is to fail, and exclude anything that is too unlikely to be worth our time
   2. determine what the failure mode is
   3. determine what the user-visible effect or business impact of failure is
   4. determine how that failure can be detected
   5. determine how the failure can be mitigated
      1. within the design
      2. outside of the system
   6. determine how the failure can be remediated

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

| Component | Group | Type | Description | SLE | Exclude |
| --- | :-: | --- | --- | --: | :-: |
| CloudFront | infra | CDN | CDN used by the application front-end, and for SAS URIs | 99.9% | x |
| AWS API Gateway | infra | API Gateway | API Gateway used for API management | 99.95% | |
| Identity-aware proxy | compute | Lambda | Authenticating entry-point and policy enforcement point | 99.5% | |
| Aggregator | compute | Lambda | Micro-service for front-end optimization | 99.5% | |
| Invoicing | compute | Lambda | Micro-service for invoice generation | 99.5% | |
| Inventory | compute | Lambda | Micro-service for inventory management | 99.5% | |
| Profiles | compute | Lambda | Micro-service for customer management | 99.5% | |
| Payment | compute | Lambda | Micro-service front-end to third-party payment service | 99.5% | |
| Simple Queue Service | infra | Bus | Bus used by micro-services to communicate with each other | 99.9% | |
| Data cache | data | DocumentDB | Cache used by aggregator and front-end for optimization | 99.9% | |
| Database | data | DocumentDB | Database used to store all business data | 99.9% | |
| Cognito | infra | IAM | Identity management service | 99.9% | |
| Payment service | N/A | Service | Third-party service used to process credit card payments | 99.5% | |
| Front-end bucket | data | S3 | Data store used to host the front-end | 99.9% | |
| Invoice bucket | data | S3 | Data store used to host invoice PDFs | 99.9% | |
| Route53 | infra | DNS | DNS service | 99.99% | x |
| Certificate Manager | infra | PKI | Certificate management service | 99.9% | x |

Our next step in the analysis is to determine the failure mode for the services that remain in-scope for the analysis.

## Determine the failure mode



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

## Determine what the user-visible effect or business impact of failure is

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

## Detecting failure

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

## Mitigating failure

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

## Remediating failure

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