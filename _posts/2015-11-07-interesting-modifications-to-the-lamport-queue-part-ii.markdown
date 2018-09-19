---
author: rlc
comments: true
date: 2015-11-07 20:10:47+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2015/11/interesting-modifications-to-the-lamport-queue-part-ii/
slug: interesting-modifications-to-the-lamport-queue-part-ii
title: Interesting modifications to the Lamport queue, part II
wordpress_id: 3763
categories:
- Algorithms
- C &amp; C++
- Interesting stuff
tags:
- Lamport queue
- lock-free
---

In the [previous installment](http://rlc.vlinder.ca/blog/2015/11/interesting-modifications-to-the-lamport-queue/), on this subject, I described a few modifications to the Lamport queue introduced by Nhat Minh Le _et al._ to relax operations on shared state as much as possible, while maintaining correctness.

In this article, I will discuss the further optimizations to reduce the number of operations on shared state, thus eliminating the need for memory barriers completely in many cases.
<!--more-->
[dropshadowbox effect="lifted-right" border-width="1" inside_shadow="false"]**The TL;DR:** I



	
  * briefly recap the [previous article](http://rlc.vlinder.ca/blog/2015/11/interesting-modifications-to-the-lamport-queue/)

	
  * explain the cost of synchronization

	
  * show a way to get around that cost most of the time


[/dropshadowbox]
A quick recap:

	
  * The C11 memory model is largely undefined, but it at least defines a happens-before relationship for operations on shared state, and a sequenced-before relationship for operations on any state ((this is a rather crude simplification, but it works for the context we're working in))

	
  * there are four memory ordering some that are interesting to us: sequentially-consistent, acquire, release and relaxed

	
  * we ended up with an implementation of the Lamport queue that had memory ordering on its shared state that was as-relaxed-as-possible, but no more.



This time, we will introduce a novel ((well, it was novel when Nhat Minh Le wrote it's)) optimization to the queue, which reduces the number of operations necessary on shared state, in the general case.

The code we had at the end of the previous installment looks like this:

    
    struct LamportQueue
    {
        atomic_size_t front_;
        atomic_size_t back_;
        T data_[SIZE];
    };
    
    void LamportQueue_init(struct LamportQueue *queue)
    {
           atomic_init(&queue-;>front_, 0);
           atomic_init(&queue-;>back_, 0);
    }
    
    bool LamportQueue_push(struct LamportQueue *queue, T elem)
    {
        size_t b, f;
        b = atomic_load_explicit(&queue-;>back_, memory_order_relaxed);
        f = atomic_load_explicit(&queue-;>front_, memory_order_acquire);
        if ((b + 1) % SIZE == f)
        {
            return false;
        }
        else
        { /* not full */ }
        queue->data_[b] = elem;
        atomic_store_explicit(&queue-;>back_, (b + 1) % SIZE, memory_order_release);
        return true;
    }
    
    bool LamportQueue_pop(struct LamportQueue *queue, T *elem)
    {
        size_t b, f;
        f = atomic_load_explicit(&queue-;>front_, memory_order_relaxed);
        b = atomic_load_explicit(&queue-;>back_, memory_order_acquire);
        if (b == f)
        {
            return false;
        }
        else
        { /* not empty */ }
        *elem = queue->data_[f];
        atomic_store_explicit(&queue-;>front_, (f + 1) % SIZE, memory_order_release);
        return true;
    }



The `push` and `pop` functions are similar, and symmetrical: they each read both their own index, and the foreign index, and update and publish their own index for the other to read.

Atomic operations _cost_ something: they are atomic because they are indivisible from both the own thread and any other thread. _Any_ operation is indivisible from the own thread. It's _other_ threads that can see read-modify-write operations as such. When you write `i++` in your code, you don't see the intermediate steps -- but another thread might.

The cost of any atomic operation is some level of synchronization. The stricter the requirements on the atomic operation, the higher the cost. If you want the operation to be sequentially consistent as seen from all other threads, the cost is highest. This is why we wanted to reduce the required memory barriers for each of the operations to a minimum in the first place: to reduce the requirements on the atomic operations and thus reduce the cost associated with them.

But what if we can do away with some of those atomic operations altogether? What if we can get the information we want without paying for it?

We will not be able to do that all of the time -- we will have to pay the cost of synchronization at some point, some of the time -- but we _can_ avoid paying the cost some of the time.

We do this by making a trade: the same trade one usually makes when optimizing, between speed and size. We will trade a few bytes of size in the structure, for not having to read the shared state as often -- and thus not having to synchronize with other threads as often.

Let's start by paying those few bytes of overhead:

    
    diff --git a/lamport.c b/lamport.c
    index 45ddc21..d668d6d 100644
    --- a/lamport.c
    +++ b/lamport.c
    @@ -11,6 +11,8 @@ struct LamportQueue
     {
         atomic_size_t front_;
         atomic_size_t back_;
    +    size_t cached_front_;
    +    size_t cached_back_;
         T data_[SIZE];
     };
    
    @@ -18,13 +20,21 @@ void LamportQueue_init(struct LamportQueue *queue)
     {
            atomic_init(&queue-;>front_, 0);
            atomic_init(&queue-;>back_, 0);
    +       queue->cached_front_ = queue->cached_back_ = 0;
     }



From the name of the new member variables, it should already be clear what we are going to do: we are going to _cache_, in an owned, non-atomic variable, the latest value of the shared foreign variable read by either `push` or `pop`. For the sake of brevity, we will only look at `push`.


    
     bool LamportQueue_push(struct LamportQueue *queue, T elem)
     {
         size_t b, f;
         b = atomic_load_explicit(&queue-;>back_, memory_order_relaxed);
    -    f = atomic_load_explicit(&queue-;>front_, memory_order_acquire);
    +    f = queue->cached_front_;
    +    if ((b + 1) % SIZE == f)
    +    {
    +           queue->cached_front_ = f = atomic_load_explicit(&queue-;>front_, memory_order_acquire);
    +    }
    +    else
    +    { /* front can only increase since the last time we read it, which means we can only get more space to push into.
    +        If we still have space left from the last time we read, we don't have to read again. */ }
         if ((b + 1) % SIZE == f)
         {
             return false;



As indicated in the comment, the reason this works is rather straight-forward: both `back_` and `front_` advance in the same direction, so the amount of space available between two calls to `push` can never decrease and the number of items available between two calls to `pop` can never decrease either. Hence, even if the value we're looking at is stale, it can never give us a better picture of the queue than reality: from the point of view of the function we're in, reality can only be better.

This means that for pushing into the queue, the front of the queue is only read once, on the first push, and then only again when the queue has been completely filled (regardless of how many items have been removed from the queue in the mean time). After that, it will be read every [latex]N[/latex] times, where [latex]N[/latex] is the number of pops since the last time the shared value was read.

For popping, the optimization is slightly less effective, as the first few pops are likely to occur after only a few pushes, so the number of values available when the first pop occurs is likely to be fairly small.

