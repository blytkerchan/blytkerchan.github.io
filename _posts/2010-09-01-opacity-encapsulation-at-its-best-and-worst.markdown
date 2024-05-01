---
author: rlc
categories:
- Software Design
- Encapsulation
- Object-Oriented Design
- Error Handling
- Trade-offs
- Security Context
- Negotiation Process
- Context Class
- Credentials Class
- Mechanism Class
- Opaque Design
- Maintainability
- Distributed Architectures
comments: true
date: 2010-09-01 12:00:20+00:00
layout: post
title: 'Opacity: Encapsulation at its best (and worst)'
wordpress_id: 891
---

One thing you may have noticed when looking at the code of our abstract factory, is that the base classes (interfaces) of each of our abstract objects don't have much to tell their users: there are hardly any accessors or mutators to be found. This is an attribute of encapsulation called _opacity_ and in this installment, we'll explore its advantages and disadvantages.

<!--more-->

Let's look at the `Mechanism` class: the base class says very little about the mechanism itself: it doesn't even allow you to get its name. It currently only allows you to get credentials from the current mechanism and will eventually serve as the primary interface to interact with the mechanism. It will not, however, allow you any knowledge as to what that mechanism is. That knowledge, once it is handed to the `MechanismFactory`, is lost (unless you keep it around elsewhere).

The `Credentials` class is arguably even worse: it doesn't allow you to know _anything_ about the credentials and is effectively an opaque handle to the credentials behind them. This will remain true for the most part throughout the development of these libaries.

The opacity of both of these classes illustrates a general design principle that has definite advantages, but also some drawbacks. We will focus only on the opacity-attribute of this principle - the principle being _encapsulation_. The other attributes of the design principle of encapsulation will be handled at another time.

## The general effect of opacity in design

One of the phrases that has become well-known for reasons outside of software design is the reply "that is on a need to know basis". This particular phrase is also a mantra in object-oriented design as far as encapsulation is concerned, and it is why, in our case, the `Credentials` class is completely opaque - and why the `Mechanism` class is not. Each of these classes or, more generally, interfaces (as we are discussing the abstract classes in the `Security` namespace here) exposes nothing more than absolutely necessary in order to use them. When credentials have to be presented somewhere, they will be presented as either a pointer or a reference to an instance of this opaque class, which the code behind the scenes will know significantly more about than the code that lugs the instance around. _Everything_ about these interfaces is on a need to know basis: you don't need to know how to construct an instance of any of these classes, so you are not given the opportunity to even try. You don't need to know what's behind the credentials, so you can't look. You don't need to know how the mechanism works internally, so you don't even get the slightest clue as to how it might work. All you get is what you absolutely need in order to use these classes.

Especially in distributed architectures (not what we are working on right now, but an interesting subject nontheless), this design mantra can be pushed to extremes. Sometimes, this is to the detriment of important functional aspects of the solution, such as its run-time performance: if in order to accomplish a task the program needs to take a "scenic route" to get the information it needs, something is evidently too opaque. The trade-off, however, may be in the maintainability of the program: taking short-cuts for the benefit of run-time performance may make the code very difficult to maintain in the long run. The point is: like everything, encapsulation should be used in moderation.

## Opacity in Chausette

We start seeing how these two classes (`Credentials` and `Mechanism`), and the need to know, are different when we add the _security context_ to the mix. The security context is the context in which authorization takes place. It is established between the server and the client application and it allows both the server and the client to mutually agree on what each may do with the other. The context is the result of a negotiation between the security mechanism implementations on either side of the link. In order to perform this negotiation, the two sides exchange tokes with each other - tokens we already know and have implemented a while ago. Neither SSPI nor GSS dictate how the tokens should be exchanged but both have similar concepts of contexts, so we'll start by implementing the ones for SSPI and adapt our implementation to GSS afterwards.

First, let's take a look at our new `Context` class:

    #ifndef chausette_security_context_h
    #define chausette_security_context_h

    #include "Details/prologue.h"

    namespace Vlinder { namespace Chausette { namespace Security {
    	class VLINDER_CHAUSETTE_SECURITY_API Context
    	{
    	public :
    		virtual ~Context() = 0;

    	protected :
    		Context();

    	private :
    		// neither CopyConstructible nor Assignable
    		Context(const Context &);
    		Context & operator=(const Context &);
    	};
    }}}

    #endif

As you can see, it is an almost exact copy of the `Credentials` class. It won't stay that way but, for now, all we need to know is that such a thing as a context exists - just like all we needed to know about credentials is that they exist.

The negotiation that takes place between the client and the server in order to obtain a context has a variable number of steps and includes the exchange of tokens from either side. The mechanism can fail in several different ways to complete the creation of the context, and some of those failures may be fatal whereas others will not be fatal but will simply imply that more work needs to be done. We need to tell the calling code if anything went wrong, and what to do if that is the case.

The same is not true for credentials: if the mechanism can't create the credentials requested, there can only be very few reasons why that might be so and, although we don't handle those reasons at the moment, handling them will be significantly easier than handling the reasons for failing to create a context.

