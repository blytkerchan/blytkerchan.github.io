---
author: rlc
categories:
- Software Development
- Compatibility Management
- API Compatibility
- Binary Compatibility
- Versioning
- Interface Design
- Maintenance Branches
comments: true
date: 2009-09-01 03:26:55+00:00
layout: post
tags:
- library code (1.0)
- binary compatibility (1.0)
- API compatibility (1.0)
- backward compatible (1.0)
- forward compatibility (1.0)
- ABI (Application Binary Interface) (1.0)
- C++ (1.0)
- object layout (1.0)
- C (1.0)
- function prototype (1.0)
- name mangling (1.0)
- shared libraries (1.0)
- dynamic linker (1.0)
- dynamic loader (1.0)
- compile (1.0)
- link (1.0)
- executable application (1.0)
- memory allocator (1.0)
- template functions (1.0)
- template classes (1.0)
- default parameter values (1.0)
- translation units (1.0)
- linker (1.0)
- virtual machine (1.0)
- Incubator (1.0)
- versioning (1.0)
- interface design (1.0)
- built-in equivalents (1.0)
- roll your own (1.0)
- C API (1.0)
- STL (1.0)
- Boost (1.0)
- Maintenance branches (1.0)
title: Binary Compatibility
wordpress_id: 177
---

When writing library code, one of the snares to watch out for is _binary compatibility_. I have already [talked about the dangers](/blog/2009/08/the-danger-of-breaking-changes/) of breaking binary - and API - compatibility but I had neither defined what binary compatibility is, now how to prevent breaking it. In this post, I will do both - and I will explain how, at Vlinder Software, we go about managing incompatible changes.

<!--more-->

## What is "compatibility"?

<blockquote>compatible: <i>Capable of orderly, efficient integration and operation with other elements in a system with no modification or conversion required</i> [<a href="http://www.thefreedictionary.com/compatibility">Free Dictionary</a>]</blockquote>

That about sums it up: a library is "_backward compatible_" is you can drop it in the place of an older version of the same library (or an older, but different library the new one aims to replace) without having to change anything else, and without breaking anything. _Forward compatibility_ - the ability to gracefully accept input destined for later versions of itself, does not apply in this context and is beyond the scope of this post.

We will distinguish two types of (backward) compatibility: **API** compatibility and **Binary** compatibility.

### Binary Compatibility

<blockquote>Library <i><b>N</b></i> is said to be <i>Binary Compatible</i> with library <i><b>O</b></i> if it possible to replace an instance of library <i><b>O</b></i> with an instance of library <i><b>N</b></i> without making any changes to software that uses library <i><b>O</b></i>.</blockquote>

There is one obvious restriction to binary compatibility: it only applies to shared libraries because a library that is statically linked into an executable program cannot be changed after the fact.

### API Compatibility

<blockquote>Library <i><b>N</b></i> is said to be <i>API compatible</i> with library <i><b>O</b></i> if it is possible to recompile the software using library <i><b>O</b></i> and link it against library <i><b>N</b></i> without making any other changes to that software</blockquote>

## How compatibility works

Binary compatibility and API compatibility are two different creatures: binary compatibility is really all about the library's _ABI_ (Application Binary Interface) which is determined not only by its API, but also by the dependencies exposed through that API. For example: if your library is written in C++ and uses `std::string`, and that use of `std::string` is exposed in the API you have _exposed_ the dependency on `std::string` in your API. That means that your library will only be compatible with software that uses the same implementation of `std::string` as you do - or at least uses a compatible one. This may sound easier than it really is: `std::string` allocates memory and therefore uses a memory allocator. If you want to pass a string from one library to another, you need to make sure that you use the same allocator in both - because you can't deallocate memory with an allocator that didn't allocate it. So binary compatibility (in C++) is really about four things:

1. C++ name mangling

2. exposed dependencies on third-part libraries (including the STL, Boost, the RTL, etc.)

3. object layout

4. API compatibility

API compatibility is about the names and signatures of your functions and the contents of your objects. In C, it is pretty easy to know whether two APIs are compatible:

