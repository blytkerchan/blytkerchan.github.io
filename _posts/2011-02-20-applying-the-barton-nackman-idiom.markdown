---
author: rlc
comments: true
date: 2011-02-20 01:18:43+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2011/02/applying-the-barton-nackman-idiom/
slug: applying-the-barton-nackman-idiom
title: Applying the Barton-Nackman idiom
wordpress_id: 1264
categories:
- C &amp; C++
tags:
- Posts that need to be re-tagged (WIP)
---

It is amazing how much code you can cram into a single line, and how much magic happens behind the scenes when you do.
<!-- more -->
I'm working on a pet project in one of the fields I like most: embeddable domain-specific languages. One of the things I want to be able to do with this particular domain-specific language is output any type of literal for debugging purposes while compiling (or interpreting) the script. In order to do that, I want my code to be expressive such that typing 
    
    C c(...);
    cout << c << endl;

will "just work". To accomplish that, I've written a little class that's called "`Serializable`" that looks like this: 
    
    template < typename T >
    struct Serializable 
    {
        template < typename Y > friend Y& operator<<(Y &out;, const T & t) { t.serialize(out); return out; }
    };

To make a type serializable with this, all you need to dos derive from `Serializable` and implement `serialize`, like so: 
    
    struct Complex : Serializable< Complex >
    {
        double real_;
        double imag_;
    
        template < typename S >
        void serialize(S &s;)
        {
            s << '(' << real_ << ',' << imag_ << ')';
        }
    };



This trick is called the Barton-Nackman idiom, and generates an operator that would look like this: 
    
    template < typename S >
    S& operator<<(S &s;, const Complex &c;)
    {
        c.serialize(s);
        return s;
    }

Note that in this case only `S` is still a template parameter: `T` has become the type `Complex`, which is what we wanted. Also note that the new operator is not a member: it's a stand-alone operator that is an overload of the usual `operator<<`. That's what the `friend` declaration is for: omitting `friend` in this case would have made the operator a member -- and would not have worked as expected.
