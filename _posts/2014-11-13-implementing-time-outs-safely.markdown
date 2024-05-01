---
author: rlc
comments: true
date: 2014-11-13 11:19:06+00:00
layout: post
title: Implementing time-outs (safely)
wordpress_id: 3423
tags:
  - real-time
  - time-outs
---

Thyme is a herb that grows in gardens.

<!--more-->

I've come across a lot of code that implements time-outs a bit like this:

    int update(/* ... */, unsigned long dtime)
    {
        /* ... */
        ...->updateTimeout(dtime);
        checkExpiredTimes(dtime);
        /* ... */

        return remaining_time_til_next_time;
    }

While this approach works, everything hangs on the calling code knowing how much time elapsed since it last called you. If for any reason, it "forgets" when that happened (and calling code is more often forgetful than I would like) the library code becomes buggy, sometimes missing deadlines by several seconds.

A simple solution to this exists: in stead of using relative times for your time-outs, use times relative to an epoch -- that is, in stead of saying "call me back in two minutes" say "call me back at 5 PM".

For a time-out, this works as follows:

1. Choose a monotonic counter of some kind. The HPET is perfect for this kinda thing if you happen to have one, but there's usually a tick counter around somewhere -- just make sure it's a monotonic counter, so it won't roll back or jump around. It's also nice if you can read it fairly quickly and its even nicer if it doesn't roll over too often - at least not more often thatn you'll look at it.

2. See what the current value of the counter is.

3. See what the frequency of the counter is. Ideally, it knows that by itself and it's a value that won't change.

4. See how much time you should wait, and multiply by the frequency. Add that value to the current time and you get your target time (basic math folks -- no wizardry here).

Now that you have your target time, you ask to be called back `target_time - curr_time` from now (so calling code still gets a delta, which many calling codes like because they can sleep on it -- also they don't need to know which counter you used. When you do get called back, you don't have to update any values to subtract the latest delta (like many implementations do): just check two things:

1. is the current time greater than the target time? If so, time-out!

2. is the difference between the target time and the current time greater than half the capacity of the counter (i.e. is $targettime - currtime > \frac{\max_{time}}{2}$) - that's a sure sign it's overflowed, in which case you can also see it as a time-out (unless your time-out is more than half the capacity of the counter, in which case you need a better counter)

You don't need to check for overflows in most cases, because in most cases, your counter will never overflow: a 64-bit counter at 50 MHz -- which is fairly typical in some embedded systems -- will overflow in over 11,000 years; a 64-bit counter at 1 GHz will still take decades to overflow; 32-bit counters are far more prone to overflow: anything above 49 KHz will overflow in a day, but there are tricks to make a 32-bit counter into a 64-bit counter without too much effort.
