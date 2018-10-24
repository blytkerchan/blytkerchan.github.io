---
author: rlc
comments: true
date: 2010-02-05 03:02:28+00:00
layout: post
permalink: /blog/2010/02/the-answer-to-the-quiz-in-episode-7-of-c-for-the-self-taught/
slug: the-answer-to-the-quiz-in-episode-7-of-c-for-the-self-taught
title: The answer to the quiz in episode 7 of C++ for the self-taught
wordpress_id: 463
categories:
- C &amp; C++
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
---

[donate]

I know you must have been aching for the response to the quiz from three weeks ago. If you haven't thought of your own answer yet, go back to the code and have another look. Try running it through a compiler with all the warnings turned on - it might tell you what the bug is (more or less), but probably not how to solve it.
<!--more-->
The `Yard` class does not have a constructor in the example, meaning its members, most notable `have_fox_` are not initialized or (in the case of `animals_`) that they are default-constructed. You'll have noted that `have_fox_` and `animals_` are treated differently. That's because `have_fox_` is an instance of a fundamental (a.k.a. primitive) type (`bool`, in this case) whereas `animals_` is an instance of a class (a `vector` of pointers to `Animal`s, in this case). When a class, like `Yard`, doesn't have a default constructor, the compiler will generate one for you, which will call the default constructs of any members of your class. However, it won't initialize anything to any "default" value - there is no such thing as a default value in C++.

If you are used to programming in Java or C#, this lack of automatic initialization of a variable in C++ may come as a surprise to you, so it may be useful to see what the Standard as to say about this:


<blockquote>**3.1 Declarations and definitions [basic.def]**

> 
> 

>   1. A declaration (clause 7) introduces names into a translation unit or redeclares names introduced by previous declarations. A declaration specifies the interpretation and attributes of these names.
> 

>   2. A declaration is a definition unless it declares a function without specifying the function’s body (8.4), it contains the extern specifier (7.1.1) or a linkage-specification (7.5) and neither an initializer nor a function-body, it declares a static data member in a class declaration (9.4), it is a class name declaration (9.1), or it is a typedef declaration (7.1.3), a using-declaration (7.3.3), or a using-directive (7.3.4).
> 

>   3. (...)
> 

>   4. [Note: in some circumstances, C + + implementations implicitly define the default constructor (12.1), copy constructor (12.8), assignment operator (12.8), or destructor (12.4) member functions. [Example: given

>     
>     struct C {
>     string s; // string is the standard library class (clause 21)
>     };
>     int main()
>     {
>     C a;
>     C b = a;
>     b = a;
>     }
> 
> 
the implementation will implicitly define functions to make the definition of C equivalent to

>     
>     struct C {
>     string s;
>     C(): s() { }
>     C(const C& x): s(x.s) { }
>     C& operator=(const C& x) { s = x.s; return *this; }
>     ˜C() { }
>     };
> 
> 
—end example] —end note]
> 

>   5. [Note: a class name can also be implicitly declared by an elaborated-type-specifier (3.3.1). ]
> 

>   6. A program is ill-formed if the definition of any object gives the object an incomplete type (3.9).
> 

</blockquote>


Furthermore, section 8.5 of the standard ([dcl.init]) says "A declarator **can** specify an initial value for the identifier being declared" (emphasis mine). If that isn't done and the type of a declared variable is a "plain-old-data" or POD type, the variable is left uninitialized (otherwise, it is default-initialized).

So, how does this result in a bug? An uninitialized variable has an unspecified value. The code in the example expects the value of `have_fox_` to be `false` when the `Yard` is first constructed - but "unspecified" means there is nothing to guarantee that. That means that there's a good chance that `have_fox_` is _not_ false (and therefore true) when the code is first called - which means the object thinks it always has at least one fox, even if there is none.

Note, though, that my habits have beaten me to it: the code actually checks whether `animals_` is empty - which implies there are no foxes either - before checking whether `have_fox_` is true, so the bug is really not there: it's out-smarted by my coding habits. Though that makes the quiz a moot point, at least it gave me an opportunity to tell you all of the above!
