---
author: rlc
categories:
  - Technology
  - Engineering
  - Software Development
  - Debugging
  - Real-time Systems
  - Industrial Devices
  - Data Logging
  - Memory Management
  - Processor Optimization
  - Resource Management
  - Windows Embedded Compact
  - Kernel Programming
  - Multi-threading
  - Data Structures
  - Algorithms
  - Performance Optimization
  - Error Handling
  - File Management
  - System Design
  - Optimization Techniques
  - Diagnostic Tools
  - Report Generation
  - Data Formatting
  - Operating Systems
comments: true
date: 2017-10-15 17:14:46+00:00
layout: post
tags:
  - industrial devices (1.0)
  - real-time (1.0)
  - logging (1.0)
  - diagnose (1.0)
  - timing constraints (0.9)
  - system (0.9)
  - debug messages (1.0)
  - memory (0.9)
  - processor time (0.9)
  - resources (0.9)
  - error (1.0)
  - debugging (1.0)
  - Windows Embedded Compact (1.0)
  - driver (1.0)
  - I/O Control (0.9)
  - OAL (0.9)
  - kernel-mode (0.9)
  - hooking (1.0)
  - queue (1.0)
  - multi-producer single-consumer (0.9)
  - FIFO (1.0)
  - named event (0.9)
  - flush-to-disk (0.9)
  - abstract data type (0.9)
  - MPMC queue (0.9)
  - atomic operations (0.9)
  - optimization (1.0)
  - sprintf (1.0)
  - WriteFile (1.0)
title: The Logging "problem"
wordpress_id: 3457
---

A recurring problem in real-time industrial devices is logging: you want to log all the information you need to diagnose a problem, but you don't want to slow down your system and miss timing constraints, or unnecessarily burden your system when there are no problems. On the other hand, you often don't know that there is a problem to be diagnosed (and therefore logged) before there is an actual problem, in which case you may be too late to start your logs.

The solution seems obvious: just look a minute or so into the future and, if any trouble is brewing, start logging. But as a wise person once said: "Always in motion the future is."
In the real world, we need real solutions.

<!--more-->

The trade-off is obvious: keeping debug messages around and storing them to disk cannot be free: it takes memory, processor time, ..., resources. Not keeping the messages means information is lost if an error occurs, and the underlying bug may never be fixed. Hence, storing the debug messages during run-time represents an investment for which the costs and benefits have to be weighed against each other.

## Getting the messages

In a recent[^1] implementation to solve this problem in Windows Embedded Compact, I redirected `OEMWriteDebugString` to a driver by creating an I/O Control in the OAL to which function pointers within the (kernel-mode) driver are given (one to set the pointer, one to read the current value). Hooking in then really becomes quite easy:

[^1]: Publication of this post is significantly delayed to allow the implementation in question to be patented before this hits the web.

<gist id="blytkerchan/9702620403f11773fe3b1200ce785eee" file="kernel-hooks.cpp"></gist>

and all the `writeDebugString` hook function needs to do is queue the message. We make sure that for debug messages, the OEM function also gets called at some point -- either directly in the hook or elsewhere -- so the solution appears transparent.

## Handling all those messages

In order to handle all those messages, I created a thread within the driver that consumes the messages and prepares a file, in memory, that can be dumped to non-volatile storage on a trigger. To do that, the `writeDebugString` hook pushes every messages into a multi-producer single-consumer queue with the following characteristics:

1. supports multiple producers

2. supports only a single consumer

3. linked-list based

4. non-intrusive for producers, intrusive for consumers

5. bounded size

6. overwrites the oldest value on overflow

7. does not require garbage collection

8. does not support message priorities

9. FIFO order

10. lock-free producers

11. blocking consumption

12. no-fail guarantee for producers

13. immediate fail for consumption on empty queue: when empty, consumption returns `null` value

The queue was designed for continuous production, periodic burst consumption.

