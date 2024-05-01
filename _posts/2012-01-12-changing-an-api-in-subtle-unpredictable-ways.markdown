---
author: rlc
categories:
- Software Development
comments: true
date: 2012-01-12 22:14:34+00:00
layout: post
tags:
- API design
- code
- design
title: Changing an API in subtle, unpredictable ways
wordpress_id: 1785
---

Many seasoned Windows systems programmers will know that you can wait for the death of a thread with `WaitForSingleObject` and for the deaths of multiple threads with its bigger brother, `WaitForMultipleObjects`. Big brother changes its behavior on some platforms, though -- as I just found out myself, the hard way.

<!--more-->

`WaitForMultipleObjects` takes four parameters: the number of objects to wait for, the handles of the objects to wait for, whether or not it should wait for all of the objects to be signalled before returning, and a time-out. One common way to wait for a bunch of threads to die looks like this:

    HANDLE threads[thread_count__] = { the threads }
    DWORD wfmo_result(WaitForMultipleObjects(thread_count__, threads, TRUE, INFINITE));
    // handle errors here

The snag is in the third parameter. On some platforms, it _has to be_ `FALSE` -- otherwise `WaitForMultipleObjects` will (may?) return immediately.

Personally, I find this kind of thing really annoying: when you have an API that works perfectly well, dropping a feature like this -- even if you can't implement it as efficiently as you can on other platforms, just isn't an acceptable (or user-friendly) practice. Companies smaller than Microsoft _would not_ get away with it.

I can understand that with the Embedded Compact scheduler, it may not be feasible to implement a wait-for-all option very efficiently but, knowing your users need the option and will likely port applications between platforms, would it really be too much to ask to do something along these lines:

    DWORD WaitForMultipleObjects(DWORD nObjects, HANDLE *lpHandles, BOOL bWaitForAll, DWORD dwTimeOut)
    {
    	if (bWaitForAll)
    	{
    		HANDLE handles[MAXIMUM_WAIT_OBJECTS];
    		memcpy(handles, lpHandles, nObjects * sizeof(HANDLE));
    		DWORD dwTickCount = GetTickCount();
    		while (nObjects && dwTimeOut)
    		{
    			DWORD result = WaitForMultipleObjects(nObjects, handles, FALSE, dwTimeOut);
    			DWORD dwNewTickCount = GetTickCount();
    			DWORD elapsed = dwNewTickCount - dwTickCount;
    			if (dwTimeOut != INFINITE) dwTimeOut -= elapsed < dwTimeOut ? elapsed : dwTimeOut;
    			dwTickCount = dwNewTickCount;
    			if (result >= WAIT_OBJECT_0 && result < WAIT_OBJECT_0 + nObjects)
    			{
    				--nObjects;
    				handles[result - WAIT_OBJECT_0] = handles[nObjects];
    			}
    			else
    			{
    				return result;
    			}
    		}
    		return WAIT_OBJECT_0;
    	}
    	else
    	{
    		// current implementation
    	}
    }

I've even written this code in Microsoft style -- hungarian wartHogs and all. If anyone at Microsoft is reading this: a QFE for Windows Embedded Compact 7 with this code (or something similar) in it would be appreciated (but I won't be holding my breath).

Changing APIs from one version of an OS to another (even if one is embedded and the other isn't) in subtle, unpredictable ways is a bad idea -- even if you're doing while working for a huge company like Microsoft, which can get away with it.