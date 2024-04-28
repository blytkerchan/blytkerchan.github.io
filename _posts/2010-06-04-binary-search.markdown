---
author: rlc
comments: true
date: 2010-06-04 22:54:47+00:00
layout: post
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

- the binary search algorithm only works if the range in which it is to search is _sorted_
- The way it is implemented here, the `binarySearch` function works on two iterators, each delimiting the range in which to search. You should be familiar with ranges when you read this code.
- In terms of iterator concepts, this function requires multi-pass input iterators.

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

In terms of _complexity_, which is what we normally use to compare algorithms, this means that ![f(n) = O(\log^{2}(n))](/assets/2010/WS4Zl3wRQnicoLCsSbw3KR88pjYJ3ZygjMLDjPEva0lk.svg) as ![n \rightarrow \infty](/assets/2010/eZYVa6jvyoiXIcdcwYf3CKuHzcZk4LsLbWkK1aDgMko6.svg). That is: the number of operations the algorithm has to perform is some constant factor of a two-based logarithm of ![n](/assets/2010/07VFTBpvBkLAmygms7OcEbIioEBwJ5YXOI5L7rS4HpCI.svg) where ![n](/assets/2010/07VFTBpvBkLAmygms7OcEbIioEBwJ5YXOI5L7rS4HpCI.svg) is the number of elements in the array being searched in. This is what is meant with what is called the "O notation": it is an approximation of how the number of operations the algorithm has to perform on a given set in order to do its job changes as the size of the set changes. It is not, however, an approximation of the _rate of change_ of the amount of operations the function has to perform, though it is meant to give an indication of that rate of change. Rather, it is an approximation of the amount of work itself.

The actual amount of work for this function is ![f(x) = 2\log^2(n) + 1](/assets/2010/pp63sHo0uuExV2PjuV2zffHrDHIFp0GIRwphnalcCf2x.svg). The reason why ![\ln(n)](/assets/2010/7ddYpH20LL2RgptDs5VhyjCrMviiQ8OEgfgzyV0jTRcl.svg) is a good approximation is precisely because the rate of change of these two functions is similar. I.e. ![\frac{d}{dn}\ln(n) = \frac{1}{n}](/assets/2010/liEURtvsz3NznoRkN9dIsTBH16TEJahTAIFQXYc7cE4A.svg) whereas ![\frac{d}{dn}2\log^2(n) + 1 = \frac{2}{x\ln(2)}](/assets/2010/tO6hfjAO5hkYtKOWyRsNd7YvqN8wsJhFTbqteRSlvK5y.svg) which is to say that the rate of change of ![2\log^2(n) + 1](/assets/2010/WDCOO1UUXFDDb5dIYKZ6Hhj1iNwskEoImb5vs6FPxebV.svg) is a constant factor of the rate of change of ![\ln(n)](/assets/2010/7ddYpH20LL2RgptDs5VhyjCrMviiQ8OEgfgzyV0jTRcl.svg). That factor, which is about 2.89, becomes negligible when ![n](/assets/2010/07VFTBpvBkLAmygms7OcEbIioEBwJ5YXOI5L7rS4HpCI.svg) becomes large - i.e. both graphs tend to an almost horizontal line if you'd plot them because ![\mathop{\lim}\limits_{n \rightarrow \infty}\frac{1}{n} = 0](/assets/2010/wRPZRCt0st8wgFtQhgaEtRcOZtcRyRsjiCKBmu6Mpf7O.svg) and 0, multiplied by any constant, is still 0.

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

The binary search algorithm implementation, below, also uses equivalence rather than equality to find its target value. The reason why it can do that is because the range it searches in is sorted, presumably using the same less-than predicate as the one provided to the function, meaning the elements in the range are less-than comparable. In effect, the predicate must provide _strict weak ordering_ in that if we call the predicate ![f](/assets/2010/PLdqe1ap9NJLzkCUhlt6nmTwCXKK279ajAXsb5xStp20.svg), ![f(x, x)](/assets/2010/9FQ25NdIivo8sgmiXFOawk5qhxEHH1sVAnvogLHz9Jsy.svg) must be false; ![f(x, y)](/assets/2010/PQubzNsFNgzne4YGZMyTwy2iE23mvQTnkYXyc0NSXc16.svg) implies ![not f(y, x)](/assets/2010/bMt4Q9pFhYLVXObhBvKOnoQZGrQAxS1N0rFBlgfXIMnT.svg); ![f(x, y) and f(y, z)](/assets/2010/1657XngKIkU22ZdF2bc7V8HuSPEftAHhsQXKJdacxxFa.svg) implies ![f(x, z)](/assets/2010/B7OAdm3ircgUKjNCfPLPEhK3ldCpoVkMiXwiLwQjHKWK.svg); and finally: ![not f(x, y) \land not f(y, x) \land not f(y, z) \land not f(z, y)](/assets/2010/cwqhriUih90Lu7BOdhhA9HCrPMeXtLdfmqfOHeTRe3l3.svg) implies ![not f(x, z) \land not f(z, x)](/assets/2010/3SgWBUL5hwrHlaLPtu0ubGR1EoQuT33HJC2Zj3fn8dkB.svg) - i.e. if x and y are equivalent and y and z are equivalent, x and z are also equivalent. These axioms are called _Irreflexivity_, _Antisymmetry_, _Transitivity_ and _Transitivity of equivalence_, resp.

