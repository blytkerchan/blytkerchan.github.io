---
author: rlc
comments: true
date: 2014-02-09 17:27:27+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2014/02/optimizing-with-type-lists/
slug: optimizing-with-type-lists
title: Optimizing with type lists
wordpress_id: 2563
categories:
- C &amp; C++
tags:
- meta-programming
- optimization
---

In this post, I will take a brief look at how using type lists can help optimize certain applications.
<!--more-->
Some of the optimizations in Vlinder Sofwtare's more special-purpose parsers are possible because they are written in C++ and can therefore use template meta-programming for parts of their work. We've recently folded part of the code we use for template meta-programming into a separate library we've baptized "meta" and which we will be progressively introducing into our other libraries, picking the meta-parts out of those libraries and moving them into the new library as we go.

One of the adverse effects of this migration/consolidation/refactoring is that some of the configuration headers of some of our libraries will need to be changed client-side, but in return for that we get faster parsers.

One of the basic building blocks of the meta library is the type list. Type lists are just that: lists of types. One thing they're used for is to determine the types of the allocators to be used by the µpool2 allocator allocator -- which is one of the places user-level configuration headers will need to be changed. A level of indirection was removed from the `TypeList` class such that the `TypeList` class now looks like this:

    
    struct Nil {};
    
    template < typename T, typename TL >
    struct TypeList
    {
        typedef T head;
        typedef TL tail;
    };



It comes with a few meta-functions, called `MakeTypeList`, `Length`, `At`, `Splice`, `FoldR`, etc. and it thus allows you to do various things at compile-time that you would normally do at run-time.

For example, one of our allocators can be configured (at compile-time) with a block size and a pool size. One common use is to use various pool sizes for various block sizes, using an optimal allocator for each block size and using only as much memory as you are going to need for the pool. The way this is done is by creating a type list of pairs of constants, in which the first is the block size and the second is the preferred pool size. Such a list might look like this:


    
    typedef MakeTypeList<
          Pair< Constant<    8 >, Constant<   512 > >
        , Pair< Constant<   32 >, Constant< 32768 > >
        , Pair< Constant< 1024 >, Constant< 32768 > >
        /* ... */
        >::type PoolSizesByBlockSize;



One thing you can do with such a list is create a list of appropriate allocator types from it. Taking an allocator class `template < unsigned int block_size__, unsigned int block_count__ > class Allocator;` we'd need to _transform_ the first type list into a second type-list of preferred allocator types. We can do that with our Transform meta-function, which looks like this:

    
    template < typename TL1, template < class > class F >
    struct Transform;
    
    template < template < class > class F >
    struct Transform< Nil, F >
    {
        typedef Nil type;
    };
    template < typename TL1, template < class > class F >
    struct Transform
    {
        typedef TypeList< typename F< typename TL1::head >::type, typename Transform< F, typename TL1::tail >::type > type;
    };



which means we can define a meta-function to create our `Allocator` type instance as follows:

    
    template < typename Sizes >
    struct MakeAllocator
    {
        typedef Allocator< Sizes::first::value, Sizes::second::value / Sizes::first::value > type;
    };


and make our list like this:

    
    typedef Transform< MakeAllocator, PoolSizesByBlockSize >::type AllocatorTypes;



Using type lists like this makes it easier to reason about the types that are going to be used by the program -- especially because we've chosen a few simple rules to be applied throughout the meta library:



	
  1. All meta-functions return a type using a `type` typedef

	
  2. meta-functions that return values return them with a `value` constant but still return a `type` typedef

	
  3. Type lists end with the `Nil` type

	
  4. As much as possible, meta-functions carry the same names they do as functions in Haskell, but in UpperCamelCase


(the fourth of these simple rules is why the `GetSize` meta-function was renamed `Length`

The reason why this makes reasoning about type list meta-programs easier is because they can first be modeled in Haskell if need be -- as I did when I translated the KMP algorithm to Haskell before creating a C++ template for it.

Ending a type list in `Nil` makes it possible to break out of the `Transform` meta-function with a simple specialization. In Haskell, the `Transform` meta-function would look like this: 
    
    transform :: (a -> b) -> [a] -> [b]
    transform _ [] = []
    transform f x:xs = f x : transform f xs


The underscore wild-card being modeled in C++ as the remaining specializable template parameter in the partial specialization of the `Transform `template (the other one being the type list parameter, which was specialized as `Nil`).

Hence, by adding a type list to a configuration header, which contains only the user-interesting information (namely the block sizes and the preferred pool sized to go with those) we accomplish three things:



	
  1. we present the user with only the information relevant to the user

	
  2. we use only those types that are actually interesting for us to use (namely those the user is interested in)

	
  3. the details of the types of allocators used remain hidden from the user (i.e. we can use different allocation algorithms for different allocation sizes -- using a slightly different `MakeAllocator` meta-function -- without imposing that choice on the user



I should note, though, that while the user _does not have to_ choose the exact allocator type, he could if he wanted to (by just replacing the `AllocatorTypes` typedef with the list of allocator types he wants to use rather than a meta-function.
