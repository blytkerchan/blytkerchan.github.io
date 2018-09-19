---
author: rlc
comments: true
date: 2010-01-01 19:29:11+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/01/3-resource-allocation-and-raii/
slug: 3-resource-allocation-and-raii
title: 6- Resource Allocation and RAII
wordpress_id: 303
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
- RAII
---

[donate]

In standard C++, there is no garbage collector: there is no built-in mechanism that will magically clean up after you if you make a mess. You do, however, have the possibility to allocate resources, such as memory or files, and work with them. You should, therefore, be able to manage them consistently so you don't "leak" them.
<!--more-->
In this post, we will look at how resources are allocated and how they are deallocated. We will also see how to automate the process of deallocating them by using the built-in semantics of the C++ programming language. We will see our very first template, create our very first class and use two new keywords: new and delete. We will also introduce five new concepts: pointers, smart pointers, the constructor, the destructor and RAII, which stands for Resource Acquisition Is Initialization. At the end of this post, you should be able to:



	
  1. create your own class

	
  2. implement a constructor

	
  3. implement a destructor

	
  4. know what a pointer is

	
  5. know what a smart pointer is

	
  6. allocate an object

	
  7. deallocate an object

	
  8. know what RAII is

So let's get started.



## Creating a class



    
    #include <string>
    
    using namespace std;
    
    class MyFirstClass
    {
    public :
    	MyFirstClass(const string & value)
    		: value_(value)
    	{ /* no-op */ }
    private :
    	string value_;
    };
    
    void foo()
    {
    	MyFirstClass instance("hello");
    }
    
    int main()
    {
    	foo();
    }


In this example, we have created our very first class. I won't go into too many of the details right now, but there are a few things you should note: 



  1. This example doesn't output anything.  
