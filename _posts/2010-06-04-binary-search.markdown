---
author: rlc
comments: true
date: 2010-06-04 22:54:47+00:00
layout: post
permalink: /blog/2010/06/binary-search/
slug: binary-search
title: Binary Search
wordpress_id: 730
categories:
- C &amp; C++
- C++ for the self-taught
- Science
- Software
- Software Design
- Software Development
tags:
- Posts that need to be re-tagged (WIP)
---

While going through some old code, for another article I'm writing that will come up on the blog, I came across an implementation of binary search in C. While the implementation itself was certainly OK, it wasn't exactly a general-purpose implementation, so I thought I'd write one and put it on the C++ for the self-taught side of my blog. While I was at it, I also analyzed
<!--more-->
Now, as I'm posting this on the "educational" part of the blog, I'll go through it bit by bit and explain what each bit means.



### Caveats


First, there are a few things that should be noted about this search algorithm: 

  * the binary search algorithm only works if the range in which it is to search is _sorted_
  * The way it is implemented here, the `binarySearch` function works on two iterators, each delimiting the range in which to search. You should be familiar with ranges when you read this code.
  * In terms of iterator concepts, this function requires multi-pass input iterators.




### The Algorithm


The binary search algorithm is basically a recursive algorithm: it splits the search space in two. If it finds the value is is looking for in the middle, it returns the middle position. Otherwise, if the value it is looking for is smaller than the value in the middle, it must be to the left. If it's larger, it must be to the right. Thus, if you have an array with values 1, 2, 3, 4, 5 and you're looking for value 3, it will find it at the first try. If you're looking for value 1, it will do: 
    
    
    3 < 1? - nope
    1 < 3? - yep - go left
    2 < 1? - nope
    1 < 2? - yep - go left
    1 < 1? - nope
    1 < 1? - nope
           - by Jove! I think we've got it!

so it will find it on the third iteration, after six comparisons.



#### The efficiency of binary search


Binary searches are very efficient if you have a large search space - if the range you're looking in is large. That's because with each pair of comparisons you split the search space in half, so if you're looking for a value in, say, a million entries, the binary search algorithm will find it in at most 20 steps - at most 40 comparisons, by its rapid reduction of the search space (1,000,000; 500,000; 250,000; 125,000; 62,500; 31,250; 15,625; 7,812, 3,906, 1,953; 977; 488; 244; 122; 61; 30; 15; 7; 3; 1). A linear search, on the other hand, could need to do up to a million steps for the same search space and up to two million comparisons.

In terms of _complexity_, which is what we normally use to compare algorithms, this means that [latex]f(n) = O(\log^{2}(n))[/latex] as [latex]n \rightarrow \infty[/latex]. That is: the number of operations the algorithm has to perform is some constant factor of a two-based logarithm of [latex]n[/latex] where [latex]n[/latex] is the number of elements in the array being searched in. This is what is meant with what is called the "O notation": it is an approximation of how the number of operations the algorithm has to perform on a given set in order to do its job changes as the size of the set changes. It is not, however, an approximation of the _rate of change_ of the amount of operations the function has to perform, though it is meant to give an indication of that rate of change. Rather, it is an approximation of the amount of work itself.

The actual amount of work for this function is [latex]f(x) = 2\log^2(n) + 1[/latex]. The reason why [latex]\ln(n)[/latex] is a good approximation is precisely because the rate of change of these two functions is similar. I.e. [latex]\frac{d}{dn}\ln(n) = \frac{1}{n}[/latex] whereas [latex]\frac{d}{dn}2\log^2(n) + 1 = \frac{2}{x\ln(2)}[/latex] which is to say that the rate of change of [latex]2\log^2(n) + 1[/latex] is a constant factor of the rate of change of [latex]\ln(n)[/latex]. That factor, which is about 2.89, becomes negligible when [latex]n[/latex] becomes large - i.e. both graphs tend to an almost horizontal line if you'd plot them because [latex]\mathop{\lim}\limits_{n \rightarrow \infty}\frac{1}{n} = 0[/latex] and 0, multiplied by any constant, is still 0.



