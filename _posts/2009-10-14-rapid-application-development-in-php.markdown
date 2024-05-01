---
author: rlc
categories:
- Software Development
comments: true
date: 2009-10-14 16:40:54+00:00
layout: post
title: Rapid application development in PHP
wordpress_id: 264
---

For the last few days, I've been out of my usual C++ cocoon and working, in stead, on a web app to help me better organize my projects and - more especially - help me better track them.

<!--more-->

The way I work is very close to an agile practice called "Scrum" (you might have heard of it: it's probably the most popular agile methodology Out There) with the addition of Kanbans. There are just a few things in my development cycle that aren't as well-suited to scrum as I would like them to be - most notably the release cycle.

For the release cycle of any given product, whether it be Funky, Arachnida, Yara, or any of the other products I work on, there are a few steps that are always the same and that aren't necessarily linked specifically to user stories, use-cases, etc.

So, now i'm working in PHP to build me a web app, called Ginger, to handle this development cycle.

I'm usually not really into GUIs: the only GUI development I do regularly is in Qt. Though I certainly have some PHP under my belt already (not nearly the 20000+ hours of C++ I have behind me, but still...) I spent most of that time on the behind-the-scenes stuff. Now, I have mainly interface stuff to do - and I'm having fun!

Once I set up my use-cases and my database schema, the rest is really a question of setting up the views for my different use-cases. So basically it's a code-load into browser-code cycle. At fifteen to thirty minutes per feature, this is going really fast - and I still have time to do other things (like preparing the next release for Funky, which doesn't involve much C++ at the stage it's in right now either).

I'm using [Symfony](http://symfony-project.org) to develop Ginger and, because I like it, I'll be using it for a few other web apps as well (I have another web app in the pipe, waiting for approval before I get started on it). I like the way the model is set up, using object-relational mappings to access the database, allowing for code like this:

    $c = new Criteria;
    $c->add(SprintPeer::ID, $sf_request->getParameter('id'));
    $sprint = SprintPeer::doSelectOne($c);

which is all you need to get a sprint from the database. There's no SQL involved.

Hmm.. I should take a look to see whether that would be possible in C++ :)