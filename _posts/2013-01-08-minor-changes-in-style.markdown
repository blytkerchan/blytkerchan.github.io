---
author: rlc
comments: true
date: 2013-01-08 23:20:06+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2013/01/minor-changes-in-style/
slug: minor-changes-in-style
title: Minor changes in style
wordpress_id: 2010
categories:
- C &amp; C++
- Software Development
---

I am not usually one to make much of a fuss about coding style: as long as the code is easily readable, I don't much care whether you use tabs or spaces to indent, how you align your curly quotes, etc. There's really only two things I do care about when reading new code: 

  1. is it easy to read the code without being misled by it?
  2. does the new code integrate well with the rest of the code?
I do have a few suggestions, though, but above all, I recognize it can be difficult to change habits -- and therefore to change one's coding style.

<!--more-->

I've recently made a change to my preferred coding style, that I still haven't quite turned into a habit yet. It concerns the way I declare and call functions, and the future maintainability of code.

Here's how I used to declare a function: 
    
    void foo(Type1 value1, Type2 value2, Type3 value3);

and here's how I declare them now: 
    
    void foo(
    	  Type1 value1
    	, Type2 value2
    	, Type3 value3
    	);


There's no change in verbosity, no change in the number of characters typed (just two more spaces, a few more tabs and a few more carriage returns) but the difference when applying future modifications is important. Let's say I add a fourth parameter to the function. The diff will look like this in the first case: 
    
    - void foo(Type1 value1, Type2 value2, Type3 value3);
    + void foo(Type1 value1, Type2 value2, Type3 value3, Type4 value4);

and like this in the second case: 
    
      void foo(
      	  Type1 value1
      	, Type2 value2
      	, Type3 value3
    + 	, Type4 value4
      	);


Now let's change the type of the second parameter: before:

    
    - void foo(Type1 value1, Type2 value2, Type3 value3, Type4 value4);
    + void foo(Type1 value1, Type2b value2, Type3 value3, Type4 value4);

after:
    
      void foo(
      	  Type1 value1
    - 	, Type2 value2
    + 	, Type2b value2
      	, Type3 value3
      	, Type4 value4
      	);

And now let's do both at the same time: add a fifth parameter and change the type of the third parameter. Before:
    
    - void foo(Type1 value1, Type2b value2, Type3 value3, Type4 value4);
    + void foo(Type1 value1, Type2b value2, Type3b value3, Type4 value4, Type5 value5);

after:
    
      void foo(
      	  Type1 value1
      	, Type2b value2
    - 	, Type3 value3
    + 	, Type3b value3
      	, Type4 value4
    + 	, Type5 value5
      	);



I think the diffs speak for themselves: putting each parameter on its own line, with the colon in front, allows to change only one line to add parameters, change parameters, etc. It becomes easier to spot errors and quicker to understand the changes being made.

Comments are more than welcome :)
