---
author: rlc
categories:
- Programming
comments: true
date: 2009-07-24 21:50:37+00:00
excerpt: 'Sadness of winter

  decided this summer, when

  no concept survived

  '
layout: post
tags:
- C++ (1.0)
- Generic programming (0.9)
- Concepts (1.0)
- Standards committee (0.8)
- Bjarne Stroustrup (0.7)
- Template system (0.8)
- Meta-programming (0.9)
- Types (0.8)
- Template meta-programming (0.9)
- Libraries (0.7)
title: No Concepts in C++0x
wordpress_id: 54
---

The _**one feature**_ I had really been looking forward to in C++0x, generic programming concepts, have been scrapped from C++0x by the standards committee. In my opinion, this it was sad day indeed for C++. Bjarne Stroustrup explains why [here](http://www.ddj.com/architect/218600111). In short, it was a cautious attempt to prevent catastrophy by letting concepts into the language without being ready.

I understand the choice, but I am disappointed with it: concepts will take at least another five years to be released into the C++ programming language and, until then, we'll have to rely on the current template system and, if we want to use something similar to concepts, jump through a lot of hoops to try to get there - and force the users of our libraries to do the same in some occasions.

In generic meta-programming based on types (which template meta-programming is most of the time) it would have been _really, really_ nice to be able to say "if something matches this concept, it should use this, more efficient and/or more functional, version rather than the default one". Now, only experts are able to say anything close to that.

I guess I'll go sulk for a while.