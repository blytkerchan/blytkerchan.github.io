One of the things I do as a analyst-programmer is write software - that would be the "programmer" part. I usually do that in C++ but, sometimes, when the facilities of C++ aren't available (e.g. no exception handling and no RTTI) C becomes a more obvious choice. When that happens, RTTI is not the thing I miss the most - you can get around that using magic numbers if you need to. Exceptions, on the other hand, become a very painful absence when you're used to using them.

<!--more-->

Error handling is a very important part of programming: a lot of things can go wrong when a program runs and most of those things need to be handled properly because the functionalities of your program depend on them. C++ uses exceptions for this purpose, so that if a call to `foo` fails, you don't have to handle that failure in the context of your call - especially if you wouldn't be able to do anything about it anyway. Thus, the following code:

    foo();
    bar();

will call `bar` only if `foo` didn't throw any exceptions. Presumably both do something useful and neither of them return anything useful. Now, the same thing would be true in C if we did something like this:

    int result = foo();
    if (result == 0) result = bar();

Now, both foo and bar return a result code which, in this case, is 0 if all is well. Windows programmers will be more familiar with this:

    HRESULT result = foo();
    if (SUCCEEDED(result)) result = bar();

which amounts to the same thing. `HRESULT`, after all, is a 32-bit unsigned integer of which a few bits are reserved to indicate where the error originated and the other bits indicate the error. An `HRESULT` value of 0 means no error, so the `SUCCEEDED` basically checks whether the result is 0.

The trouble starts when the function returned an integer already - e.g. a `getFooCount` function:

    unsigned int foo_count(getFooCount());
    foo(foo_count);

In this code, `foo` only gets called when `getFooCount` returns a valid value - which is the function's post-condition, so it would have thrown an exception otherwise. There are two different ways to port this to C:

    unsigned int foo_count = getFooCount();
    if (isValidFooCount(foo_count)) foo(foo_count);

or:

    unsigned int foo_count;
    int result = getFooCount(&foo;_count);
    if (result == 0) foo(foo_count);

In the first version, foo_count can contain an "invalid" (reserved) value indicating a failure in getFooCount. In the second version, there is no such reserved value: all possible foo counts are valid and errors are reported separately.

These two approaches have been discussed over and over again over the years, and I have personally switched sides more than once on this issue: there is no clear one-size-fits-all answer to error reporting in C like there is in C++ ("just throw an exception"). Here's why:

1. return values can be ignored  
   This is true both in C and in C++, but the same isn't true for exceptions: if you try to ignore those your program will crash

2. sometimes it's just not practical to go either one of these two ways

For example: an allocation function usually returns a pointer, which can be NULL if something went wrong. Arguably, it's not practical to write:

    T * p;
    int result = T_alloc(&p;);

because pointers already have a standard special value.

On the other hand, it may not be practical to _assume_ that, e.g., it is impossible to have a certain number of "foo"s and just reserve arbitrary values for errors. Similarly, returning a "special" value from a function doesn't tell you why the error ocurred - you need a global like `errno` or a function like `GetLastError` for that and that may not be practical either.

The first objection, that return values can be ignored, is true in any case: it is a by-product of the way C was originally implemented and the jury is still out on whether that's a good thing or not. Other languages, such as Ada, impose reading the return value and can therefore introduce a feature such as return value overloading (overloading a function of which the only difference is the return value) but that, for the moment, is off-topic. For now, we'll just have to live with this particular limitation.

The second objection is far more important and it begs two questions: how practical should error handling be and how much information should be available when handling errors?

When I started programming C (after I'd done some Basic, some Pascal and some assembler for 16-bit X86 machines) I drew up a model of how programs should run. This is quite a while ago and I was pretty young and naive at the time, but one of the main features of the model was the way errors were handled. There was a single "run control" variable (aptly named `rc`) that was 0 most of the time but when an error occured, the value of this variable was changed. Any function I wrote checked the run control variable before doing anything and, unless it was a function that was supposed to do something about the error, would simply refuse to do anything if the run control variable wasn't 0.

Like I said, I was young and naive (I will let you guess how young) at the time and there are a few things I would do differently, but thinking back to my old model I see the beginnings of a state machine, and I see something that I've seen over and over again going through other people's code: a global state variable indicating the system's health. (Come to think of it, the C programming language works in much the same way: the `errno` variable is, in many ways, a "run control" variable - except that nothing is defined to not work if errno isn't 0.)

