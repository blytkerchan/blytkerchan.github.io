---
author: rlc
comments: true
date: 2009-11-16 16:09:13+00:00
layout: post
permalink: /blog/2009/11/x-data-structures/
slug: x-data-structures
title: 3- Data Structures
wordpress_id: 340
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
---

Before we delve into the realm of object-oriented programming (which we will get into in the next post), there is a notion that is so basic, and so important to any type of programming, that we have to treat it in order to make the whole notion of object-oriented-programming comprehensible.
<!--more-->
Programming is all about treating data (sometimes from the implementation's environment, sometimes from somewhere else). That data usually represents something - which is where the notion of object-oriented programming comes from. In order to be able to treat that data, it has to be structured in some way.

In various programming languages there are various different ways to structure data. In the family of programming languages C++ comes from, we structure data into, well, structures. In C, one of the direct ancestors of C++, there is a special keyword to designate structures of data - it is `struct`. Though C++ adds quite a few features to the `struct` w.r.t. C, the basic notion of the structure is still the same.

A `struct` is intended to group bits of data that belong together, together. Sometimes the order of the data in the `struct` is important - usually more so to the human being that is working with the `struct` than to the machine, but that is beside the point. The really important part, however, is the notion that the data that is grouped together into the same structure really belongs together. What that really means is that the structure itself represents something.

In real life, we really do this all the time: we don't consider a table just four legs and a few boards of wood: we consider it a table because those boards and those legs were nailed together into a structure that has a physically useful reality. Similarly, we tend to put forks with forks and knives with knives when we put them in the top drawer in the kitchen - and things that don't "belong" in that drawer usually end up jumbled in the drawer right under it. In that sense, the drawer is a _container_ or an _abstract data type_ (ADT). When programming, we tend to do the same kind of structuring, to make the "virtual" reality that we are creating comprehensible for ourselves.

The `struct` keyword allows us to do this by giving that group a name and, thus, creating a _type_. Let's take a look at a table, for instance: 
    
    struct Leg
    {
        unsigned int height_;
    };
    
    struct Table
    {
        unsigned int width_;
        unsigned int length_;
        Leg legs_[4];
    };

In this case, there isn't all that much we can say about a leg, besides its height, but we do know that the table has four of them, and it has a width and a length. The point of this little piece of code isn't really to show you how to build a table, nor to show you that, if an integral value cannot be negative, it should be `unsigned` - I won't go into what that keyword means aside from saying that an unsigned integer cannot be negative. The point is that a structure can contain primitive types (such as `unsigned int` as well other structures. I.e., `struct`s can contain practically anything but as long as you stick to primitives and `struct`s of primitives, we will continue to talk of them as "**Plain Old Data**" or PODs.

A structure isn't much use if you can't make a variable with that structure as a type. We'll do that right now: 
    
    Table table;

Done.

Note that I didn't give values to anything in the table. This means that those values are _undefined_: C++ will not initialize anything for you of you don't tell it to do so. When we get to classes and object-oriented programming, I'll show you the right way to do this on a non-POD object. Right now, I'll just show you how to access the members of a structure so you can play with them: 
    
    Table table;
    table.width_ = 200;
    table.length_ = 100;
    table.legs_[0].height_ = 10;
    table.legs_[1].height_ = 10;
    table.legs_[2].height_ = 10;
    table.legs_[3].height_ = 10;



Finally, let's take a look at how to check the table to see whether it's level:
    
    bool isLevel(const Table & table)
    {
        unsigned int height(table.legs_[0].height_);
        for (unsigned int leg(1); leg < 4; ++leg)
        {
            if (table.legs_[leg].height_ != height)
                return false;
            else
            { /* this leg is the same height as the first one */ }
        }
        return true;
    }





## Conclusion


We've now seen what a structure looks like, and we've made a table. Now, you should be able to make a chair, create a few chairs and make a living room set out of that. Check that your table is level and that your chairs are comfortable - you can decide under what conditions your chair would be comfortable, but being level might be a good start for that.

If you do this little exercise, you should find that you can write a function `isLevel(const Chair & chair)` and that it won't conflict with our existing `isLevel(const Table & table)` - when yo do, you will have discovered _function overloading_.
