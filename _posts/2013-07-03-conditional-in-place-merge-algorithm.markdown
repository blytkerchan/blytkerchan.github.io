---
author: rlc
categories:
- Algorithms
- Data Structures
comments: true
date: 2013-07-03 22:40:10+00:00
layout: post
title: Conditional in-place merge algorithm
wordpress_id: 2336
---

Say you have a sorted sequence of objects.

Go ahead, say: "I have a sorted sequence of objects!"

Now say it's fairly cheap to copy those objects, you need to be space-efficient and your sequence may have partial duplicates -- i.e. objects that, under some conditions, could be merged together using some transformation.

OK, so don't say it. It's true anyway. Now we need an algorithm to

1. check for each pair of objects in the sequence whether they can be transformed into a single object

2. apply the transformation if need be

Let's have a look at that algorithm.

<!--more-->

Our sequence will need to provide multi-pass bidirectional input/output iterators: we need to be able to dereference each iterator more than once, we need to be able to read through them and write through them, and we need to be able to go forward, and backward (we'll see why below).

We also need a binary predicate to tell us whether we should apply the transformation, and we need a binary transformation to merge two objects into one.

So far, our function looks like this:

    template <
          typename MultiPassIOIterator
        , typename BinaryPredicate
        , typename BinaryMergeTransform
    >
    MultiPassIOIterator conditionalInPlaceMerge(
          MultiPassIOIterator cur
        , MultiPassIOIterator end
        , BinaryPredicate predicate
        , BinaryMergeTransform merge)

Now, we know we will be needing to look at whatever is under our `cur`sor, and whatever is `next`, and we will need to do that as long as both aren't at the `end` of the sequence:

        MultiPassIOIterator next(cur + 1);
        while ((cur != end) && (next != end))
        {

Now comes the fun stuff: if the predicate returns true for the pair of objects, we merge them and consume the second object when doing so.

            if (predicate(*cur, *next))
            {
                *cur = merge(*cur, *next);
                move(next + 1, end, next);
                --end;
            }

This is why we need the iterator to be bidirectional: we just backed up `end` because our sequence got shorter.

Note that in C++03, you'd use `copy` rather than `move`, which is why "copying is cheap" was important.

Now, if the two don't match, we move the two iterators along:

            else
            {
                ++cur;
                ++next;
            }
        }

and when we're done, we return where we are:

        return (cur != end) ? next : end;
    }

A [complete example](http://ideone.com/jsLf0h):