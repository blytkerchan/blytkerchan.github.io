---
author: rlc
comments: true
date: 2009-07-28 03:59:36+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/07/ah-the-one-definition-rule/
slug: ah-the-one-definition-rule
title: Ah - The One Definition Rule
wordpress_id: 81
categories:
- C &amp; C++
- Software Design
tags:
- C++
---

In response to Scott Meyers' [question on non-inline non-template functions and the one-definition rule](http://groups.google.com/group/comp.std.c++/msg/863b3f502efae0e0), Francis Glassborow replied with a very interesting example of two _lexically_ identical functions that weren't _actually_ identical. <!--more-->
Try to find the difference:

    
    // in file 1:
    #include
    #include
    static int i(0);
    void f() {
        std::cout << i;
    }



    
    // in file 2:
    #include
    #include
    static int i(0);
    void f() {
        std::cout << i;
    }


<!--more-->The difference between the two, of course, is that the two functions do not refer to the same instance of _i_: each translation unit has its own definition and, as such, each version of _f_ refers to its own version of _i_.

When reading this thread on comp.std.c++, this post convinced me that mr Meyers may well have under-estimated the complexity of what he proposed - and that the one definition rule is likely one of the hardest rules to cope with - and one of the rules one is most likely to stumble upon by accident if one doesn't conciously avoid it - in the C++ programming language.
