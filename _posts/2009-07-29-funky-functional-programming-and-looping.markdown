---
author: rlc
comments: true
date: 2009-07-29 15:57:04+00:00
excerpt: 'functional combines

  programming summers into

  sheerly fun coding'
layout: post
link: http://rlc.vlinder.ca/blog/2009/07/funky-functional-programming-and-looping/
slug: funky-functional-programming-and-looping
title: Funky, functional programming and looping
wordpress_id: 103
categories:
- C &amp; C++
- Software Design
tags:
- functional programming
- programming
---

I'm currently working on a scriptable simulator for a firmware. At first, I was going to script it using Pything: a nice, object-oriented language that can be embedded into C++ using [Boost.Python](http://www.boost.org/doc/libs/release/libs/python/doc/index.html). I soon (well, soon... after a morning of trying) found out that it was not going to be as easy as I though, though, because the version of Boost I have to work (1.33.1) with wasn't going to be of much help so, after coming to the conclusion that if I was going to do this in the time I'd planned for it, I'd have to change my strategy.

In terms of scripting languages that are easily embeddable into C++, there aren't too many to choose from. Python can be a good choice - but turned out not to be in this case - but if that doesn't work and you still need to use a language that embeds easily and doesn't cause too much of a head-ache in the embedding, I for one turn to [Funky](http://funky.vlinder.ca) pretty quickly. that might be, of course, because I am its author but it also happens to have almost all the features I wanted in there - except for looping.

Since version 1.3.00, there is some support for looping in Funky, using the auto-recurse feature. A very trivial example, taken right from the Funky test case source code, looks like this:

    
    ((add, @@), 2, @@)


which is equivalent to

    
    (add, (add, @@), @1)

.
The current version of Funky does not support looping on predicates, however, so the following would not work:

    
    ((add, @@), (pred), @@)


which would be the equivalent of a while loop.

Jon Dahl wrote about functional programming and looping [here](http://web.archive.org/web/20141116141921/http://railspikes.com:80/2008/7/29/functional-loops-in-ruby-each-map-inject-select-and-for) and is quite right in saying that a functional approach to looping is very often superior to a procedural approach. However, even Lisp [supports a while loop](http://web.archive.org/web/20120829084348/http://www.rattlesnake.com/intro/fwd_002dsentence-while-loops.html), [as does Scheme](http://www.gimp.org/tutorials/Basic_Scheme/), so I don't think I'm too far off with what I came up with.

What I did come up with is sufficiently different from the auto-recurse feature to not be confused with it, and actually looks a lot like the lisp and Scheme variants:

    
    (while, (condition), (body))


in which the body is optional, meaning you can loop forever on a predicate. The condition may also be a parameter or a literal, meaning you could, if you really wanted to, loop forever.

But why does Funky need a while loop?

The answer is simple: Funky is an _embeddable_ functional programming language, meaning that the function it calls as a predicate may very well be a function written in C++. If that is the case, it could do _**anything**_. In my case, it will be reading from a socket.

I think I'll add this feature to the next major version of Funky, which will be 1.4.00.
