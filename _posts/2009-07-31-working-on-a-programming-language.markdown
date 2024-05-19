A few years ago, I started on the design and development of a new programming language, called Jail. The goal was to create an easy-to-learn, Object-Oriented programming language that could run on a VM as well as natively, on embedded devices, had support for threads, networking, etc.

The language run-time was to be implemented in C, which gave rise to _libmemory_, a free SMR implementation and _libcontain_, a library of lock-free abstract data types implemented in C. The language was discussed on a now-idle mailing list called jail-ust-lang and a few attempts at a parser were written in Yacc/Bison. The GCC front-end was never finished, however, and development on the language was eventually abandoned.

The goal of designing and implementing an easy-to-learn programming language was _not_ abandoned, however: while I was still musing about Jail, I took some time, one evening, to write Funky, an embeddable functional programming language that is now being used world-wide, though (for the moment) in a small niche market.

I only decided to stop working on Jail when it became apparent that I had already reached my original goal: I'd been able to teach Funky to non-programmers in less than 15 minutes, which IMHO qualifies it as "easy to learn". I had the beginnings of the language I was looking for.

Working on a programming language can be fascinating work: while keeping it simple and safeguarding backward compatibility, you have to find ways to extend the language so it will meet the needs of its users.

One recent extention to Funky, created for version 1.3.00, was the possibility to pass a function to a function and to call that function in a later statement. this required a change to the grammar and to the evaluator, while making sure existing scripts continue to work properly. This is accomplished by very careful programming and lots (and lots, and lots) of testing.

I said Funky is very easy to learn, but let's try that out: a statement is an opening bracket, the name of the function to call, followed by a comma-separated list of arguments, in which those arguments can be a statement, a literal, an argument reference or (since version 1.3.00) an inline function definition. That means a simple script looks like this:

    (add, 1, 2)

for which the interpreter will return 3.

A function definition looks like this:

    (!sub-2, (add, @0, (neg, @1)))

which defines a function **(!** called **sub**, which takes two arguments **-2**, and calls **add** with the first argument **@0**, and a negation of the second argument **(neg, @1)**. Since version 1.3.00, you can also pass an anonymous function to a function:

    (!foo, (@0, @1, @2))(foo, ((add, @0, @1)), 1, 2)

Here, **foo** calls its first argument as a function, passing its second and third arguments to it. The first argument is a statement with an extra pair of brackets: **((add, @0, @1))**, which defines our anonymous function.

You can also have the interpreter optimize recursions if you know how many there will be (as of version 1.3.00, again). This looks a lot like the anonymous functions:

    ((add, @0, @1), 3, 1, 2)

This code will call **add** recursively three times, and is therefore equivalent to:

    (add, (add, (add, 1, 2), 2), 2)

because add only returns one value. Some functions may return more than one value, however, so the ruls is that returned values overwrite the arguments passed to the auto-recursing statement. Hence, a function that looks like this:

    ((div, @0, @1), 2, 5, 4)

is equivalent to

    (div, (div, 5, 4))

because div (at least in its integer incantation) returns the divider and the remainder. Note that (div, 5, 4) will return (1, 1); (div, 1, 1) will return (1, 0), and (div, 1, 0) would be undefined, so ((div, @0, @1), 3, 5, 4) is not valid!

As of version 1.4.00, Funky also supports more explicit loops, like this:

    (while, (pred), (body), (control))

in which case the interpreter will execute **body** until **pred** returns _false_ (tested with the test built-in). **control** is a bit special in that it edits the arguments passed to the function with while, rather than the return value of the function. This means that the following code will call **ping** ten times:

    (!sub, (add, @0, (neg, @1)))(!goForIt, (while, @0, (ping), (sub, @0, 1)))(goForIt, 10)

Now, if you'll follow the podcast on the Funky website you'll write a stand-alone interpreter for Funky pretty quickly (assuming you know a wee bit of C++ _or_ just copy what I do in the podcast) and you can try this out for yourself - and tell me how you've fared.