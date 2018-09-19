---
author: rlc
comments: true
date: 2009-08-05 04:32:49+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/08/fixing-mistakes/
slug: fixing-mistakes
title: Fixing mistakes
wordpress_id: 116
categories:
- C &amp; C++
tags:
- Posts that need to be re-tagged (WIP)
---

I just finished debugging a very, very nasty problem, which took me the better part of two hours to find and, once found, only a few minutes to fix. In this case, I have no one to blame but myself, so I really shouldn't complain too loudly, but I thought it was worth mentioning anyway, to show what can happen if you break the One Definition Rule.

Let's get a bit of context first: I am currently writing a piece of firmware and the simulator that goes with it - the simulator allows me, and will later allow other programmers, to test the software that talks to the firmware without having the hardware that goes with it. As many firmwares are, this one is written in a mixture of C and C++ - mostly C - and uses a bunch of structures and unions. The firmware and the simulator, though they use the same source code, do not use the same compiler: the simulator uses [Microsoft Visual Studio](http://www.microsoft.com/visualstudio)'s compiler whereas the firmware uses the [GNU Compiler Collection](http://gcc.gnu.org/) with a few settings that, among other things, make sure that unions work correctly. On Microsoft's compiler, the code uses #pragma pack to make sure unions are aligned correctly. This is where the trouble begins.

In C++, the One Definition Rule states that a structure, class, function, etc. cannot have more than one definition, that the compiler need to generate a warning - or error - when this is not the case and that breaking it causes undefined behavior. I made a few notes about this [before](http://landheer-cieslak.com/?p=81). My programming style usually prevents me from breaking the ODR: I am very careful with things - including pragmas - that change the alignment or that might change their definition according to context. In template code - where this is perhaps most likely to happen if something isn't defined in one translation unit but is in another - I usually make sure that everything that needs to be defined is defined, using a static assertion (but only if there's a need: i.e. only if there might be something that might not be defined). This time, I made a silly mistake.

The firmware is based on a small RTOS that comes with the hardware and that includes a file called "predef.h". _Almost_ all files in the firmware need to include this file, because it contains a lot of useful things from the RTOS - and most other RTOS headers include the file too. In the simulator code, there's a set of stub headers that includes a version of predef.h. When writing the stub for predef.h, I _mistakenly_ assumed that it would be included in _all_ files in the firmware - not _almost all_ files. That's error number 1.

Error number 2 was being lazy. In stead of putting the pragmas in the right location, where they should be and where I ended up putting them anyway - first because I forgot about error number 1, then because I had to undo error number 2 - I added a line to my predef.h:
    
    #pragma pack(1)

This causes the Microsoft compiler to align everything after it encounters this pragma on a one-byte boundary, effectively packing it all together as much as possible.

All was fine and dandy, compiled and ran merrily, until I started testing a bit more thoroughly. Then, I started pulling my hair out. For some reason, calling a very simple method on a class, which was to set the instance's ID, didn't seem to work at all: it said it set the ID, but when I read it back later, it hadn't done anything: the ID was what the constructor had made it - namely -1. Adding traces to the source code didn't help much: it said it put in the new ID (0, 1, 2, ...) every time.

Then, I noticed something odd: as I usually do when I add traces in C++, I output _this_ - the pointer to the instance I'm working on. The odd thing was that when the IDs were first set, the value for _this_ for the first instance was 0x004e37c0. When another method was called on the same instance a bit later, _this_ was 0x004e39b2 - 510 bytes further away. The object in question was 9557 bytes in size, so _this_ was moved somewhere within the object itself.

My first guess was that I had done something wrong when declaring the object's class, which inherited from two other classes, so I dug up some documentation, counted the base class' members, figured out how bug they should be, added some traces, found the same size (4 and 13 bytes, resp. - nowhere near the 510 bytes I was seeing)  and came to the conclusion that this could not be it. Then, inspiration struck: "wait a minute," I thought: "I must be breaking the One-Definition Rule on something!".

The object in question is part of a structure located in mapped memory in the firmware, which I retrieve using a macro which, in the simulator, actually calls a function that returns a pointer to a static instance of the same thing. In that structure there are several other objects as well - some of them before my object, some of them after. I decided to test my theory by moving my object to the start of my memory-mapped structure. Lo and behold, _this_ no longer moved. I was now sure that I had broken the One-Definition Rule, but on what type? I decided to move my object one step at a time towards the end of my structure. As soon as this started moving again, I would have found the culprit. The next test I did, putting the object right behind the head of an internal FIFO, **bang!** it moved again.

The FIFO in question has nodes that look a bit like this: 
    
    struct FIFONode
    {
    	void * reserved_;
    	uint32_t magic_;
    	union Payload_
    	{
    		PayloadType1 p1_;
    		PayloadType2 p2_;
    		PayloadType3 p3_;
    	} payload_;
    	bool allocated_;
    };



When I saw this code, I thought "well that's odd: I didn't add a pragma pack to this union - but it's been working anyway!" so I added the pragma - but saw no effect. I then added some more traces to see whether the size was consistent with what it should be - and it was. Something else was going on.

Then, it dawned on me that I usually do this:
    
    #pragma pack(push)
    #pragma pack(1)
    ...
    #pragma pack(pop)

but that I might have forgotten a pop somewhere. That's when I did a solution-wide search for "pack".

Luckily, I did a _solution_-wide search and not just a _project_-wide search: the way the simulator is set up, the firmware's code is in a library that is linked into the simulator, and is therefore in its own project in Visual Studio, as is the interface and the stubs (so three projects in total). Had I done a _project_-wide search, all my pushes would have had pops and no pack(1) would have been outside a push and a pop - because I would only have looked in the firmware's code. Now, my search included the stubs, which contained the one naked line:
    
    #pragma pack(1)



I removed the line, tested again and found _this_ no longer moved. I put the object at the end of my memory-mapped structure to be sure - it still didn't move. The mistake was fixed - the One Definition Rule obeyed once more.
