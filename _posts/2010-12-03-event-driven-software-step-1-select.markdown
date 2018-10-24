---
author: rlc
comments: true
date: 2010-12-03 04:12:04+00:00
layout: post
permalink: /blog/2010/12/event-driven-software-step-1-select/
slug: event-driven-software-step-1-select
title: 'Event-driven software, step 1: select'
wordpress_id: 1137
categories:
- C++ for the self-taught
tags:
- event-driven
- Posts that need to be re-tagged (WIP)
- software
---

[donate]

In this installment, we will look at the basic networking functions and start looking at event-driven software design. Starring in this installment will be the `select` function.
<!--more-->
The `select` function is probably one of the most-described yet most poorly understood functions in C and C++ programming. It is what's called a "_synchronous multiplexing_" function in that it allows you to poll a number of objects, in this case socket file descriptors, for events. There are three types of events you can poll the sockets for: _data is ready to be read_, _out-of-bound (exception) data is ready to be read_ and _the socket is ready to be written to_. For different types of sockets, these events have different meanings, but all of them are events nonetheless.

Event handling is usually implemented as follows: the program polls the system to know whether any events occurred, the system holds on to the calling thread as long as no events have occurred and will only allow the thread to continue execution once it has, indicating which event has occurred on what object, or returning a message to the calling thread. The thread then handles the event before it comes back to poll the system again.

In our case, events happen on sockets, which are identified by file descriptors. Sockets are created with the `socket` function (or the `accept` function, but we'll get to that). When creating a socket, we need to tell the system three things: 


	
  1. the _address family_ for the socket, which tells the system how sockets are addressed. For IPv4 sockets, this is `AF_INET`. There are several other addressing methods, including IPv6, but we'll let those be for now

	
  2. the _socket type_: _streaming_, _datagram_ or _raw_. This tells the system a bit on how the socket is to be managed

	
  3. the _protocol_, which can be the default protocol for the socket type (e.g. the default protocol for a streaming socket it TCP), or any one of a number of supported protocols -- supported by the operating system, that is



Once we have a socket, we can _bind_ it to a _name_, which is to say we give it an address (one of the system's local addresses) and a _port_. According to the RFCs that define TCP and UDP, this is what makes a socket a socket: the fact that it has a name. For the operating system, a socket is a socket as soon as it has been created.

Once the socket is bound, we can _listen_ on it. We now have what some might call a "server socket": a socket that can accept connections.

If we don't bind the socket, we can still use it to send and receive data: in that case, we need to _connect_ it. This is what some might call a "client socket". Note that such sockets can also be bound to a name, if you want to know the exact name (e.g. the port) that your connection is made _from_.

So let's say we've done all this, and we want to handle events on this, and perhaps other, socket(s). The purely event-driven loop approach would look like this (pseudo-code):

    
    /* prepare the socket */
    while (!done)
    {
        fd-set rfds, wfds, efds;
        FD_ZERO(&rfds;);
        FD_ZERO(&wfds;);
        FD_ZERO(&efds;);
        foreach(fd in the currently open sockets)
        {
            FD_SET(fd, &rfds;);
            FD_SET(fd, &wfds;);
            FD_SET(fd, &efds;);
        }
        int select_result(&rfds;, &wfds;, &efds;, timeout);
        if (select_result == 0)
        { /* timed out */
        }
        else if (select_result < 0)
        { /* an error occurred */
        }
        else
        {
            foreach (fd in currently open sockets)
            {
                if (FD_ISSET(fd, &rfds;))
                {
                    /* ready to read */
                }
                if (FD_ISSET(fd, &wfds;))
                {
                    /* ready to write */
                }
                if (FD_ISSET(fd, &efds;))
                {
                    /* "exceptional" data ready to read */
                }
            }
        }
    }


In a more C++-oriented approach, this same logic is encapsulated and the events are handled to objects that are registered for them - e.g. each having registered itself with a name (in the form of an address and a port) so the implementation need only create the socket and handle the rest. The events would logically be `onNewConnection`, called when a new connection occurs, `onDataReady`, called when data is ready for a new connection, `onWriteReady`, called when it is possible to write on the socket and `onExceptionalDataReady`, called when "exceptional" data is ready. The logic for knowing who to notify and when may be a bit more complicated than what is described above, as it would have to include some means of knowing whether a socket has been written to since it last received an `onWriteReady` event, for example.

In object-oriented parlance, the object we've been talking about is a specialized version of an _observer_ as it is notified when an event it has subscribed to occurs. We will go into more detail on this specialized version of the observer pattern in the next installment, when we will implement it. Until then, here's a few suggestions:



	
  * the gang of five has written an excellent introduction to the observer pattern - you might want to read it

	
  * the `select` function is very well-specified - you might want to go through its documentation, which can be found in the [Single Unix Specification](http://www.unix.org/single_unix_specification/)