#### Iterator requirements

The code below uses a range, delimited by two iterators: ![[first, last)](/assets/2010/Righ3e1jnYUbzyyPMaAKO2jOcWnl4zMUsQhk4biBD5AQ.svg) meaning `last` will never be dereferenced. It will return `last` if it can't find what it's looking for. The iterators are expected to implement `operator+` which is taken to be the equivalent of `std::advance` in that the expression `i2 = i1 + n` should be equivalent to `i2 = i1; i2 = advance(i2, c);`. Any iterator within this range may be dereferenced more than once (i.e. twice) and any position in this range may be passed over more than once (i.e. up to ![\log^2(n)](/assets/2010/NfQ34CO9qXAL09d7JVN0RWFbkznY5K7qpUghU7KaLWGu.svg) times). The algorithm never takes the address of a value referred to by an iterator, so a dereferenced iterator does not need to yield an lvalue. The algorithm also never backs up an iterator, so backward moving of the iterator does not need to be supported.

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

Depending on your search algorithm, you can expect its computational complexity to be about ![O(n\ln(n))](/assets/2010/TAhrwk5xCedE3rDzeaojjI6KGA1VfHf6Gln1N2wmrujb.svg), so the complexity of sorting and then searching, if done once, is ![O(n\ln(n) + \ln(n))](/assets/2010/buHLYxhgNYxGIgC5DcywTU2a4VytWpyjq6A1XndsWAtW.svg). This is almost certainly more than ![O(n)](/assets/2010/9o9aAtlH2ROSrw8d9aDKdhoxZRXLihsYiu2cET4HxKxG.svg). However, if you start repeating the search ![m](/assets/2010/ZE6cvKh7zHbJmSQN5PL3BCHXFYouG1L1C01E1o8WLJnb.svg) times, the complexity of a linear search becomes ![O(mn)](/assets/2010/M8qULWEVFyVdNPwOfB9eUpeD9qAhJh4Dw2SGGgRBCZ6N.svg) while that of a sort + binary search becomes ![O(n\ln(m) + m\ln(n))](/assets/2010/pGa4lICnXu2IzWVtkZyJB30cSKsD3LqtcHtE4MWeUNYd.svg), so the amount of work to be done now depends not only on the size of the set, but also on the number of searches you want to do. There is, therefore, no _optimal_ solution unless you know either the size of your set, or the number of times you're going to search in it. As a rule, though, the rate of change for any given x of ![z = y\ln(x) + x\ln(x)](/assets/2010/6VkG4tniuplWHix9D8Vm5iEDaRojmMEQAAvSv0Stottw.svg) is smaller than the rate of change of ![z = yx](/assets/2010/bjgBEbOgitI4NyK2PAsJ8YJC0qnvv7bJWuV6D4bdCbJ7.svg) for the same x, so if you know the size of your set, you can determine from which point it is advantageous to sort before you search. I.e., that is when ![xy = y\ln(x) + x\ln(x)](/assets/2010/4qgfEworGWET9diUDUzQsWPqjXa1LaAhJ1x0uKD66MSS.svg) for that x, so ![(x - \ln(x))y = x\ln(x)](/assets/2010/PHGyUhpNZpBA3z4P81rO5ot4Tspwo6waWrpeT02UFCOr.svg), so ![y = \frac{x\ln(x)}{x - \ln(x)}](/assets/2010/J7dOykJ0z6ZaPnBiaqfvgRr0ooLHlv9zroHkWVpfWCgD.svg). For large X, that amounts to ![y \approx \ln(x)](/assets/2010/Zw9zqS5od7BgzWeAxbEQLIPyVP7mhEdupz4p9Wk0hxHF.svg).
