---
author: rlc
comments: true
date: 2009-10-14 19:17:37+00:00
layout: post
title: 1- "Hello, world!"
wordpress_id: 273
categories:
  - C++ for the self-taught
tags:
  - Posts that need to be re-tagged (WIP)
---

This is the first post in the "C++ for the self-taught" series - the second if you count the introduction. We will take a look at how to create your first C++ application.

<!--more-->

In order to create an application in C++, you need a _compiler_: unlike some _interpreted languages_ such as Perl, Python and PHP, C++ is first compiled into machine code, and then executed. For brevity, we won't go into that process, which actually involves several more steps than compiling, now, but we'll dive directly into the code and see the machinery at work.

Let's take our first look at a program written in C++:

    #include <iostream>

    using namespace std;

    int main()
    {
            cout << "Hello, world!" << endl;
    }

Right off the bat, we have many of the features of C++ used in eight lines of code: we're using the _preprocessor_, we're using _operator overloading_, we're using _name spaces_ and we've _defined a function_ - and all it does is output "Hello, world!" to the console.

## Building the example

1. copy the code to a file called `main.cpp`

2. make sure you have **GNU Make** and **G++** installed

on Cygwin, the necessary packages are called **make** and **gcc-g++** and you can install them using [Cygwin's Setup](http://cygwin.com/setup-x86.exe);

on Debian, the necessary packages are called **make** and **g++** and you can install them by running `apt-get install make g++`.

3. from the console, in the same directory as your new `main.cpp` file, run `make main`. GNU Make will figure out how to make main.

You now have an executable that says "Hello, world!" when you run it. Now let's take a look at how that works.

## Dissecting Hello

### The preprocessor

Here's the example again:

    #include <iostream>

    using namespace std;

    int main()
    {
            cout << "Hello, world!" << endl;
    }

On the very first line, we use the fact that C++ is a preprocessed language. As we will see later (when we need it) we can use the preprocessor for a wide variety of things, but we can also use to simply include one file's contents in another - which is what we do here. The reason for doing this is that, unlike Java and some other programming languages, C++ does not allow you to use anything that is not present in the same _translation unit_ as the one being compiled. This means that if you need to use a variable, a type, a function or anything else, you need to include its definition by using an _#include directive_.

#### Translation unit

A translation unit consists of one source file and all of the files included, using \_#include directive_s by that file. In our example, the `main.cpp` file includes a file called `iostream`, which will in turn include other files. All those files, concatenated together, form a translation unit.

Some people, and some literature, call these _compilation units_. It is the same thing.

A program, in C++, can consist of many translation units. In the case of our example, there is only one translation unit that we provide to the compiler. However, behind the scenes, we are using functions that are provided to us by the implementation - by the _run-time library_ which, itself, consists of many translation units. These translation units, once compiled, are linked together to form the executable.

It is important to understand that the compiler can only see what's in the translation unit it is compiling. It will not magically start reading another C++ file without you telling it to. That is what \_#include directive_s are for.

#### #include directive

C++ is a pre-processed language. That means that before the compiler tries to translate your code into something the computer will understand, it pre-processes your code looking for _directives_ on what to do with it. One of those directives tells the pre-processor (the program the compiler uses for pre-processing) to start reading another file and pretend that it's part of the same file. That directive is the _#include directive_.

There are two syntaxes for the #include directive:

     #include <system-header>

and

     #include "other-header.h"

The former is used to include files that are installed on the system - such as those that come with the compiler and are part of the language, or those that come with libraries that you can use to extend your program's functionality and not have to write everything yourself. The latter is used to include files that you write yourself.

Files that are meant to be included like this are called _header files_. Files that contain source code that isn't meant to be included like this are called _source files_. Header files usually have the `.h` or `.hpp` extension whereas source files usually have the `.cpp` or `.cc` extension. C source files usually have a `.c` extension.

### Namespaces

On line 3 of our example, we find `using namespace std`. This tells the compiler that, if it can't find a name we're using in our code, it should look for that name in a different namespace - namely the one called `std`.

Namespaces are an important part of the C++ programming language: they help you to structure your programs and make sure that when you use a name, the compiler understands what you mean by that name and doesn't confuse it for something else. Let's say, for example, that you have two types called `A` one of which launches satellite into orbit while the other herds sheep. If you declare an instance of A, like this:

    A a

you need to know whether you've just created a shepherd or a rocket. In order to be able to distinguish the two and still use them in the same file, they have to be declared in different namespaces. We'll get to doing that later. For now, it's just important to know that this exists.

We're using this directive in our example because `cout` and `endl` are both declared in the `std` namespace, as is almost anything else that belongs to the standard library.

### The `main` function

The `main `function is where your program starts. It is a function that returns an integer value that is used by the operating system to know whether it was successful or not. By convention we return `0` if everything was OK, non-zero (usually 1) if it wasn't.

This function is the only function in C++ that, although it returns an integer, is not required to explicitly return it. All other functions must have a `return` statement to indicate the value to be returned. By convention, we will always put the return statement in, but I left it out this time to have a good reason to tell you this :)

Every program written in C++ must have a `main` function. It always returns `int` but it can take arguments as well. Valid declarations of main are:

    int main()
    int main(int argc, char * argv[])

Implementations may allow for other signatures as well, and common signatures are:

    int main(int argc, char **argv)
    int main(int argc, char * argv[], char * env[])

but the standard `**[basic.start.main]**` only says that any implementation must accept the first two.

You may have noted the way I quoted the standard: `**[basic.start.main]**`. I do this like this because a new version of the standard is coming soon (hopefully) and chapter and section numbers may change, but section identifiers usually don't. If you get a PDF version of the standard, you can search it for the tag I use - it will appear in it in exactly the same way.

#### Implementation

When the standard that defines C++ talks about an implementation, it means the same thing as we generally mean by a combination of the pre-processor, the compiler and the rest of the building machinery, the standard library and the services provided by the run-time library and operating system.

### `cout << "Hello, world!" << endl;`

On line 7 of our example, we do the actual work of this program: we output a text. We do this by using an _overloaded_ `operator<<` and an _output stream_.

#### overloading

C++ allow you to define more than one version of almost any function, based on the types of its arguments. It allows this for _member functions_ (functions that are part of a class, also called _methods_) as well as _non-member functions_ (functions that are not part of a class) and _operators_. An operator is a special kind of function that is called by using one of the math symbols (such as less-than `<`, greater-than `>`, plus `+`, minus `-`, etc.) or one of the words reserved for that purpose (such as `new` and `delete`). In this case we used operator `<<`

Overloading is an important feature of C++, as is operator overloading. It allows you to write code that is much more readable than it might be if this were not possible (such as in C).

## Conclusion

So, we now have our very first program in C++ and we've seen that it actually exercises a lot of features from C++ - and we've only touched the tip of the iceberg.

Try having some fun with this: make it say something different, or make it say something more than once. We'll look into loops next.