Real state machines aren't just for error handling, of course: they are designed to handle triggers in such a way that those triggers may or may not provoke state transitions which, in turn, make the state machine react differently to subsequent triggers. Let's take a look at what a simple but real state machine written in C might look like (generic implementation):

     // StateMachine.h
     #ifndef STATEMACHINE_H
     #define STATEMACHINE_H

     #define STATEMACHINE_OK							0
     #define STATEMACHINE_PRECOND_FAILED				0x80000000
     #define STATEMACHINE_NO_HANDLER_FOR_CURR_STATE	0x80000001
     /* any value from STATEMACHINE_USER_ERROR up is reserved for use by
      * user-defined trigger handlers */
     #define STATEMACHINE_USER_ERROR					0x80010000

     #define STATEMACHINE_ISERROR(s)					((s) & 0x80000000)

     typedef unsigned int StateMachineError;

     #define StateMachine_stateCount__ 10
     typedef struct StateMachine_tag StateMachine;
     typedef StateMachineError (*StateMachine_triggerHandler)(
     	StateMachine * handle, unsigned int trigger);

     StateMachineError StateMachine_init(StateMachine * handle);
     void StateMachine_fini(StateMachine * handle);
     StateMachineError StateMachine_trigger(
     	StateMachine * handle,
     	unsigned int trigger);
     StateMachineError StateMachine_setState(
     	StateMachine * handle,
     	unsigned int state);
     StateMachineError StateMachine_setTriggerHandler(
     	StateMachine * handle,
     	unsigned int state,
     	StateMachine_triggerHandler handler);

     #endif



     // StateMachine.c
     #include "StateMachine.h"

     struct StateMachine_tag
     {
     	unsigned int state_;
     	StateMachine_triggerHandler handler_[StateMachine_stateCount__];
     };

     StateMachineError StateMachine_init(StateMachine * handle)
     {
     	memset(handle, 0, sizeof(StateMachine));
     	handle->state_ = 0;
     	return 0;
     }

     void StateMachine_fini(StateMachine * handle)
     {
     	/* no-op */
     }

     StateMachineError StateMachine_trigger(
     	StateMachine * handle,
     	unsigned int trigger)
     {
     	StateMachineError result = STATEMACHINE_OK;
     	if (handle == 0)
     	{
     		result = STATEMACHINE_PRECOND_FAILED;
     		goto end;
     	}
     	else
     	{ /* all is well so far */ }
     	if ((handle->state_ <= StateMachine_stateCount__) &&
     		handle->handler_[handle->state_])
     	{
     		result = (handle->handler_[handle->state_])(handle, trigger);
     	}
     	else
     	{
     		result = STATEMACHINE_NO_HANDLER_FOR_CURR_STATE;
     	}

     end:
     	return result;
     }

     StateMachineError StateMachine_setState(
     	StateMachine * handle,
     	unsigned int state)
     {
     	StateMachineError result = STATEMACHINE_OK;
     	if (handle == 0)
     	{
     		result = STATEMACHINE_PRECOND_FAILED;
     		goto end;
     	}
     	else
     	{ /* all is well so far */ }
     	handle->state_ = state;

     end:
     	return result;
     }

     StateMachineError StateMachine_setTriggerHandler(
     	StateMachine * handle,
     	unsigned int state,
     	StateMachine_triggerHandler handler)
     {
     	StateMachineError result = STATEMACHINE_OK;
     	if (handle == 0 || state >= StateMachine_stateCount__)
     	{
     		result = STATEMACHINE_PRECOND_FAILED;
     		goto end;
     	}
     	else
     	{ /* all is well so far */ }
     	handle->handler_[state] = handler;

     end:
     	return result;
     }

If you want to use this code, go ahead. All you have to do to change the number of available states is change `StateMachine_stateCount__`. Note that this code hasn't been properly tested yet - feel free to post corrections.

State machines aren't designed to do error handling, and the state shouldn't normally be used to indicate what kind of error occured most recently.

Of course, the `errno` variable doesn't actually constitude a state machine, as there are neither state transitions nor is the value of the variable actually used for anything in the standard library (it is mostly only written to). That said, the `errno` variable in C may be useful for many things and was probably the best thing we had at the time, but it is no longer the best way to do error handling and copying its mechanism is not necessarily a bad idea, but not necessarily a good one either.

So, what constitutes a good error handling mechanism in C? For one thing, it should provide the necessary information: "what", "when", "why" and "how". We don't really care about "who" - version control can tell us that much. However, we do need to know _what_ went wrong, we may need to know _when_ it happened, we need to know the cause, or _why_ it happened (we usually won't be able to get the root cause without some analysis) and we need to know _how_ it happened.

Let's have a look at some existing error handling mechanism to see if they're up to speed. The `errno` method - and equivalent systems - clearly aren't. How many times I've run into "The parameter is incorrect" without the slightest clue as to which parameter and in which function, I don't care to recall, but I do know it's too many times to consider this an adequate approach to error handling.

