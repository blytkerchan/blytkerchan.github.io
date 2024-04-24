---
author: rlc
comments: true
date: 2011-05-05 02:44:44+00:00
layout: post
permalink: /blog/2011/05/why-i-recommend-brainf-and-what-i-recommend-it-for/
slug: why-i-recommend-brainf-and-what-i-recommend-it-for
title: Why I Recommend BrainF--- (and what I recommend it for)
wordpress_id: 1368
categories:
- Interesting stuff
- Opinions
- Software Engineering
tags:
- brainf---
---

BrainFuck is an esoteric Turing-complete programming language that consists of only the bare minimum commands for Turing-completeness. It is exactly this bare-minimum-ness that makes it an interesting language - although at first a bit awkward to wrap your head around.

    
    >>++++[<+++++>-]<+++[<+++++>-]<-.------.---------.>>++++++++[<++++
    ++++>-]<.[-]++++[<+++++>-]<-.----------.---.+++++.----------.+.+++
    ++++++++++.>>+++++++[<+++++++>-]<---.[-]+++[<----->-]<.--.


<!--more-->
BrainFuck is commonly called BrainF*** or something similar, to hide the explicative in the language's name. Understanding the BrainFuck language means understanding the Turing machine, and vice-versa.

A Turing machine, in fact, is a model of a universal computer that consists of an infinite ribbon which can be navigated in steps and of which only the "current" value can be read from and written to. BrainFuck makes the ribbon 32K, but otherwise does the same thing: `>` goes to the next cell, `<` to the previous one, `+` increments the current value, `-` decrements it, and `[...]` is a loop construct. Dots and commas are used for I/O.

The example above outputs my E-mail address. Let's decipher it: 
    
    >>              Set the ribbon position to 2
    ++++            set the cell to 4
    [               while the current cell is not 0
            <       shift to the previous cell
            +++++   increment it by 5
            >       shift back to the next cell
            -       and decrement
    ]               four times five equals twenty so the previous cell
                    now contains twenty
    <               shift back to the previous cell
    +++             and increment by three going up to 23
    [               while it is not 0  so 23 times
            <       increment the previous cell by 5 and decrement the
                            current by one
            +++++           this is the same as above of course
            >
            -
    ]               so now the previous cell contains 115
    <               go back to it
    -.              decrement it to 114 and print
                    ASCII character 114 is 'r'
    ------.         decrement 6 times to get to 'l' and print
    ---------.      print 'c'
    >>              now we set '@' in the next cell with the same trick
                    so we set cell 2 to 8 and use it to loop 8 times
                    incrementing cell 1 8 times each time
    ++++++++
    [<++++++++>-]<. this is '@' so print it
    [-]             and set it back to 0
    ++++            prepare to run the previous cell up to 'v'
    [<+++++>-]<-    etc.
    ----------.---.+++++.----------.+.+++++++++++++.>
    >+++++++[<+++++++>-]<---.[-]+++[<----->-]<.--.



Now, _in theory_ it is possible to implement _any_ algorithm in BrainFuck -- it is not just a neat way to encode E-mail addresses. That is why I recommend it. I wouldn't expect anybody to actually come up with a potable implementation of, say [QuickSort in BrainFuck](http://codegolf.stackexchange.com/questions/2445/implement-quicksort-in-brainfuck) -- although it would be immensely interesting to see one -- but I would expect anyone who spends a few hours mucking around with BrainFuck to get a much better idea of what a Turing Machine is.

Personally, I have found mucking around with BrainFuck immensely edifying: searching for ways to do simple things like count the number of characters in an input string (which isn't as trivial as you might think it is, though it is certainly not hard either -- depends on how far you want to be able to count) ultimately gives you a better understanding of how a computer really works.

So newbie programmers and veterans alike: I heartily recommend risking a bit of your sanity on BrainFuck -- and let me know what you find.
