---
author: rlc
categories:
- Software Development
- Cybersecurity
- Design Patterns
- Implementation Patterns
comments: true
date: 2009-09-29 18:02:22+00:00
layout: post
tags:
- security (1.0)
- design-time concern (0.9)
- application life-cycle (0.8)
- defects (0.7)
- agile practices (0.6)
- Architectural-level patterns (0.9)
- Distrustful Decomposition (0.8)
- PrivSep (Privilege Separation) (0.8)
- Defer to Kernel (0.8)
- Design-level patterns (0.9)
- Secure State Machine (0.8)
- Secure Visitor (0.8)
- Implementation-level patterns (0.9)
- Secure Directory (0.8)
- Pathname Canonicalization (0.8)
- Input Validation (0.8)
- Runtime Acquisition Is Initialization (0.8)
- Proxy pattern (0.7)
- authorization (0.7)
- RAII (0.7)
title: Security at the Design Phase - Examples & Review
wordpress_id: 240
---

A [recent report from the SEI](http://www.sei.cmu.edu/library/abstracts/reports/09tr010.cfm) confirms once more what I have been saying for a few years now: security is a design-time concern as much as it is a concern at any other time during the application life-cycle. The very architecture of the application should take security into account from the outset, and that concern should be followed through down to implementation and deployment.

<!--more-->

The cost of defects, especially security defects, is (or can be) a lot higher once the application is deployed than before deployment - defects are usually especially cheap if caught at early design phases. This is true regardless of whether the application is built using agile practices or not - being agile doesn't mean not thinking ahead. The report acknowledges this and focuses on a few patterns, which are divided into three categories:

<blockquote>Three general classes of patterns are presented in this document:
<ul>
<li>Architectural-level patterns. Architectural-level patterns focus on the high-level allocation of responsibilities between different components of the system and define the interaction be-tween those high-level components. The architectural-level patterns defined in this document are
<ul>
<li>Distrustful Decomposition</li>
<li>PrivSep (Privilege Separation)</li>
<li>Defer to Kernel</li>
</ul>
</li>

<li>Design-level patterns. Design-level patterns describe how to design and implement pieces of a high-level system component, that is, they address problems in the internal design of a single high-level component, not the definition and interaction of high-level components themselves. The design-level patterns defined in this document are
<ul>
<li>Secure State Machine</li>

<li>Secure Visitor</li>
</ul>
</li>

<li>Implementation-level patterns. Implementation-level patterns address low-level security issues. Patterns in this class are usually applicable to the implementation of specific functions or methods in the system. Implementation-level patterns address the same problem set addressed by the CERT Secure Coding Standards and are often linked to a corresponding secure coding guideline. Implementation-level patterns defined in this document are: 
<ul>
<li>Secure Directory</li>
<li>Pathname Canonicalization</li>
<li>Input Validation</li>
<li>Runtime Acquisition Is Initialization</li>
</ul>
</li>
</ul>
This report does not provide a complete secure design pattern catalog. In the creation of this report, some, but by no means all, best practices used in the creation of secure software were analyzed and generalized. Future work will extend the catalog of secure design patterns.</blockquote>

I found the report very interesting - you should read it! I found a bit light on the side of examples, though, so I though I'd include a few here for each pattern.

## Architectural Patterns

### Distrustful Decomposition

The report cites QMail and PostFix as examples, both of which are mail transport agents. MTAs lend themselves particularly well to this pattern: the act of transporting mail to either a local destination or to a remote one can be split into several distinct steps, each of which can be represented by a process that can communicate with one or more other processes. One of these, of course, can expose an SMTP server as an interface while others may be more concerned with delivery or filtering. QMail has an excellent design in this respect and is a very good example.

There is, however, an example that might be even better for those of us that use the Internet on a daily basis: there is a new vogue in web browser design that is an instance of distrustful decomposition. It's called tab isolation and it was first introduced by Google Chrome. Internet Explorer 8 also adopted it - among the major players, only Firefox doesn't have it yet (I don't know about Opera, but I believe Safari has it in their latest versions as well). It is basically the idea that whatever runs in the tab runs in its own process and therefore cannot affect what runs in other tabs. Though all tabs have basically the same task (and they do share some information, such as cookies and the cache) they are separated into processes that mutually distrust each other for exactly the reason cited in the SEI report: security.

### PrivSep (Privilege Separation)

This is the idea on which basically the whole GNU operating system is based. No matter which server application you look at, if it runs on \*NIX it is almost certain to run under its own user account on almost any GNU/Linux distribution. The "hardened" distributions push this idea as far as they can, and the one - and only - reason for this is always security.

### Defer to Kernel

Security, in its most general form, is really about two things: _authentication_ and _authorization_. The focus is usually on the former: one needs to know for certain that ones interlocutor is really who he/she claims to be. There are various mechanisms for authentication, including the almost-universal username and password scheme that we find almost anywhere. The thing this pattern defers to the kernel is not (necessarily) authentication, but rather authorization.

Looking from this angle, any application that uses the file system to determine whether or not a given user has access to a requested resource - once the user is authenticated - defers the authorization request to the kernel (where the filesystem code usually runs) and usually does so by changing its own effective user id before trying to access the requested resource. That means that by far most server application do this.

## Design Patterns

### Secure State Machine

IMHO, this pattern, as described in the report, is over-engineered: basically, they present a state machine that "wraps" another state machine and handles security separately from the "user" state machine. Generalizing this pattern just a little bit brings us to the Proxy pattern, and this brings us to a very-often-used pattern for implementing authorization in secure applications.

### Secure Visitor

I have a somewhat different take on the Visitor Pattern than most, because I think the usual design and implementation is far too intrusive. I have therefore designed a different Visitor Pattern that accomplishes the same task, but is far less intrusive because the object being visited knows nothing about the visitor. I have a working implementation of this revised Visitor pattern and I will expound on it later.

If the goal is to visit a hierarchical structure and authorize the user as he accesses the structure, the one example I would have expected to find would be that of a file system - e.g. any file alteration monitor accesses nodes in the file system if it is authorized to do so. As, in the report, the task of authorizing falls on the node being visited rather than on the visitor, this is exactly what a file system does: before you can enter a directory (folder) in the file system, you have to be authorized to do so by the file system or, very often, something on top of it.

In my opinion, however, when it is possible to put the burden on the visitor rather than on the visited, it should be done. I.e. the data structure being visited should be ignorant of the fact that it is being visited and, unless a proxy is warranted, should not have one. Otherwise, this is just another Proxy Pattern.

## Implementation Patterns

### Secure Directory

Any-one who has had to set up public key authentication for SSH on a Linux server any number of times will have run into SSH's implementation of this pattern: the ~/.ssh directory must have the right permissions to convince OpenSSH that it can safely assume that the authorized_keys file is secure. When warranted, which it certainly is in the case of OpenSSH, this is an excellent security mechanism that should not be neglected.

### Pathname Canonicalization

Especially important at deployment, when you need to know that the files/resources you are trying to access are really where they're supposed to be. Examples of applications that do this include PHP, which is very helpful when deploying applications written in PHP.

### Input Validation

This, **any** application should do: you cannot `assert` on input, as assertions may not be run in some cases (e.g. if `NDEBUG` is defined), so input should always be sanitized, checked, etc.

### Runtime Acquisition Is Initialization

As many who have worked with me will know, this is my all-time favorite implementation pattern. Using RAII (which is more commonly called _Resource_ Acquisition Is Initialization) you can create an application that is guaranteed to be leak-free, exception safe, etc. I.e., I use the rule that _any resource should belong, directly or indirectly, to an object that has either **automatic** or **static** storage duration and that object should be responsible for its deallocation_. This is very easy to check during code reviews and, if followed strictly, means nothing can be leaked - whether it be memory or any other type of resource.

## Conclusion

While on the architectural level and on the implementation level, the report has some interesting notes to make, on the design level, I find it rather lacking: what is presented is basically two instances of the Proxy pattern neither of which really add anything to the Proxy pattern itself. If the intent of the authors is to show that we can use proxies at the design level to implement state machines and visitors, that's nice, but I think we knew that already.

However, on the architectural level, though hardly very new for experienced analysts and programmers, the presentation of the three patterns gives a thorough look at them from an architectural perspective, which is useful. The same thing goes on the implementation level: it is always good to repeat that RAII and input validation should be applied at all times. The Secure Directory and Pathname Canonicalization patterns are a bit less universally applicable, but very important nonetheless.