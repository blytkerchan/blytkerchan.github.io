---
author: rlc
comments: true
date: 2012-11-08 23:35:44+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2012/11/exceptions-and-embedded-devices/
slug: exceptions-and-embedded-devices
title: Exceptions and Embedded Devices
wordpress_id: 1938
categories:
- C &amp; C++
- Embedded software development
tags:
- embedded
- error handling
---

Lately, I've had a number of discussions on this subject, in which the same questions cropped up again and again: 


	
  1. should exceptions be used in embedded devices?

	
  2. should exceptions occur in "normal operation" (i.e. is every exception a bug)?


My answer to these two questions are yes and yes (no) resp.: exceptions can and should be used (appropriately) in embedded devices and exceptions may occur during normal operation (i.e. not every exception that occurs is a bug).

<!-- more -->

Exceptions are a way of signaling an error to calling code, and encapsulating that error in an object which should contain sufficient information to tell the calling code what's going on and what it can do about it. A good example of an exception is one that is thrown when the calling code attempts to write to a connection that has already been closed, possibly asynchronously, without the knowledge of the calling code. A connection that may be closed asynchronously (which all connections may be: they may be closed by whatever they are connected to) does not allow for a self-evident way of checking whether the connection is still usable - i.e. the following snippet of code will not reliably work:

    
    if (connection->usable())
    {
        connection->write(data);
    }

because between the call to usable and the call to write, the connection may be closed asynchronously. If `write` is defined as consuming the data sent from the buffer, moving it out of the buffer, `write` could be called in a loop until there is no data left, like this: 
    
    while (!data.empty())
    {
        connection->write(data);
    }

Event if `write` were to return an error code, it may be silently ignored and an asynchronous close would result in an endless loop.

The alternative, and IMHO more robust, way of doing things is allowing `write` to signal the closure of the connection in a way it cannot be ignored: by throwing a `ConnectionClose` exception. Calling code can then simply clean up the `connection` object and handle the fact that the peer may not have received all the data intended for it (which may or may not be a problem for the device implementing this code).

There are plenty of discussions on the intertubes explaining how exceptions can be used to write more robust code, so I'll leave it with this example for the moment.

This example also nicely illustrates that not every exception at run-time is a bug: while some exceptions are -- which should normally be derived directly or indirectly from `std::logic_error` if at all possible -- some are simply run-time errors, such as a connection being closed by the peer while we were sending it data. It may well be a bug in the peer causing it to close the connection, but that is beside the point: it may also be a user hitting "Reload" on the browser, prompting it to close its current connections and create new ones.

What about the performance penalties of throwing exceptions? While it is true that `throw` is more costly than `return` at run-time, that cost is mitigated by the fact that exceptions are exceptional and help make the software more robust. If there are so many exceptions being thrown as to have a noticeable negative impact on device performance, there is a problem -- but that problem is not inherent to using exceptions. Rather, it is inherent to using exceptions inappropriately.


* * *


This post was prompted by a bug report: one of the file systems I wrote raised an exception at device start-up systematically if one of the device's expansion cards wasn't present. The cause of this was that the file system was being mounted _on the absent device_. The device in question being a PCIe device which could be enumerated with the OS' API (and was enumerated elsewhere to know whether the device was present) the bug was mounting the file system on an absent device - not the file system's code returning false from its initialization routine after internally aborting a class construction by throwing an exception.

The exception is still there, as is the real bug.
