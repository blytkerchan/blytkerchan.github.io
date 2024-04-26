---
author: rlc
comments: true
date: 2013-09-05 02:34:41+00:00
layout: post
permalink: /blog/2013/09/sometimes-your-right-hand-should-know-what-your-left-hand-is-doing/
slug: sometimes-your-right-hand-should-know-what-your-left-hand-is-doing
title: Sometimes, your right hand should know what your left hand is doing
wordpress_id: 2349
categories:
- C &amp; C++
- Software Development
tags:
- alignment
- code annotation
- compiler bugs
---

Especially if you're a compiler...

<!--more-->

Today, I spent a good part of the day first trying to figure out what was wrong with my code -- why it crashed -- and then trying to figure out how to get the compiler to behave.

A chunk of application-layer code I wrote was calling a driver I also wrote to get a notification payload from a queue. This is on an embedded Windows device (Windows Embedded Compact 7, to be precise), so the compiler of choice is the C++ compiler that comes with Microsoft Visual Studio 2008, and we're targeting a 32-bit platform[^1].

[^1]: These details are important because the problem would not have occurred with another compiler, or if I had targeted a 64-bit platform.

The code looks roughly like this:

    
    Notification Blah_getNotification(HANDLE h)
    {
        Notification notification;
        DWORD notification_size(sizeof(notification));
        BOOL result(DeviceIoControl(h, BLAH_GET_NOTIFICATION, 0, 0, &notification;, notification_size, &notification;_size, 0);
        /* error checking & throwing here */
        return notification;
    }



This function was called from two different call sites. The first one didn't pose a problem the second one, however, crashed due to what appeared to be a corrupted stack.

Here's what I checked, in order:



	
  1. still crashed when the call to `DeviceIoControl` was commented out  
would have been surprising to see the driver corrupt memory from user land, but stranger things have happened...

	
  2. all headers were up-to-date -- same between OS and user land

	
  3. structure was properly packed: compiler had no choice w.r.t. alignment or padding  
this line of thought got me on the right track

	
  4. in disassembly, the amount of stack allocated corresponded to the size of the structure in both the calling function and the wrapper around `DeviceIoControl` (above)

	
  5. the `return` statement translated to a `rep movs` instruction that had it repeat `0x68` times -- corresponding to the size of the structure divided by 4, which was right

	
  6. the stack was being crushed by exactly four bytes and the first four bytes of the structure in the calling function were left untouched


**_Aha!_**

Conclusion: the return was aligning the return value to an 8-byte boundary by rounding down, but the calling function's stack was aligned to a four-byte boundary. Apparently, when compiling the code for rather calling function, the compiler hadn't picked up on the fact that the structure needed alignment to an eight-byte boundary (because of a `LARGE_INTEGER` in it) and aligned it to a four-byte boundary in stead. The wrapper function had picked it up and aligned the return value "properly", ignoring the fact that it had been given a mis-aligned address to return to, and corrupting the stack in the process.

The fix then became more or less obvious (after a bit of venting and a few unrelated meetings talking about other things): `__declspec(align(8))` in the structure's declaration was enough of a "hint" for the compiler to catch it in both places, and pad the stack properly in the calling function.

All in all actually a fun bug to fix, once I got to look back on it...