#### Equivalence vs. Equality


If you've been working with sorted containers in C++ for a while, you may have noticed that in order for a type to be usable as a key in a `set` or a `map`, it has to define `operator<`. Still, finding a value in a map of integers will always point to the right place - it won't return the lower bound. Why is that?

I'll answer that question with a puzzle: in the following code:

    
    assert(!(x < y));
    assert(!(y < x));
    assert(x == y);

if the first two assertions hold (i.e. `x` is not smaller than `y` and `y` is not smaller than `x`) does the third assertion also hold?

The answer is, perhaps surprisingly, no. If that does surprise you, consider the following class: 
    
    struct C
    {
    	/* ... */
    
    	bool operator<(const C & rhs) const
    	{
    		return key_ < rhs.key_;
    	}
    
    	bool operator==(const C & rhs) const
    	{
    		return key_ == rhs.key_ &&
    			something_else_ == rhs.something_else_;
    	}
    
    	/* ... */
    	int key_;
    	int something_else_;
    };

This example class implements both `operator<` and `operator==` but, in `operator<`, takes only its `key_` member into account. This is not only perfectly legal, it is also very common. If the class models a row in a database, for example, you'd want to compare the rows according to an index. This mechanism also allows you to compare for _equivalence_ rather than _equality_.

The binary search algorithm implementation, below, also uses equivalence rather than equality to find its target value. The reason why it can do that is because the range it searches in is sorted, presumably using the same less-than predicate as the one provided to the function, meaning the elements in the range are less-than comparable. In effect, the predicate must provide _strict weak ordering_ in that if we call the predicate [latex]f[/latex], [latex]f(x, x)[/latex] must be false;  [latex]f(x, y)[/latex] implies [latex]not f(y, x)[/latex]; [latex]f(x, y)[/latex] and [latex]f(y, z)[/latex] implies [latex]f(x, z)[/latex]; and finally: [latex]not f(x, y)[/latex] and [latex]not f(y, x)[/latex] and [latex]not f(y, z)[/latex] and [latex]not f(z, y)[/latex] implies [latex]not f(x, z)[/latex] and [latex]not f(z, x)[/latex] - i.e. if x and y are equivalent and y and z are equivalent, x and z are also equivalent. These axioms are called _Irreflexivity_, _Antisymmetry_, _Transitivity_ and _Transitivity of equivalence_, resp.



#### Iterator requirements


The code below uses a range, delimited by two iterators: [latex][first, last)[/latex] meaning `last` will never be dereferenced. It will return `last` if it can't find what it's looking for. The iterators are expected to implement `operator+` which is taken to be the equivalent of `std::advance` in that the expression `i2 = i1 + n` should be equivalent to `i2 = i1; i2 = advance(i2, c);`. Any iterator within this range may be dereferenced more than once (i.e. twice) and any position in this range may be passed over more than once (i.e. up to [latex]\log^2(n)[/latex] times). The algorithm never takes the address of a value referred to by an iterator, so a dereferenced iterator does not need to yield an lvalue. The algorithm also never backs up an iterator, so backward moving of the iterator does not need to be supported.

This means that the iterators may be immutable forward-moving multi-pass iterators that do not yield lvalues. This is the equivalent of what Boost calls a MultiPassInputIterator.



#### The code


