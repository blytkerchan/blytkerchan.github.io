---
author: rlc
categories:
- Control Structures
comments: true
date: 2009-11-01 14:40:52+00:00
layout: post
title: 2-Control Structures
wordpress_id: 294
---

In this post, we'll take a look at a few _control structures_ in C++. There are only a few of them, so we'll start by listing them all and giving you some examples of each, but we'll first take a look at what we mean by control structures.

<!--more-->

#### Control Structures

Control structures alter the flow of control, in some way, from the usual, tedious one-statement-after-another flow that you would expect. According the the veracity of a given condition (or, in two cases, without condition) control passes from one point in the code to another.

My definition is a bit large, but that's because there's one keyword that I want to include in it that wouldn't otherwise fit. Most people would leave it out with pleasure - and some would leave it out of the language altogether - but I will do neither. That keyword is `goto`.

The control structures in C++ are: `goto`, the `switch`-`case`, `if`-`else`, `do`-`while`, `while`, `for` and `return`. Let's have a closer look at each of them.

## `goto`

Arguably the least popular of all of the keywords in the C++ programming language, `goto` allows the control flow to jump in the code from one place to another. The place jumped to is designated by a named label. For example, the following program outputs "Goodbye world!":

    #include <iostream>

    using namespace std;

    int main()
    {
    	cout << "Goodbye ";
    	goto after_cruel;
    	cout << "cruel ";
    after_cruel:
    	cout << "world!";

    	return 0;
    }

This is because of the `goto` on line 8, which makes the program jump over line 9 directly to line 10. Of course, there is no statement on line 10 - just label - so execution will continue on line 11.

The use of `goto` is usually not recommendable and many coding standards ban its use altogether. I am not in favor of banning it, though I don't find it very useful most of the time.

## switch-case

The control structure commonly called a "switch-case" consists of at least two, and up to four, keywords from the C++ programming language: `switch`, `case`, `break` and `default`. In the following example, we use all four:

    #include <iostream>

    using namespace std;

    int main()
    {
    	int i(2);

    	cout << "Goodbye ";
    	switch (i)
    	{
    	case 1 :
    		cout << "cruel ";
    	case 2 :
    		cout << "world!";
    		break;
    	case 3 :
    		cout << "happy place";
    		break;
    	default :
    		cout << "phantom of the opera";
    	}
    	cout << endl;

    	return 0;
    }

I'd advise you to copy this example (or download it from our git server) and play around with it a bit. You'll see that if you initialize `i` to 1, the program will output "Goodbye cruel world!" whereas if you initialize `i` to 3 it will say "Goodbye happy place" and if you initialize it to anything other than 1, 2 or 3, it will output "Goodbye phantom of the opera". This behavior is due to the semantics of the `switch` statement: if will take a given integer value and jump to the `case` with the corresponding value, or `default` if there is no corresponding value. If the `default` clause is absent and no value corresponds, the `switch` statement will do nothing.

If, in any given case, there is a `break`, this will direct the control flow out of the `switch` statement. Otherwise, execution will continue until either a `break` is encountered or the end of the `switch` statement is reached (at which point we will also drop out of the `switch` statement). As you can see in the example, therefore, a value of 1 for `i` will execute both the `case` for 1 and for 2, as there is no `break` at the end of the `case` for 1.

If this seems complicated, play around with it a bit - do some experimenting.

The `switch` statement is often used with enumerators, or `enum`s, which are integers that can have a limited set of values, each of which is an integer constant with a name you can give it. I'll give you another trivial example, using an `enum`:

    #include <iostream>

    using namespace std;

    int main()
    {
    	enum MyEnum { first__, second__, third__, fourth__ = third__ };
    	MyEnum value(first__);

    	switch (value)
    	{
    	case first__ :
    	case second__ :
    	case third__ :
    //	case fourth__ :
    		cout << "Hello, world! " << value << endl;
    	}
    }

There are actually two things you should note here, and one that you can't see: the first thing of note, which is the one you can't see (at least not without running the program) is that enumerators are integers that count from 0 upwards, so the code will, in this case, output "Hello world! 0". The second is that two enumerants in the same `enum` can have the same value - as `third__` and `fourth__` do here. The third thing is that the switch case cannot have two cases with the same value: as `third__` and `fourth__` have the same value (I'll let you guess what the value is, you can check whether you're right by playing with the code) I can't put both as cases in the switch statement. Finally, we have our first comment: the two forward slashes at line 15 turn the line into a comment, meaning the compiler will ignore the line.

## if-else

    #include <iostream>

    using namespace std;

    int main()
    {
    	int i(10);

    	if (i < 10)
    	{
    		cout << "Hello world!" << endl;
    	}
    	else
    	{
    		cout << "Goodbye world!" << endl;
    	}
    }

The `if` statement allows you to conditionally execute zero or more statements depending on a given condition - in the case of this example, whether `i` is less than 10. The `else` part of the statement is not mandatory, but I would advise you to always put it in and put in a comment if there's nothing to do - e.g.

    #include <iostream>

    using namespace std;

    int main()
    {
    	bool time_to_launch_a_satellite(true);

    	if (time_to_launch_a_satellite)
    		cout << "liftoff!" << endl;
    	else
    	{ /* not time yet */ }
    }

This makes the code clearer and can actually prevent bugs from occurring, because it forces you to think of the "other" case.

## while

    #include <iostream>

    using namespace std;

    int main()
    {
    	int i(0);
    	while (i < 10)
    	{
    		cout << "Hello world! (" << i << ")" << endl;
    		i++;
    	}
    }

This is one of the control structures that lets you repeat things - potentially indefinitely. As long as the condition given to it is true, it will execute the statement block. In this case, that means the block will be executed ten times.

While statements are very useful for expressiveness and terseness, though arguably redundant because the same behavior can be accomplished with the more versatile `for` statement.

## do-while

    #include <iostream>

    using namespace std;

    int main()
    {
    	int i(0);

    	do
    	{
    		cout << "hello (" << i << ")" << endl;
    	} while (--i > 0);
    }

Do-while is almost the same as while, except that it will run the statement at least once, as the condition is evaluated at the end of the statement (or statement block) rather than at the beginning.

## for

    #include <iostream>

    using namespace std;

    int main()
    {
    	for (unsigned int i(0); i < 10; ++i)
    	{
    		cout << i << endl;
    	}

    	return 0;
    }

For, in C++, has a rather curious syntax: between the parentheses we find three different statements: the first is used to initialize variables that, if they are declared here, have a scope limited to the statement block that is run by the for statement.

The second contains the condition that determines whether the statement is run. If it evaluates to false, the loop is broken. The evaluation is done before the statement block is run, so if it evaluates to false the statement is never run (the loop never runs).

The third is usually used to increment counters, advance iterators, etc.

We'll be using a lot of for loops in the coming posts, so don't worry if it seems a bit daunting at first, but do try to play around with the code a bit.

## return

    #include <iostream>

    using namespace std;

    int main()
    {
    	cout << "this is " << endl;
    	return 0;
    	cout << "never run" << endl;
    }

The return statement exits the current function (which in our case is main) and returns the provided value as the return value of the function. That means that if the function returns an int, you must provide an integer value to return. If it returns a string, you have to provide a string, etc.

## Conclusion

C++ provides a small number of control structures that, together, really allow you to exert a fine-grained control over the execution of your program. Try playing with the code a bit - try combining control structures into a single program!

Next time, we will take a look at resource allocation and RAII