In [one of my previous posts](/blog/2010/01/error-handling-in-c) I explain what's needed to handle an error correctly (in C, in this case): the calling code needs to know:

- **what** went wrong - which post-condition was not met, what action(s) did not take place, what action(s) failed
- **why** the function that was being called was called, and perhaps why it didn't work
- **how** we got to where we were and how it went wrong

All of this information should be wrapped into an exception class, which will be the subject of my next installment. That exception, however, should only be thrown if there is an actual error: if the failure to create a complete context is simply a result of the negotiation process, the context may not be ready for use, but that is not an error. The context will therefore possibly need to be _partial_ or, alternatively, the mechanism may need to keep it while it is being worked on.

## Trade-offs

As far as opacity is concerned, however, the question becomes how much of this needs to be known to the user: does the user need to know that a given context is ready for use? Should the user have access to a context that is not ready for use yet? Should the user be allowed to interrupt a negotiation and start a new one? Should the user be allowed to have more than one on-going negotiation at the same time?

Each of these questions - or rather, the answers to them - have an impact on the opacity of the negotiation process, which is specific to the implementation of the mechanism; the opacity of the `Context` class and the opacity of the `Mechanism` class.

Let's analyze each of these questions in more detail:

### Does the user need to know that a given context is ready for use?

Of course, the user does need to know that a given context can be used. There will only be a doubt about this, however, if the user has access to contexts that cannot be used - e.g. partial contexts. Later during the life-time of the context a situation might occur in which the context is no longer usable - e.g. when it expires. The user should have a way to know this.

