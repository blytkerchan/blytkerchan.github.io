As far as error handling is concerned, C++ has all of the features and capabilities of C, but they are wholly inadequate in an object-oriented language. One very evident way in which C-style error handling is inadequate in an object-oriented language is in the implementation of a constructor of any non-trivial class, but this only becomes evident when we've analyzed two things: the guarantees that any method (including special methods such as constructors and destructors) can give, and the _minimal_ guarantees that each of these special methods _must_ give.

<!--more-->

## A Contractual Basis for Exception-Safety

David Abrahams, of Boost, in 2001, wrote what may be considered today as the one canonical reference argument on exception safety, in which he introduces the concept of "a contractual basis for exception-safety". The article I'm referring to is, of course, [Exception-Safety in Generic Components](http://www.boost.org/community/exception_safety.html). This article builds on two fundamental parts of object-oriented design: contract theory and error reporting by exceptions, and combines the two into a single, coherent whole.

### Contract Theory

In its most basic form, contract theory can be seen as the establishment and definition of a contract between a provider of a service (e.g. a class) and the user of that service (e.g. the class' client code). That contract consists of pre-conditions which the user must provide for before calling the class, and post-conditions which the class must provide for before returning to the client code. A simple example might look like this:

    class Stack
    {
    public :
    	struct Node
    	{
    		Node *next_;
    		int value_;
    	}

    	Stack()
    	{
    		anchor_.next_ = &anchor;_;
    	}

    	~Stack()
    	{
    		// clean up any nodes here...
    	}

    	Stack(const Stack &stack;)
    	{
    		// perform a deep copy here
    	}

    	Stack& operator(Stack stack)
    	{
    		return swap(stack);
    	}

    	Stack &swap;(Stack &stack;) throw()
    	{
    		Node *tmp = anchor_.next_;
    		anchor_.next_ = stack.anchor_.next_;
    		stack.anchor_.next_ = tmp;
    		return *this;
    	}

    	bool empty() const
    	{
    		return anchor_.next_ == &anchor;_;
    	}

    	void push(int i)
    	{
    		Node *new_node(new Node);
    		new_node->value_ = i;
    		new_node->next_ = anchor_.next_;
    		anchor_.next_ = new_node;
    		post_condition(top() == i);
    	}

    	int top() const
    	{
    		pre_condition(!empty());
    		return anchor_.next_->value_;
    	}

    	void pop()
    	{
    		pre_condition(!empty());
    		Node *node = anchor_.next_;
    		anchor_.next_ = node->next_;
    		delete node;
    	}

    private :
    	Node anchor_;
    };

This arguably useless and overly complicated stack implements two methods that check their pre-conditions: `top` and `pop`, and push checks its post-condition. Both top and pop also have post-conditions, but they are a bit more difficult to check, so we'll leave that out for now.

Often, a notion of _invariants_ is added to contract theory. An invariant is an assertion that must always hold true for a given object. In our stack, for example, one of its invariants would be that the anchor is always reachable by following the `next_` pointers.

An implicit post-condition of any mutator of the object is that it re-establishes all invariants before returning. The state of an object of which all invariants hold true is said to be _coherent_

### The purpose of exceptions

From a point of view of contract theory, exceptions have a single purpose: they tell you that a post-condition could not be established. Ideally they also tell you _why_ the post-condition could not be established.

In C++, exceptions are best identified by their _type_ because they can be caught by their type. The standard library distinguishes between two kinds of exceptions, run-time errors and logic errors. The former signifies an error that may not have been forseeable at the time you were programming your error, the latter is a bug. It is usually pretty straight-forward to distinguish between the two: breaking a pre-condition, for example, is always a logic error - you should have known better. That is only fair, however, if you could have checked. For example: if I had omitted the `empty` accessor from the `Stack` above, there would have been no way for you to know that the container is empty, and therefore no way to respect the pre-condition for `pop` or `top`. Similarly, not being able to open a file is always a run-time error: more often than not, there is no way to know whether you will succeed other than just trying.

Things become murky pretty quickly, though. For example: is a failure to allocate an amount of memory always a run-time error? Even if the amount of memory requested is -1 bytes? In C++, the answer is "yes" but the merits of this approach are arguable.

Still, the distinction between run-time errors and logic errors is a useful one: in a typical application, the `main` function might look a bit like this:

    int main(int argc, const char **argv)
    {
    	/* ... */
    	try
    	{
    		Application application(/* ... */);
    	}
    	catch (const std::runtime_error &e;)
    	{
    		/* output error including e.what() */
    	}
    	catch (const std::logic_error &e;)
    	{
    		/* output error including e.what() and tell the user to report
    		 * a bug */
    	}
    	catch (const std::exception &e;)
    	{
    		/* output error including e.what() */
    	}
    	catch (...)
    	{
    		/* output unknown error */
    	}
    }

Within the code, exceptions derived from `std::runtime_error` are caught and handled as need be, but if they get out anyway, they are caught in the `main` function and reported. Exceptions that are derived from `std::logic_error` are either not caught or reported when they are, so bugs are reported to the user or logged, sent to the author, etc. - in any case, they can be handled separately.

### The trouble with exceptions

The difficult part of exception handling is resource management. Take a look at this example and try to find all the ways it could go wrong:

    C *p1(new C);
    C *p2(new C);
    C o1(*p1);
    C o2;
    o2 = *p2;
    delete p2;
    delete p1;

This code calls the default constructor of `C`, its copy constructor, its assignment operator as well as its destructor. Any of these (except the destructor if it's well-behaved) could throw an exception. It also calls `new`, which could also throw an exception, so in this code, there are a whopping **seven** readily identifiable places where an exception could be thrown.

If an exception is throw by the `new` operator on line 1, there is no problem: the constructor never gets called and the exception is propagated until it is handled. If an exception is thrown in the constructor on line 1, the memory allocated by `new` is freed, the destructor is _not_ called and the exception is propagated.

Of course, you don't have the code for the `C` class, so you don't know all the ways things could go wrong inside it, nor do you know whether it is well-behaved enough to guarantee that the destructor won't throw an exception.

The only remedy I know for this is to code well-behaved programs and handle all resources - as much as possible - with RAII. It's not like I haven't hammered that particular nail a few times already, but it really does make for exception-safe programs.

### The advantages of exceptions

The most important advantages of using exceptions are:

1. Exceptions cannot be ignored, so all errors will be handled
2. Exceptions automatically propagate up the stack, so if an error isn't handled locally, it can be handled higher up the stack
3. Exceptions are caught by type, so the type system actually gives you the information you need to handle the error - if that's how you want to go about it
4. Exceptions can carry data, so the "when", "what", "how", "why" and "who" can call be carried along with the exception
   This makes for simple and effective error management and can lead to fault-tolerant, reliable software.

## Implementing exceptions

Exceptions are implemented as value-type classes that are thrown by value and caught by reference. The simplest possible exception class would look like this:

    struct E
    {
    };

To be well-behaved, an exception class must give the following guarantees:

1. The default constructor (or whichever constructor is used to construct an instance of the exception class) should not throw, because the information of the original exception would be lost if it did, so it _should_ provide the no-fail guarantee
2. the copy constructor shall provide the no-fail guarantee: the exception object may be copied any number of times (including zero times) so the copy constructor must be publicly accessible and must not throw (or `terminate` may be called)
3. the assignment operator shall provide the no-fail guarantee and shall be guarded against self-assignment: normally, the assignment operator is never called on an exception object, but implementing one that corresponds to this requirement, once the copy-constructor provides the no-fail guarantee, is trivial
4. the destructor shall provide the no-fail guarantee: if an exception is thrown between the `throw` and the `catch`, `terminate` is called
   So a well-behaved exception class with all the bells and whistles might look like this:


    struct E
    {
    	E(int what)
    		: what_(what)
    	{ /* no-op */ }

    	E(const E &e;)
    		: what_(e.what_)
    	{ /* no-op */ }

    	~E()
    	{ /* no-op */ }

    	E& operator=(E e)
    	{
    		return swap(e);
    	}

    	E& swap(E &e;)
    	{
    		int what(e.what_);
    		e.what_ = what_;
    		what_ = what;
    		return *this;
    	}

    	int what_;
    };

This class, however, is not derived from any of the standard exception classes, `std::exception`, `std::logic_error` or `std::runtime_error`. These three classes all use `std::string` arguments in their constructors and carry instances of `std::string` around. This means that in order to be well-behaved, `std::string` practically needs to be a well-behaved exception class as well, as it too needs to be copyable without throwing, etc. For most implementations of `std::string`, this is not a problem. In our own exception classes, we won't count on it, however - though we will count on the standard exception classes to be well-behaved.

This means our first generic exception class will look something like this:

    #ifndef vlinder_exceptions_exception_h
    #define vlinder_exceptions_exception_h

    #include <stdexcept>	// most-used values of B require this
    #include <string>

    namespace Vlinder { namespace Exceptions {
    	template < typename B, typename E >
    	class Exception_
    		: public B
    	{
    	public :
    		explicit Exception_(const std::string &message;)
    			: B(message)
    		{ /* no-op */ }

    		virtual E which() const = 0;
    	};

    	template < typename B, typename E, E v__ >
    	class Exception
    		: public Exception_< B, E >
    	{
    	public :
    		explicit Exception(const std::string &message;)
    			: Exception_< B, E >(message)
    		{ /* no-op */ }

    		virtual E which() const { return v__; }
    	};
    }}

    #endif

which can be used as follows:

    enum Error {
    	potato_too_cold__,
    	potato_too_hot__,
    };

    typedef Vlinder::Exceptions::Exception_< std::runtime_error, Error > PotatoError;
    typedef Vlinder::Exceptions::Exception< std::runtime_error, Error, potato_too_cold__ > PotatoTooCold;
    typedef Vlinder::Exceptions::Exception< std::runtime_error, Error, potato_too_hot__ > PotatoTooHot;

## The inadequacies of C-style error handling

As I mentioned in the introduction, C-style error handling is wholly inadequate in C++, as soon as you start doing object-oriented programming. The best illustration of this is handling errors in a non-trivial constructor.

Consider the following expression:

    C *c = new C;

and consider what would happen if we didn't have exceptions - i.e. consider the way this would be handled in C:

    C *c = 0;
    c = C_alloc();
    CErr err;
    if (!c)
    {
    	// try to find out what went wrong
    	// try handle the error
    	// return with an error code that will probably be ignored
    }
    else
    { /* all is well, so far */ }
    err = C_init(c);
    if (err != C_NO_ERROR)
    {
    	switch (err)
    	{
    	case C_... :
    		// try to handle the error
    		// return with an error code that will probably be ignored
    	}
    }
    else
    { /* whew! we survived! */ }
    err = C_doSomething(c);
    ... etc. ...

A slightly better version would return an error code from `C_alloc` and accept a pointer to a pointer to `C` as an argument to fill in, but it remains tedious and error-prone, especially when the error really can't be adequately handled locally. The C++ equivalent looks like this:

    C *c = new C;
    c->doSomething();
    ... etc. ...

Now, if the error can be handled locally, it would be slightly different:

    try
    {
    	C *c = new C;
    	c->doSomething();
    	... etc. ...
    }
    catch (const C::FileSystemError &e;)
    {
    	// C had a problem using the filesystem
    	// details are in e
    }
    catch (const C::QueryError &e;)
    {
    	// C couldn't query something. Details are in the object e
    	// handle it
    }
    catch (const std::bad_alloc &)
    {
    	// handle failed allocation
    }
    catch (const std::exception &e;)
    {
    	// unexpected error - details are in e
    }
    catch (...)
    {
    	// unknown error
    }

Of course, this code at first glance, doesn't look any more terse, but the difference becomes apparent when you start to realize that all the "normal" non-error-handling code is between the `try` and the first `catch`. Also, as exceptions are objects, the `C::FileSystemError` object could contain important information not contained in a function return code, such as which file was being accessed, what the exact failure was, etc. The whole point of reporting an error is to allow the user to remedy the situation (if at all possible), so such information can be very important in deed.

C libraries, and C++ libraries that refuse to use exceptions for some mis-guided reason, often have a single enumerator with a whole bunch of error codes, one for each error, so the code starts to look like this:

    C *c = new C; // new has been crippled: it can't throw. C constructor guarantees no-fail
    if (!c) goto end;
    CErr err = c->init(); // initializer that might fail, but won't throw
    if (err != C_NO_ERROR) goto end;
    err = c->doSomething();
    if (err != C_NO_ERROR) goto end;
    ... etc. ...

    err :
    if (c)
    {
    	c->deInit();
    }
    delete c;
    return err;

At any point in this code, the `c` may be in a "bad state" and at any point in this code, an error may be accidentally ignored. This kind of code eventually becomes a burden to maintain - especially if there's more than one object to work with. I can't tell you how many times I've seen a function return an all-is-well code at the end regardless of any errors that may have occurred, and how many hours I've wasted trying to find the reason why an application wasn't working properly, while there was no apparent error.

Exceptions won't allow that to happen.

Not using exceptions in C++ forces you to revert to C-style error handling and forces you to provide the no-fail guarantee in your constructors (because constructors cannot return a value). This is bothersome and error-prone - but it's your choice. Cases in which this choice is really defenisble are rare and dying out. The only real one I know is a restriction involving support for a C-with-classes compiler such as MSVC6.

## Conclusion

I have shown what exceptions are for, how to implement them, how to use them and how C-style error handling is inadequate for C++ object-oriented programming. There's arguably a lot more to be said about error handling in C++ and our first implementation of a generic exception class leaves a few things to be desired. Regardless, it is available on [the git server as the Exceptions project. You'll also find macros for use with contract theory there.

Questions, answers, comments and suggestions are welcome as always.