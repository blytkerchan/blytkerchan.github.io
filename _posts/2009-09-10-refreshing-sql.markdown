---
author: rlc
comments: true
date: 2009-09-10 13:01:57+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/09/refreshing-sql/
slug: refreshing-sql
title: Refreshing SQL
wordpress_id: 189
categories:
- Software
tags:
- Posts that need to be re-tagged (WIP)
---

I first started working with SQL several years ago: MySQL was still in the 3.x versions, so I didnt use any stored procs, transactions, etc. Most of the business logic around the data was written in Perl. Though it was a fun time in many respects, I dont miss the limitations of MySQL one bit.

Since then, a lot has changed in SQL: stored procedures have evolved a lot, including, as of MySQL 5.4.14, an error signalling system (the `SIGNAL` statement) that is much like an exception mechanism. This brings MySQL (finally) to the level where it can be used for serious business logic, moving that logic into the database, where (if it applies to the data) it belongs.

A well-designed database can contain a lot of data of which the structure should be hidden most of the time: `INSERT` statements should be rare in client code, as should `SELECT` and `UPDATE` statements as they require intimite knowledge of the underlying schema, which you just shouldnt have at that level of code. However, without a viable way of signalling errors, its simply impossible to avoid putting the business logic surrounding the data in the client application, where errors can be more easily handled. Most PHP MVC frameworks, including my favorite, symfony, abstract the data away through model classes which, in turn, take care of doing the  `INSERT`ing and the `SELECT`ing. That still puts the data-related business logic in the client application code, though, coupling the database schema to the code.

Anyone who knows me and the way I design software knows how much I abhor coupling, and that if I know of a viable way to avoid it, I will avoid it. Some have told me that I sometimes go too far in writing loosely-coupled code, but I have too many bad experiences maintaining spaghetti code to allow myself to write anything that might become spaghetti one day. Things like this field used to be an INT(10) but, un such-and-such version of the schema was an INT(11) and now its a VARCHAR(45) because so-and-so changed it should have no effect on client code.

None?

None.

And using well-designed stored procs allows just such decoupling!

Talk about refreshing!