OpenSSL has a far better, and far more comprehensive, error handling system. As with most libraries written in C, most functions return 0 if all is well or non-zero if all isn't well, indicating an error but, as with many libraries, that convention isn't followed all the way through. File handles, for example, are returned from functions and are -1 if invalid. Idem for pointers and many other values - so basically they use "special" return values to know whether something went wrong or not. However, when something does go wrong, OpenSLL stores all the necessary information about the error in a queue. The information stored is the library (OpenSSL consists of many libraries behind the scenes. The one that ran into the error is stored as an integer); the function (also stored as an integer); the reason (another integer); the file (a string) and the line number (an integer again). This information is packed into a structure that is stored in a queue (see crypto/err/err.{c,h} for details on how this is done). The queue is circular and has a maximum of 16 entries (by default: compile-time constant). When there are too many, the oldest error is dropped in favor of the newer one.

Having a queue of errors is very useful: if, for example, you have three functions that call each other, like this:

    int foo()
    {
    	int result = 0;
    	/* do something */
    	result = bar();
    	/* do something */
    	return result;
    }

    int bar()
    {
    	int result = 0;
    	/* do something */
    	result = baz();
    	/* do something */
    	return result;
    }

    int baz()
    {
    	/* do something */
    	return 0;
    }

Anything could go wrong in any of these three functions for any reason imaginable. If `baz` fails, that just might mean that `bar` fails as well and if `bar` fails, so will `foo`. Each of these might have some information on the failure that `baz` doesn't have, though. In C++, such additional information can be handled by catching the exception object, adding the information to it or wrapping it in another exception object and throwing the (new) exception. In C, there is no such thing as an exception object so the next best thing is just what OpenSSL does: store the error information in a location where it can be found when we're done unrolling the stack (returning error codes). That way, baz can register its error information before returning an value indicating an error has returned; bar can register its error information (indicating, for example, why it called baz in the first place) and return an error code in its turn, and foo can do the same. The function that called foo now has all the information it needs to know:

- **what** went wrong - which post-condition was not met, what action(s) did not take place, what action(s) failed
- **when** it happened (assuming the error information is time-stamped, which is not the case in OpenSSL errors)
- **why** the function that was being called was called, and perhaps why it didn't work
- **how** we got to where we were and how it went wrong
- etc.

There are a few rules that are commonly applied to software written in C. One of those rules, which tends to make debugging easier, is that any function should only have a single exit point - a single return at the end of the function. Often, this rule is bent a bit by also allowing functions to return immediately if pre-conditions are not met, but it also often results in code like this:

    int foo()
    {
    	int result = 0;
    	/* do something */
    	result = bar();
    	if (result) goto end;
    	/* do something */

    end:
    	return result;
    }

I have nothing fundamentally against `goto` nor do I have anything against this practice - i.e. I've been known to apply it when it was warranted. You should remember, though, that C doesn't have RAII, so there are some caveats. For example, you may need more than one end label if there's clean-up to do:

    Foo * Foo_alloc()
    {
    	int result;
    	Foo * foo = malloc(sizeof(Foo));
    	if (!foo) goto end;
    	result = bar();
    	if (result) goto clean_end;
    	goto end;
    clean_end:
    	free(foo);
    	foo = 0;
    end:
    	return foo;
    }

C++ programming guidelines usually don't have this particular rule because C++ has RAII, which can be used for locks as well as for any other type of resource, so there's really no advantage to having only a single exit point. Also, any function that doesn't offer the no-fail guarantee can be an exit point if you don't catch whatever it throws at you. But what if you had exceptions in C?

Tom Schotland and Peter Petersen wrote an [article](http://www.on-time.com/ddj0011.htm) describing exception handling in C and created a mechanism that closely resembles C++ exceptions. They use "finally" handlers to take care of the clean-up (which is why their `XEND` macro calls `longjmp` and effectively throws an exception) and they use `setjmp` and `longjmp` to do the exception-throwing and catching itself. This is a standard mechanism that is designed exactly for this purpose, so they are quite right to do so, but there are some caveats they note - most notably the need to use `volatile` for some local variables for the behavior to be as expected - and some they don't. There are also some caveats [using setjmp in nests](http://stackoverflow.com/questions/1381937/setjmp-longjmp-why-is-this-throwing-a-segfault), which I don't believe their mechanism handles correctly (but I might be mistaken: I only read the article, I didn't try the code). Also, this method doesn't answer all the questions about an error that we want answered - though that could arguably be arranged.

Finally, an alternative method to error handling is the one employed by IBM's MQ implementation though that does take a lot of the automatism out of error handling and returns us to a state variable that makes the implementation stop working.

So what's the best way? I'm afraid there's no one-size-fits-all solution and the right solution (again) depends on your context. Personally, I like to mix and combine the OpenSSL method with the return code method and may use state variables on occasion. I don't use `setjmp`/`longjmp` because I find it too complicated to maintain and too difficult to explain in C. If I wanted exceptions in C (really wanted them - not just missed them while writing C) I'd implement the exception-handling part of the Itanium C++ ABI, or something similar but less complicated. Note, though, that that really boils down to the same combination of OpenSSL-style stocking of an exception object with a status (reason) code, to which unwinding support is added by installing unwind "landing pads".