- was any function removed from the API?
- was any function's signature changed in the API?
- was any structure's layout changed in the API that was not a simple addition at the end of the structure?

If the response to any of these questions is "yes", you are no longer API compatible, (Note that the object layout question is stricter than strictly necessary for API compatibility: as long as you don't remove anything from an exposed structure, you can change the layout of an object. We use a stricter definition to help with binary compatibility.)

In C++, the notion of function is a bit murky due to the addition of template functions and template classes. Adding a specialization of a C++ template class to an API may well break your API compatibility, as there is nothing that requires you to implement the same methods in that specialized class as were available in the generic version.

Similarly, adding a parameter to a function to an API may well be a breaking change, but might not: C++ allows the programmer to specify default parameter values so you can add a parameter to the end of your parameter list, supply a default value and retain API compatibility.

So, let's take a closer look at how things _really_ work: C and C++ are compiled languages. A program is divided into translation units that are translated by a compiler and then linked together by a linker. This is somewhat simplified from reality, but it's close enough for our purposes. During the compilation phase, the API comes into play: the compiler has to find a function prototype for each function called by the code, a class or structure for each object created, etc. At some point during this translation, the names of your functions are _mangled_ so what once was your API now becomes your ABI: i.e. the human-readable instructions you wrote, which in your mind used the library you were going to link to, are translated into some intermediate form that your linker will understand. As long as that mangling is done in the same way by the compiler that compiled the library and by the compiler that is now compiling your software, the link will work.

The compiler creates object files which, among other things, tell your linker how to create your executable application - i.e. which libraries to look for (you may have to help it on that), which functions to look for in those libraries (using their mangled names) etc. and creates an executable which will contain the instructions for your computer, but also some instructions for your dynamic linker (or dynamic loader, depending on your OS) so it knows how to load and link your shared libraries (whether they be "dynamic load libraries" or "shared objects").

If you can go through the compile and link steps (so if you got up to here) without changing anything, you are API compatible.

The next step is to run your program. When you do that, your OS will load your program into memory and scan it for any dependencies - any shared libraries you depend on. It will then try to find those libraries and load them into memory, looking for their dependencies, and so on. When they are all loaded, a final linking step is performed in which the functions (mangled and all) your application was looking for are all resolved. Then, your application starts running.

If you got to here, you _might be_ binary compatible.

Might be? Well, remember the remark I made about "exposed dependencies" earlier? If your application goes through all its functional and unit tests, and you've testing everything "_comme il faut_" (as you should), you are binary compatible. If you haven't tested everything, you're on thin ice.

## Avoiding Compatibility Pitfalls

Removing a function or a method from the API is a sure way to break your API compatibility. Changing a type of member might break API compatibility, but will almost certainly break binary compatibility. Changing the order of members in a structure won't break API compatibility, but will break binary compatibility. I could go on. Routine maintenance and innocent-looking changes may break it in very subtle ways. What may seem like simply recompiling your library might, in fact, break binary compatibility: you might be using a slightly different version of the RTL than you did last time, or you might be using different optimization settings, that change the alignment of your exposed structures a bit, breaking binary compatibility.

The point is: binary compatibility is a lot more fragile than API compatibility. You should therefore be very careful about promising binary compatibility.

Sure-fire ways to _not_ break binary compatibility don't exist, but there are some ways to avoid the most common problems:

### Versioning The Development Environment

This is, without a doubt, the most radical solution, but also the most effective one: everything is built in a known environment, to which any changes are versioned and documented. The way this is done is straight-forward: the entire build environment, including the compiler, all the headers, etc. is put in a virtual machine (i.e. VMWare) in which everything is compiled. This virtual machine is called an "Incubator". It takes a known source as input, builds it in a known environment and spits out a known, compiled version.

The way the incubator is set up, it's a hands-off experience: all you need to tell it (through a web interface) is where to get the source (i.e. a Git URL and an SHA-1). It will check out the source and build it. Build scripts are allowed to copy files to a certain location: the staging area. Once the build is done, the staging area is wrapped into a tarball and made available. The incubator itself is also versioned: the entire hard drive image - i.e. the entire virtual machine - is put in a versioning system such that the exact version of the incubator is known by it's SHA-1 checksum. Whenever a new (version of a) package is added the the most-current incubator, this changes the version of the incubator: the incubator is now "dirty" and will refuse to call anything it produces "clean" (dirty incubators make for dirty packages) until it has been "cleaned" - i.e. versioned. Of course, the incubator can't version itself, so it can be told it's clean even if it isn't - that's a question of putting protocols and procedures in place.

Once you have an incubator in place, anything you build now comes from a known environment, so as long as you don't do anything in the code to break compatibility, you'll be able to produce binary-compatible packages - i.e., you'll be able to produce exact replicas of what you built before if you need to.

### Interface design

One of the major pitfalls in the compatibility "debate" (let's call it a debate, shall we?) is the "exposed dependencies" problem: all dependencies you expose in your interface - whether it be the API or the ABI, become part of your ABI and, thus, become part of your compatibility problem. If you version your entire development environment, that is not really a problem because your exposed dependencies will simply not change from one (maintenance) release to another and you can assert that whatever you depended on before has remained unchanged and will therefore have no effect on your compatibility.

Versioning your entire development environment, however, represents a (sometimes huge) investment that you may or may not be willing to make. So, an alternative is to restrict the dependencies you expose in your interfaces. This is done in various ways:

- expose built-in equivalents

i.e. use `char*` in stead of `std::string`, etc.

- roll your own

i.e. implement your own string classes, your own smart pointers, etc. and expose those

- create a C API

i.e. implement your usual C++ API exposing anything that needs to be exposed and wrap it all in a C API in which you wrap:

    * all strings, smart pointers, etc.
    * all allocation and de-allocation
    * all deep copies, etc.
    * basically anything else - wrap it all in opaque structures not visible in C

I have often taken the first or the third route but never the second - though I can't say it's a less "honorable" one. I.e., to come back to my original example, Xerces does a pretty good job at "rolling their own" with its own `XMLString` class, which is used throughout the implementation and the API, its own allocation scheme, with its `MemoryManager` class, and its own I/O classes, in the form of `InputSource` and `BinOutputStream`.

Personally, I tend to rely on the presence of at least two things: the STL, which is shipped in different shapes and forms with most compilers, and [Boost](http://boost.org), which is available for most compilers. If need be, I can provide a C API that doesn't need either, but generally, I presume both are present. Other than those two, I go to great lengths on the first of my three routes, hiding dependencies behind interfaces. E.g., [Arachnida](http://arachnida.sf.net) goes a long way towards hiding OpenSSL by wrapping the whole thing in the Scorpion library. I _definitely_ did not intend to implement my own SSL implementation - and didn't do that at all - but I _did_ intend to hide it sufficiently so the dependency is not exposed beyond the interface of the library.

### Maintenance branches

The way Xerces-C maintains its version numbers is very good if you want to know whether the software you are downloading is _theoretically_ going to be binary-compatible with what you've downloaded earlier. That is: if you're downloading a binary distribution (something I avoid doing if I can) and the publisher took care to make sure the binary distribution was produced in the same, or an equivalent, environment as the previous version, the version number will tell you exactly what is is supposed to tell you: the two versions are binary-compatible.

Again, Xerces-C can do this more effectively because most of its dependencies are hidden behind its interface: for the major classes used by the implementation, the implementation provides its own versions. Hence, even the STL is not exposed through its API.

Maintenance branches, however they are numbered, come with an important caveat, though: you can add, you can fix, but you cannot modify semantics and you cannot remove. If you do either, you break compatibility either by simply crashing the program at some point (or preventing it from executing in the first place) or by changing the way the program works in unintended ways. Putting in place a strict policy of how your maintenance branches are managed, what kind of changes do or don't get included on such branches, etc. will go a very long way toward preventing damage.

## Conclusion

I hope to have shed some light on the caveats of compatibility management. It is potentially a very interesting subject but usually only becomes that when things start exploding - until then, we kinda tend to take compatibility for granted. Hopefully, this is no longer the case as you reach this final paragraph. If it is, please leave a comment so I can correct the post.