If you want to see what this does, now is an excellent time to start using a debugger. Because we're using GCC, I recommend you use GDB. You can use GDB if you compile your program with the -g switch, which makes the compiler create the debug information.  
(This isn't called "C++ for the self-taught" for nothing: you're expected to do some of the work yourself!)


  2. On line 7 of the example, we use the `public` keyword to make the constructor (which is the function that doesn't return anything - not even `void` - and has the same name as the class) visible to what I will call "client code". By default, in a `class` all members are private (whereas in a `struct`, they are public). We'll encounter the different possibilities these keywords give us later. on line 11, we revert back to the default `private` visibility.


  3. The constructor, declared on line 8, has the same name as the class.


  4. The destructor, as well as a few other things, is missing and therefore automatically generated.


  5. In the constructor, there is a small piece of code before the constructor's body. These are the _initializers_ and initialize the class' members. **Note that regardless of the order of the initializers, the class' members are always initialized in the order of their declaration in the class** so it's a good practice to replicate that order in the initializers.


  6. On line 15, we've declared our first function, `foo`. Like the constructor, this function doesn't return anything. Unlike the constructor, however, we have to tell the compiler that this is the case by having it return `void`.


  7. On line 17, we create the instance of our first class, just like we would define any other variable: the **Type** is followed by the name of the variable with the value to be passed to the type's constructor between parentheses.


There are some things I won't touch on right now.

This is not the simplest class you could possibly create, which would be more like this: 
    
    struct S {};



So, to create a class, you need either the `class` or the `struct` keyword (and please don't buy into the bull that there's anything you can do with a class that you can't with a struct: the _only_ difference between the two is that members and parents for a class are private by default, while they're public by default for a struct), curly braces, and a semicolon. Sometimes, when all you need is a type, that is all you really want. A default constructor is generated if no other constructor is provided, as is a destructor, a copy constructor and an assignment operator.

Now let's make a class that has one of each, so we can see what they do:
    
    #include <string>
    
    using namespace std;
    
    class MySecondClass
    {
    public :
    	MySecondClass()
    		: value_(new int(0))
    	{ /* no-op */ }
    
    	MySecondClass(const MySecondClass & instance)
    		: value_(new int(*instance.value_))
    	{ /* no-op */ }
    
    	~MySecondClass()
    	{
    		delete value_;
    	}
    
    	MySecondClass & operator=(const MySecondClass & rhs)
    	{
    		*value_ = *rhs.value_;
    
    		return *this;
    	}
    
    private :
    	int * value_;
    };
    
    void foo()
    {
    	MySecondClass instance;
    	MySecondClass second_instance(instance);
    }
    
    int main()
    {
    	foo();
    }






  1. The default constructor is on line 8. On line 9, it allocates an integer into the `value_` member, which is declared as a pointer to an integer on line 29. Pointers point to objects in memory. The way we allocate the integer here means it will not be automatically destroyed until we use `delete` to deallocate the object - at which time, if the object has a destructor (which `int` does not) that destructor will be called.


  2. On line 12, the copy constructor is declared. You'll note that, like in the previous example, rather than simply saying `MySecondClass(MySecondClass instance)` we take a rather more lengthy approach writing `MySecondClass(const MySecondClass & instance)`. Now is the time to explain why.  

The first way of passing is a parameter is called "pass by value" while the second is called "pass by reference". The former implies that the object being passed as a parameter has to be copied whereas in the second case, it does not. In order to copy an object, the copy constructor of that object is called, so while in our first example we were just optimizing by skipping an unnecessary copy, in this example, we simply don't have a choice: we're implementing the copy constructor.  

What you should remember from this is that, unless you have an excellent reason not to, you should always pass parameters by reference.


  3. On line 13, we initialize the value of our integer member by copying the value in the integer member of the instance we're copying. The way this is done (`*instance.value_`) is called _dereferencing_ the pointer - which is done by putting the star (*) in front of the name of the pointer being dereferenced.


  4. On line 16, the destructor is defined. You can recognize the destructor by the tilde (~) in front of the name of the class. On line 18, we `delete` the integer, returning the associated resources to the system.


  5. On line 21, we have the assignment operator. In this case, we are repeating the copy of the contents of the object by dereferencing both our own member and that of the instance we're copying from on line 23. There are other ways of doing this which are more appropriate for more complex classes, but we'll get into those when we get to more complex classes.





## Smart pointers and RAII


If you've paid attention, you now know that a pointer is something that points to an object. It is, basically, a representation of the address of that object in memory. Pointers aren't very smart: they don't _own_ the object that they point to, nor do they guarantee that the object they point to actually exists. I.e., `delete` does not alter the value of the pointer, but just renders it invalid. There is a special value for pointers, called **NULL**, which corresponds to 0, for pointers that don't point to anything. This special value is used extensively in programs written in C++.

Smart pointers are object that point to other objects but have a bit more smarts than "raw" pointers do. In a context where they exist, we start calling "normal" pointers "raw".

The simplest smart pointer is probably the `auto_ptr`, which is provided by the standard library.

Let's take another example, this time using the `auto_ptr`: 
    
    #include <string>
    
    using namespace std;
    
    class MySecondClass
    {
    public :
    	MySecondClass()
    		: value_(new int(0))
    	{ /* no-op */ }
    
    	MySecondClass(const MySecondClass & instance)
    		: value_(new int(*instance.value_))
    	{ /* no-op */ }
    
    	~MySecondClass()
    	{
    		delete value_;
    	}
    
    	MySecondClass & operator=(const MySecondClass & rhs)
    	{
    		*value_ = *rhs.value_;
    
    		return *this;
    	}
    
    private :
    	int * value_;
    };
    
    void foo()
    {
    	auto_ptr< MySecondClass > instance(new MySecondClass);
    	auto_ptr< MySecondClass > second_instance(instance);
    }
    
    int main()
    {
    	foo();
    }


There is something very different about this version that you may or may not see - look at it for a while.

The object is never copied: its ownership is _moved_ from one `auto_ptr` to another. That's one thing about the `auto_ptr` that makes it perhaps a bit less popular than it might be: for a smart pointer, it's not all that smart :) Ownership is passed from one `auto_ptr` to another when the `auto_ptr` is copied. The first `auto_ptr` is actually reset to `NULL` when its value is passed to the second.

If you think this is confusing, you're not alone :)

One important thing to note, though, is that the `auto_ptr` _does_ own the object it points to, so at the end of `foo`, the instance of our class (which now belongs to the `auto_ptr` called `second`) is destroyed.

This is what RAII is all about: when the object is allocated and initialized, it is handed to an object with _automatic storage duration_ (i.e. an object that is "allocated on the stack") and that object will destroy it when it ceases to exist.

**_In C++, any object should either have automatic storage duration (i.e. be allocated on the stack) or static storage duration (i.e. be a global or defined with the `static` keywords) either directly or indirectly (i.e. by belonging to an object that has either automatic or static storage duration, directly or indirectly)_**.



## Finding leaks


The most common type of bug, by far, in programs written in C++ is the resource leak (usually a memory leak). There are several tools on the market that can help you find such leaks. If you're working on Linux, try valgrind. If you follow the rule above, however, you'll never have that type of bug - ever.