In order for the complete feature-set I wanted to be available, messages were wrapped in a small structure containing an ID, a time stamp, and the origin of the message (which could be an intercepted call to `OutputDebugString` or a call to the driver's `WriteFile` function). With this, the consumer thread, which ran periodically, consumed all the messages in the queue, output the messages intercepted from `OutputDebugString` to the original `OEMWriteDebugString`. Messages received through the `WriteFile` function were only queued to be included in the file, if necessary.

The driver further created a named event, using Windows' `CreateEvent` function, which could be set from anywhere in the system to trigger the flush-to-disk mechanism. Typically, this would be done as part of error trapping, meaning the file was flushed to disk only if an error occurred.

## Algorithms

The interface of the abstract data type looks a bit like this:

<gist id="blytkerchan/9702620403f11773fe3b1200ce785eee" file="debugmessagequeue.hpp"></gist>

The "intrusive" part in the descriptive list above is fairly clear: when you pop all of the buckets, you get an implementation-defined _thing_ called `Buckets`, which you go through to get all the messages and release afterwards. If we assume that `Buckets` has an STL-like interface, the consuming thread would look something like this:

<gist id="blytkerchan/9702620403f11773fe3b1200ce785eee" file="consumingthread.cpp"></gist>

### Pushing into the queue

The queue contains an array of pre-allocated _buckets_, for which two alternative methods of allocating exist:

1. either each bucket contains a flag indicating whether it is allocated or not,
2. or a separate "allocation mask" is used to allocate buckets at given indices.

In the first case, allocating a bucket is a question of picking an index (one more than the previous index would make sense) and test-and-set the "allocated" flag.

In the second case, allocating a bucket is picking the part of the mask you're interested in (if you have more buckets than bits in the mask) and using a Compare-And-Swap operation to test-and-set a bit in the mask.

Either method has advantages and disadvantages, depending on the particulars of the application. For various reasons, I went with the second option in this particular implementation.

If no free buckets are available, a bucket can be popped from the queue. In order to do this, one has to understand another aspect of the design of this queue: the queue really consists of two separate MPMC queues, where the "current" queue is the one being pushed into, while the "not current" queue can be treated as a list of previously queued items. Because we expect the consumer to consume much less frequently than the producer, we allow the consumer to fetch the entire list in a single go, after which it doesn't need any atomic operations to go through the list -- which makes it potentially much more efficient to consume like this. The less-efficient way of consuming only happens when the more-efficient consumption doesn't happen often enough.

This means `push` looks something like this:

<gist id="blytkerchan/9702620403f11773fe3b1200ce785eee" file="push.cpp"></gist>

in which `allocateBucket` is coded according to the selected method.

The `acquireCurrentHeadTail` method does three things:

1. obtain a pointer to the current head/tail pair (MPMC queue)

2. increment a reference counter on that head/tail pair

3. check whether the current head/tail pair pointer has changed -- if so, decrement the reference count and start over; otherwise, done

Finally, enqueueing a bucket is a matter of finding the tail and updating it by setting the `next` pointer to the bucket to enqueue. This is done, of course, with an atomic Compare-And-Swap.

While the head/tail pair stores a _hint_ as to where the tail is, that hint may or may not be right. We do guarantee, however, that the tail is reachable from the head and the tail-hint is located somewhere between the head and the tail, inclusive.

### Popping all buckets

Popping requires the consumer to obtain exclusive ownership of all buckets containing pushed messages at the time it pops. In order to do this, is has the ADT switch from the current head/tail pair to a different, empty head/tail pair. It then excises the dummy node from the list, places that dummy node as both head and tail of the in-structure head/tail pair and returns a linked list of all other buckets, in the same order.

To obtain exclusive ownership of the bucket list, it changes the pointer to the "current" head/tail pair and waits for the reference count to drop to 0.

Note that the "dummy node" is basically an empty node that initially makes up the entire list (head and tail) and is treated specially in that it is always re-enqueued if popped. Putting it back as head and tail allows the structure to remain coherent even if the consumer decides to not return the entire list it obtained to the structure -- or if there is more than one consumer thread, using a mutex to obtain exclusive access to the `popAll` method.

## Results

The results were actually very interesting: as `OutputDebugString` normally writes directly to a serial port, it is a blocking function for all producing applications -- anything that calls `OutputDebugString` at any time has to wait for all the bytes to be sent over the debug port. With this driver in place, that was no longer the case, meaning that while the driver made the debug messages available for after-the-fact debugging, it also _accelerated_ the applications.

The product can create a report on demand, including all kinds of information to assist in diagnosis. The debug traces are now included in that report and can be used to accelerate diagnosis in case of problems...

---

### Further optimization

Much of the time the processor spends on debug messages is actually spent formatting the messages using some variant of `sprintf`. This time can be further reduced by, instead of logging the string, logging the format and its parameters. This works for all formats that do not contain `%s` , as `%s` would dereference one of the pointers passed to the formatting function and consider it a string. Hence, any format not containing `%s` need not be formatted before `WriteFile` is called. In stead, we pass `WriteFile` the format string and the parameters to that string, which are whatever we find on the stack. A large part of this is, of course, very specific to the OS, but this is a driver we're talking about -- we can be very specific to the OS.
