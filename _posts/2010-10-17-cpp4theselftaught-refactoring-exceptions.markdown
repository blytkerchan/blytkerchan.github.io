---
author: rlc
comments: true
date: 2010-10-17 00:31:06+00:00
layout: post
title: Refactoring Exceptions
wordpress_id: 982
tags:
  - Posts that need to be re-tagged (WIP)
  - refactoring
---

As I mentioned in the [previous installment](/blog/2010/10/negotiation-first-steps), our current way of handling exceptions leaves a few things to be desired. In this installment, we will fix that problem.

<!--more-->

Always, one of the most effective ways of going about refactoring (which is what we are doing now) is to make cleanly breaking changes. Let's take a look at this change, for example:

    @@ -10,10 +10,29 @@
     namespace Vlinder { namespace Chausette { namespace SSPI {
     	class VLINDER_CHAUSETTE_SSPI_API Mechanism
     		: public Security::Mechanism
     	{
     	public :
    +		template < typename Base >
    +		struct Exception : Base
    +		{
    +			Exception(const std::string &message;, const char *filename, int line, unsigned long code)
    +				: Base(message)
    +				, filename_(filename)
    +				, line_(line)
    +				, code_(code)
    +			{ /* no-op */ }
    +
    +			const char *filename_;
    +			int line_;
    +			unsigned long code_;
    +		};
    +		typedef Exception< Security::Mechanism::AuthenticationError > AuthenticationError;
    +		typedef Exception< Security::Mechanism::IncompleteCredentials > IncompleteCredentials;
    +		typedef Exception< Security::Mechanism::IncompleteMessage > IncompleteMessage;
    +
    +
     		Mechanism(const std::string & package_name);
     		virtual ~Mechanism();

     		virtual std::auto_ptr< Security::Details::Negotiation > startNegotiation()/* = 0*/;
     		virtual std::auto_ptr< Security::Credentials > getCredentials(const std::string & principal, int flags)/* = 0*/;

We'll look at the new `Exception` class in a moment, but the first thing you should notice is that our code will no longer compile:

    1>------ Build started: Project: libsspi, Configuration: Debug Win32 ------
    1>Compiling...
    1>Context.cpp
    1>Mechanism.cpp
    1>c:\documents and settings\ronald\desktop\chausette\lib\sspi\mechanism.cpp(109) : error C2440: '<function-style-cast>' : cannot convert from 'const char [40]' to 'Vlinder::Chausette::SSPI::Mechanism::AuthenticationError'
    1>        No constructor could take the source type, or constructor overload resolution was ambiguous
    1>c:\documents and settings\ronald\desktop\chausette\lib\sspi\mechanism.cpp(127) : error C2440: '<function-style-cast>' : cannot convert from 'const char [207]' to 'Vlinder::Chausette::SSPI::Mechanism::IncompleteCredentials'
    1>        No constructor could take the source type, or constructor overload resolution was ambiguous
    1>c:\documents and settings\ronald\desktop\chausette\lib\sspi\mechanism.cpp(162) : error C2440: '<function-style-cast>' : cannot convert from 'const char [47]' to 'Vlinder::Chausette::SSPI::Mechanism::IncompleteMessage'
    1>        No constructor could take the source type, or constructor overload resolution was ambiguous
    1>Generating Code...
    1>Build log was saved at "file://c:\Documents and Settings\Ronald\Desktop\Chausette\projects\msvc8\libsspi\Debug\BuildLog.htm"
    1>libsspi - 3 error(s), 0 warning(s)
    ========== Build: 0 succeeded, 1 failed, 7 up-to-date, 0 skipped ==========

This is what I mean by a "clean break": the compiler finds the errors for you and lets you know what to do (as if you didn't already know), so now we can make the changes without wondering where they should be.

2 files changed, 22 insertions, 3 deletions, the other file, of course, being this:

    @@ -106,7 +106,7 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     			if (!SUCCEEDED(complete_status))
     			{
     				//TODO have the complete_status ride along with the exception
    -				throw AuthenticationError("Failed to complete authentication token");
    +				throw AuthenticationError("Failed to complete authentication token", __FILE__, __LINE__, complete_status);
     			}
     			else
     			{ /* all is well */ }
    @@ -124,7 +124,7 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     			// recover from. In any case, it is not a "normal" situation in that
     			// the configuration is probably incomplete, so we make it an exception.
     			negotiation.context_handle_valid_ = true;
    -			throw IncompleteCredentials("The server has requested client authentication, and the supplied credentials either do not include a certificate or the certificate was not issued by a certification authority that is trusted by the server.");
    +			throw IncompleteCredentials("The server has requested client authentication, and the supplied credentials either do not include a certificate or the certificate was not issued by a certification authority that is trusted by the server.", __FILE__, __LINE__, status);
     		case SEC_I_COMPLETE_AND_CONTINUE :
     			/* The client must call CompleteAuthToken and then pass the output
     			 * to the server. The client then waits for a returned token and
    @@ -159,7 +159,7 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     			 * this function. */
     			// note that we don't have any way to communicate the information provided
     			// to us in the input token to the user, so we will simply ignore it.
    -			throw IncompleteMessage("SChannel: data should be available on the wire");
    +			throw IncompleteMessage("SChannel: data should be available on the wire", __FILE__, __LINE__, status);
     		case SEC_I_COMPLETE_NEEDED :
     			/* The client must finish building the message and then call the
     			 * CompleteAuthToken function. */

If that were all I had to say for this installment, it would be the shortest one yet. There are, however, a few things I would like to note: the `Exception` class carries information with it that, without knowing the exact type of the exception object, is not accessible. An appropriate implementation of `what` could handle this, but `what` is more difficult to implement than you might think. An obvious, **but wrong** implementation would look like this:

    const char * what() const
    {
    	std::stringstream ss;
    	ss << filename_ << "(" << line_ << "): error: " << Base::what() << " [" << code_ << "]";
    	return ss.str().c_str();
    }

For one thing, this version can throw an exception, which isn't worth much if you want to know what the error was in the first place. For another, the pointer it returns points to the innards of a temporary object (with automatic storage duration) and is therefore pretty certain to be worthless once you get around to using it.

So we need work-arounds for two problems: we need storage for the string, and we need to provide a solution that won't throw an exception. The second part is easy enough: if anything throws an exception, return `Base::what()` in stead.

The first part means we need a buffer to store the return value of `what` in, that will survive the return of the function. There are three possibilities for this: one is making it a static variable in the function, a second is allocating the buffer and returning the allocated buffer, for the user to de-allocate, and the third is making it a member of the exception class.

I would hope by now that you know one we are going to pick, but I'll go through all three of them anyway.

The first option would have the buffer shared between all instances of the class. Although there shouldn't be too many exceptions thrown at the same time, this still makes the `what` function non-re-entrant, which is a definite no-no.

The second option is just silly: as I said before we will return `Base::what()` if anything fails (because we want to provide the no-fail guarantee) which would mean that according to the way things work internally, the user _might_ have to de-allocate the buffer returned to him and really has no way of knowing whether he should.

The third option is, of course, the right one. It comes with the added advantage that if the exception is thrown, caught, interrogated, re-thrown, re-caught and interrogated again, only one of the interrogations need format the string.

This brings us to this version of our new `Exception` class:

    template < typename Base >
    struct Exception : Base
    {
    	Exception(const std::string &message;, const char *filename, int line, unsigned long code)
    		: Base(message)
    		, filename_(filename)
    		, line_(line)
    		, code_(code)
    		, what_called_(false)
    	{ /* no-op */ }

    	const char * what() const
    	{
    		if (what_called_)
    		{
    			return what_;
    		}
    		else
    		{
    			try
    			{
    				std::stringstream ss;
    				ss << filename_ << "(" << line_ << "): error: " << Base::what() << " [" << std::hex << code_ << "]";
    				std::string s(ss.str());
    				if (s.size() > (sizeof(what_) - 1))
    				{
    					s.replace(0, s.size() - (sizeof(what_) - 4), "...");
    				}
    				else
    				{ /* all is well */ }
    				std::copy(s.begin(), s.end(), what_);
    				what_[s.size()] = 0;
    				what_called_ = true;
    				return what_;
    			}
    			catch (...)
    			{
    				return Base::what();
    			}
    		}
    	}

    	const char *filename_;
    	int line_;
    	unsigned long code_;
    private :
    	mutable char what_[120];
    	mutable bool what_called_;
    };

This version provides the no-fail guarantee (and falls back on `Base::what()` if it fails internally), provides the information in a human-readable form and has a consistent interface.

Perhaps two more things to notice about this implementation: we've (quietly) introduced a new keyword: `mutable`. This keyword basically undoes the `const` at the end of the declaration of `what()`, meaning `const` member functions of the class can still modify (mutate) `mutable` data members.