The following is complete code to the algorithm we just analyzed, in C++.

    
    template < typename InIter, typename V, typename L >
    InIter binarySearch(InIter first, InIter last, V value, L less)
    {
    	using std::distance;
    
    	InIter end = last;
    	InIter retval = end;
    	bool done = false;
    	do
    	{
    		if (first == last)	// empty range
    		{
    			done = true;
    		}
    		else
    		{ /* range not empty */ }
    		InIter mid(first + (distance(first, last) / 2));
    		// at this point, mid could be first, but not last
    		if (less(*mid, value)) // value should be to the right
    		{
    			first = ++mid;
    		}
    		else if (less(value, *mid)) // value should be to the left
    		{
    			last = mid;
    		}
    		else // value is equivalent to *mid
    		{
    			retval = mid;
    			done = true;
    		}
    	} while (!done);
    
    	return retval;
    }
    
    template < typename InIter, typename V >
    InIter binarySearch(InIter begin, InIter end, V value)
    {
    	return binarySearch_(begin, end, value, std::less< V >());
    }
    
    int main()
    {
    	int values[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
    	int * const begin = values;
    	int * const end = begin + (sizeof(values) / sizeof(values[0]));
    	int * zero = binarySearch(begin, end, 0);
    	int * one = binarySearch(begin, end, 1);
    	int * two = binarySearch(begin, end, 2);
    	int * three = binarySearch(begin, end, 3);
    	int * four = binarySearch(begin, end, 4);
    	int * five = binarySearch(begin, end, 5);
    	int * six = binarySearch(begin, end, 6);
    	int * seven = binarySearch(begin, end, 7);
    	int * eight = binarySearch(begin, end, 8);
    	int * nine = binarySearch(begin, end, 9);
    	int * ten = binarySearch(begin, end, 10);
    
    	printf(
    		"values:\t%p\n"
    		"begin:\t%p\n"
    		"end:\t%p\n"
    		"zero:\t%p\n"
    		"one:\t%p\n"
    		"two:\t%p\n"
    		"three:\t%p\n"
    		"four:\t%p\n"
    		"five:\t%p\n"
    		"six:\t%p\n"
    		"seven:\t%p\n"
    		"eight:\t%p\n"
    		"nine:\t%p\n"
    		"ten:\t%p\n"
    		, values
    		, begin
    		, end
    		, zero
    		, one
    		, two
    		, three
    		, four
    		, five
    		, six
    		, seven
    		, eight
    		, nine
    		, ten
    		);
    
    	assert(zero && (*zero == 0));
    	assert(one && (*one == 1));
    	assert(two && (*two == 2));
    	assert(three && (*three == 3));
    	assert(four && (*four == 4));
    	assert(five && (*five == 5));
    	assert(six && (*six == 6));
    	assert(seven && (*seven == 7));
    	assert(eight && (*eight == 8));
    	assert(nine && (*nine == 9));
    	assert(ten && (ten == end));
    
    	return 0;
    }





### Conclusion


I've analyzed the binary search algorithm, demonstrated its computational complexity (and explained what that means), analyzed and explained the requirements of iterators used with this algorithm, and explained the requirements of a predicate used with this algorithm. None of this is new or innovative, but I'm hoping it's at least interesting.

Questions will be met with answers.

Here's a question, though: when does it become more efficient to sort your set before searching in it?

Depending on your search algorithm, you can expect its computational complexity to be about [latex]O(n\ln(n))[/latex], so the complexity of sorting and then searching, if done once, is [latex]O(n\ln(n) + \ln(n))[/latex]. This is almost certainly more than [latex]O(n)[/latex]. However, if you start repeating the search [latex]m[/latex] times, the complexity of a linear search becomes [latex]O(mn)[/latex] while that of a sort + binary search becomes [latex]O(n\ln(m) + m\ln(n))[/latex], so the amount of work to be done now depends not only on the size of the set, but also on the number of searches you want to do. There is, therefore, no _optimal_ solution unless you know either the size of your set, or the number of times you're going to search in it. As a rule, though, the rate of change for any given x of [latex]z = y\ln(x) + x\ln(x)[/latex] is smaller than the rate of change of [latex]z = yx[/latex] for the same x, so if you know the size of your set, you can determine fromwhich point it is advantageous to sort before you search. I.e., that is when [latex]xy = y\ln(x) + x\ln(x)[/latex] for that x, so [latex](x - \ln(x))y = x\ln(x)[/latex], so [latex]y = \frac{x\ln(x)}{x - \ln(x)}[/latex]. For large X, that amounts to [latex]y \approx \ln(x)[/latex]
