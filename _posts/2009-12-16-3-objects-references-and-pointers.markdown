---
author: rlc
comments: true
date: 2009-12-16 22:45:44+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/12/3-objects-references-and-pointers/
slug: 3-objects-references-and-pointers
title: 5- Objects, References and Pointers
wordpress_id: 326
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
---

[donate]

The difference between references and pointers, what they are w.r.t. pointers and how to handle each has often been the source of confusion, sometimes even for seasoned programmers and often for formally trained, inexperienced programmers. Very often, especially in legacy code, I find one if the ugliest constructs imaginable: a function that returns a reference that is the result of dereferencing a pointer, if which the address is subsequently taken to validate its value. Ugh!
<!-- more -->


## Objects, Pointers and Where Objects Live


In C++, every object (also called an instance of a type) is allocated in one of two possible areas in memory: the stack, which contains objects that are destroyed automatically when they go out of scope, or the heap, which contains objects of which the life-time must be managed explicitely by the application.

Objects on the stack are allocated by declaring them, like this: 
    
    MyType object;

Objects on the heap are allocated explicitly, with the `new` keyword, like this: 
    
    MyType * pointer_to_object(new MyType);

or like this: 
    
    MyType * pointer_to_object = new MyType;

In the first case (the allocation on the stack) we declare an object of type `MyType`, which we call `object`. The object is constructed immediately and will be destroyed when it goes out of scope - i.e. in the following example, the object is destroyed implicitly on line three: 
    
    {
        MyType object;
    }



In the second case, we declare a _pointer_ to `MyType` which we _initialize_ to `new MyType`. In the third case, we do basically the same thing, except that we use an assignment rather than an initialization - although in this case that amounts to the same thing. If we had re-written the third example like this: 
    
    MyType * pointer_to_object;
    pointer_to_object = new MyType;

we would arguably have left `pointer_to_object` uninitialized for a while (especially if we had actually done something between the first and the second line of this example). We can, of course, initialize the pointer without allocating something, like this: 
    
    MyType * pointer_to_object(0);
    pointer_to_object = new MyType;

in which case we initialize it to 0, and the assign it a `new MyType`.

By now, if you're as smart as I think you are, you will have started to understand what a pointer is: it _points to_ an object but it _isn't_ the object itself. It doesn't describe ownership of the object either. I'll illustrate this with the following example: 
    
    MyType object;
    MyType * pointer_to_object(&object;);

Here, we have the object itself, which is allocated on the stack, and we have a pointer to it. You might be tempted to say that "the pointer is allocated on the heap", but that would be a mistake: it, too, is allocated on the stack and is, as such, an object in and of itself. We just don't usually think of it that way. In this case, it points to an object on the stack. Pointers can really point anywhere, to any object. They usually contain the address in memory where the object can be found - but there is usually nothing useful you can do with that address, so you should try not to count on that.



## NULL


You might wonder why I initialized the pointer to 0 earlier. Let's see that example again: 
    
    MyType * pointer_to_object(0);
    pointer_to_object = new MyType;

For pointers, 0 is a special value which we usually call NULL (and by convention, we do write NULL in all-caps). It is the value of a pointer that doesn't point anywhere and you can use it as a boolean false in a condition (`if (pointer) { /* do something */ } else { /* do something else */ }`). This is something you should keep in mind - and that we will get to more often, as we start to use this special value.



## Object Construction and Destruction


Every type, except for the build-in types, has one or more constructors and one destructor. If the user doesn't provide them, the compiler will generate them. These constructors and destructors are special functions that are called by the implementation when an instance of the type in question is created (for the constructors) or destroyed (for the destructor). They are declared differently than any other function in two ways: they carry the name of the type that they construct or destroy, and they don't return anything.

Let's have a look at a simple example: 
    
    class MyType
    {
    public :
        MyType()
        {
            // do something here
        }
    
        ~MyType()
        {
            // this is the destructor
        }
    };

Notice the tilde in front of the name of the destructor. The constructor in this code is called the _default constructor_ because it doesn't take any arguments. It is generated by the compiler if no other constructor is provided. Constructors can take arguments, however, and the compiler also generates a _copy constructor_, which takes another instance of the same type as parameter, if none is provided.

The destructor never takes any arguments. Its responsibility is to destroy anything that belongs to the object. For objects allocated on the stack (see above), they are called automatically when the object goes out of scope.

In the next post, we will go further into constructors and destructors.



## Back To Objects, References and Pointers: References


References can be considered as a special kind of pointer. In their use, the syntax is exactly the same as for objects: 
    
    MyType object;
    MyType * pointer_to_object(&object;);
    MyType & first_reference_to_object(object);
    MyType & second_reference_to_object(*pointer_to_object);
    MyType * second_pointer_to_object(&first;_reference_to_object);
    
    // access a member called "member_"
    object.member_;
    pointer_to_object->member_;
    first_reference_to_object.member_;
    second_reference_to_object.member_;
    
    // call a method called doSomething();
    object.doSomething();
    pointer_to_object-> doSomething();
    first_reference_to_object. doSomething();
    second_reference_to_object. doSomething();



There are a few things you should know about references, though:



	
  1. there is no special value for references that don't refer to anything and there is no run-time check for this, so you should make sure, yourself, that your references refer to real objects

	
  2. I repeat: you should make sure your references point to real objects

	
  3. references, like pointers, do not describe ownership



So, references are really a special type of pointer (and under the hood, they usually are pointers) that allow you to pass objects around without copying them. For example, take a look at this function: 
    
    void foo(const MyType & object)
    {
        // do something
    }

w.r.t. this function: 
    
    void bar(MyType object)
    {
        // do something
    }

The major difference between the two is that bar copies the object, which is passed to it as a parameter, whereas foo does not. If at all possible, follow foo's example, not bar's.



## Conclusion


Don't worry if your head is buzzing by now: we will see all of this again. The import thing to remember for now is that references pretend they're objects while pointers don't - so you use them a bit differently; there is a special value for pointers that don't point anywhere; and neither references nor pointers don't own anything.