The easiest way to resolve this is to add an accessor to the base class, like this:

    --- a/lib/security/Context.h
    +++ b/lib/security/Context.h
    @@ -9,6 +9,8 @@ namespace Vlinder { namespace Chausette { namespace Security {
     	public :
     		virtual ~Context() = 0;

    +		virtual bool good() const throw() = 0;
    +
     	protected :

     		Context();

Although that doesn't tell the user _why_ a context is not ok to be used, it does give her an indication that such is the case.

### Should the user have access to a context that is not ready for use yet?

This is a trickier question: the negotiation process produces information in its intermediary states that needs to be stored somewhere and ultimately produces the context. The context itself has very little to do with those states, though many implementations will partially construct the context, doing so and returning the context may lead to confusion. On the other hand, it just might be the easiest way to handle the on-going negotiation process.

I see two alternatives: the information pertaining a particular negotiation can be stored in a new `Negotiation` object, which can be created using a `startNegotiation` method on the `Mechanism` class and would eventually be destroyed when the negotiation is either complete or abandoned; or the information can be stored in the `Mechanism` class itself, which would preclude the possibility of having more than one negotiation at a time, which leads to the next two questions.

### Should the user be allowed to interrupt a negotiation and start a new one?

I think the answer to this should be a resounding "yes". That means that regardless of the way we choose to implement negotiations, there must be a way to abort them. If we implement them using a `Negotiation` class, that will amount of destroying the class' instance. If we keep the negotiation information in the `Context` class, destroying the context will destroy the information. If we keep it in the `Mechanism` class, we will have to add a method to abort the on-going negotiation.

### Should the user be allowed to have more than one on-going negotiation at the same time?

I really don't see much reason _not_ to allow this, except if we choose to store the negotiation information inside the `Mechanism` object, in which case it would unnecessarily complicate our implementation.

These are the kinds of trade-offs that the "need to know basis" mantra takes us to: as we analyze our options, we find that the user will have to know that a negotiation is taking place, at least if we want him to be able to have any influence in the matter. As the architecture we have chosen since the beginning leaves the transport of tokens outside of the part of the solution we are currently working on (i.e. there is no concept of a "channel" that we can hand to the mechanism in order for it to talk to its counterpart on the other side) all such communication must necessarily go through the user's code, which means we have to give her _some_ control over the negotiation process. As long as that is the case, I believe that it should be done explicitly, so the negotiation itself should be encapsulated in a `Negotiation` object that, although completely opaque to the user, gives her a handle on the process so she can interrupt it, or manage it as she pleases.

## Conclusion

Encapsulation in general, and opacity in particular, leads to trade-offs as you ask "what does the user need to know?" and "how should I tell her?". In this particular case, we made the negotiation process transparent and thus left a large part of our implementation opaque, but we made the process transparent because the implementation is in the dark as far as communication is concerned. An alternative we haven't discussed is to leave the negotiation opaque by bringing the communication into this part of the implementation. I'll be happy to entertain a discussion on the merits of that solution if there's any interest.

The code ends up looking like this:

    diff --git a/lib/security/Details/Negotiation.cpp b/lib/security/Details/Negotiation.cpp
    new file mode 100644
    index 0000000..d3cda9e
    --- /dev/null
    +++ b/lib/security/Details/Negotiation.cpp
    @@ -0,0 +1,9 @@
    +#include "Negotiation.h"
    +
    +namespace Vlinder { namespace Chausette { namespace Security { namespace Details {
    +	/*virtual */Negotiation::~Negotiation()/* = 0*/
    +	{ /* no-op */ }
    +
    +	Negotiation::Negotiation()
    +	{ /* no-op */ }
    +}}}}
    diff --git a/lib/security/Details/Negotiation.h b/lib/security/Details/Negotiation.h
    new file mode 100644
    index 0000000..ba78bfa
    --- /dev/null
    +++ b/lib/security/Details/Negotiation.h
    @@ -0,0 +1,20 @@
    +#ifndef chausette_security_details_negotiation_h
    +#define chausette_security_details_negotiation_h
    +
    +namespace Vlinder { namespace Chausette { namespace Security { namespace Details {
    +	class VLINDER_CHAUSETTE_SECURITY_API Negotiation
    +	{
    +	public :
    +		virtual ~Negotiation() = 0;
    +
    +	protected :
    +		Negotiation();
    +
    +	private :
    +		// neither CopyConstructible nor Assignable
    +		Negotiation(const Negotiation &);
    +		Negotiation & operator=(const Negotiation &);
    +	};
    +}}}}
    +
    +#endif
    diff --git a/lib/security/Mechanism.h b/lib/security/Mechanism.h
    index 3e9fadd..95a2e2f 100644
    --- a/lib/security/Mechanism.h
    +++ b/lib/security/Mechanism.h
    @@ -4,6 +4,7 @@
     #include "Details/prologue.h"
     #include <memory>
     #include <string>
    +#include "Details/Negotiation.h"

     namespace Vlinder { namespace Chausette { namespace RFC1961 { class Token; }}}
     namespace Vlinder { namespace Chausette { namespace Security {
    @@ -14,8 +15,13 @@ namespace Vlinder { namespace Chausette { namespace Security {
     	public :
     		virtual ~Mechanism() = 0;

    +		virtual std::auto_ptr< Details::Negotiation > startNegotiation() = 0;
     		virtual std::auto_ptr< Credentials > getCredentials(const std::string & principal, int flags) = 0;
    -		virtual std::auto_ptr< Context > getContext(RFC1961::Token *& out_token, Credentials & credentials, const std::string & resource_name) = 0;
    +		virtual std::auto_ptr< Context > getContext(
    +			Details::Negotiation & negotiation,
    +			RFC1961::Token *& out_token,
    +			Credentials & credentials,
    +			const std::string & resource_name) = 0;

     	protected :
     		Mechanism();
    diff --git a/lib/sspi/Mechanism.cpp b/lib/sspi/Mechanism.cpp
    index 0ffef6f..26df07a 100644
    --- a/lib/sspi/Mechanism.cpp
    +++ b/lib/sspi/Mechanism.cpp
    @@ -40,6 +40,12 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     		delete data_;
     	}

    +	/*virtual */std::auto_ptr< Security::Details::Negotiation > Mechanism::startNegotiation()/* = 0*/
    +	{
    +		//TODO implement this
    +		return std::auto_ptr< Security::Details::Negotiation >();
    +	}
    +
     	/*virtual */std::auto_ptr< Security::Credentials > Mechanism::getCredentials(const std::string & principal, int flags)/* = 0*/
     	{
     		CredHandle cred_handle;
    @@ -70,7 +76,11 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     		}
     	}

    -	/*virtual */std::auto_ptr< Security::Context > Mechanism::getContext(RFC1961::Token *& out_token, Security::Credentials & credentials, const std::string & resource_name)/* = 0*/
    +	/*virtual */std::auto_ptr< Security::Context > Mechanism::getContext(
    +		Security::Details::Negotiation & negotiation,
    +		RFC1961::Token *& out_token,
    +		Security::Credentials & credentials,
    +		const std::string & resource_name)/* = 0*/
     	{
     		Credentials & credentials_(dynamic_cast< Credentials& >(credentials)); // note: throws if the wrong type is given
     		CtxtHandle context_handle;
    diff --git a/lib/sspi/Mechanism.h b/lib/sspi/Mechanism.h
    index aa114b7..1c62b68 100644
    --- a/lib/sspi/Mechanism.h
    +++ b/lib/sspi/Mechanism.h
    @@ -13,8 +13,13 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     		Mechanism(const std::string & package_name);
     		virtual ~Mechanism();

    +		virtual std::auto_ptr< Security::Details::Negotiation > startNegotiation()/* = 0*/;
     		virtual std::auto_ptr< Security::Credentials > getCredentials(const std::string & principal, int flags)/* = 0*/;
    -		virtual std::auto_ptr< Security::Context > getContext(RFC1961::Token *& out_token, Security::Credentials & credentials, const std::string & resource_name)/* = 0*/;
    +		virtual std::auto_ptr< Security::Context > getContext(
    +			Security::Details::Negotiation & negotiation,
    +			RFC1961::Token *& out_token,
    +			Security::Credentials & credentials,
    +			const std::string & resource_name)/* = 0*/;

     	private :
     		// neither CopyConstructible nor Assignable

Much of this code still needs to be filled in but, before we do that, we have to figure out a way of handling errors - which we will do in the next installment. Until then, have fun!