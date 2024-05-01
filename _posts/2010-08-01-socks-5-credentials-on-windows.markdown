---
author: rlc
categories:
- Software Development
- Computer Programming
- Data Encapsulation
- RAII (Resource Acquisition Is Initialization)
comments: true
date: 2010-08-01 23:31:26+00:00
layout: post
tags:
- Posts that need to be re-tagged (WIP)
- SOCKS
- Windows
title: 'Socks 5: Credentials on Windows'
wordpress_id: 847
---

In this installment, we will continue our implementation of GSSAPI/SSPI, this time on Windows, where we'll try to get some credentials.

We will look at two topics this time: first, we'll look at data encapsulation, after which we'll look at when RAII is a bit too much, and how to handle that.

<!--more-->

## Data encapsulation

One of the main reasons we're going to the trouble of creating an abstract factory is because we want the users of our code to be pretty close to impervious to the way security is implemented. Most notably, we don't want the user to be obliged to know anything about SSPI or GSSAPI and we don't want them to have to include any of the associated headers - or even necessarily have those headers around. This comes at a cost, though: we need to hide our implementation so far that we need to allow the user to not even know about the types we are using. In our first patch today, we'll see how to do that.

Let's first take a look at the changes we make to the Mechanism.h file, in the sspi library:

    diff --git a/lib/sspi/Mechanism.h b/lib/sspi/Mechanism.h
    index 804fef5..456c233 100644
    --- a/lib/sspi/Mechanism.h
    +++ b/lib/sspi/Mechanism.h
    @@ -3,19 +3,25 @@

     #include "../security/Mechanism.h"
     #include "Details/prologue.h"
    +#include <string>

     namespace Vlinder { namespace Chausette { namespace SSPI {
     	class VLINDER_CHAUSETTE_SSPI_API Mechanism
     		: public Security::Mechanism
     	{
     	public :
    -		Mechanism();
    +		Mechanism(const std::string & package_name);
     		virtual ~Mechanism();

     	private :
     		// neither CopyConstructible nor Assignable
     		Mechanism(const Mechanism &);
     		Mechanism & operator=(const Mechanism &);
    +
    +	private :
    +		struct Data_;
    +
    +		Data_ * data_;
     	};
     }}}

Like I said in a previous installment, there's not much point in trying to hide the standard library implementation, as whoever uses our code will be using it anyway. There's not much point, either, in trying to hide that an instance of `Mechanism` needs a package name to be created under SSPI: the `MechanismFactory` will do the creating for us, so if all goes well, the client code won't even include this file. There is a chance, however, that they will, in which case we don't want the user to be dependent on the Windows headers. That's why I've created a forward-declaration to a private member structure called `Data_`. The structure itself is not here, but is defined in the .cpp file. It contains the package information we will need for later use, and it is conveniently hidden from view.

You might be wondering by now why the `Data_` structure doesn't have to be visible here - after all, I do have a pointer to an instance of it in my class. The thing is, though, that there are only a few reasons why the compiler needs to know the definition of a structure: it needs to know how to create an instance of it when one is defined or explicitly allocated with `new`; it needs to know how to destroy it when one goes out of scope or is explicitly destroyed with `delete`, and it needs to know how big it is when one is used as a member of something else. You might think that our use in this header would fall in that last category, but it doesn't: our member is a _pointer to_ an instance of `Data_`. It is not an instance of `Data_` by itself. Pointers usually have the same size regardless of what they point to and, in any case, the compiler can figure out what that size is without knowing what it points to, so there's no need, here, to know the definition of `Data_` in order to use it.

    diff --git a/lib/sspi/Mechanism.cpp b/lib/sspi/Mechanism.cpp
    index 34fa65a..b4e7149 100644
    --- a/lib/sspi/Mechanism.cpp
    +++ b/lib/sspi/Mechanism.cpp
    @@ -1,10 +1,40 @@
     #include "Mechanism.h"
    +#include <windows.h>
    +#include <security.h>

     namespace Vlinder { namespace Chausette { namespace SSPI {
    -	Mechanism::Mechanism()
    -	{ /* no-op */ }
    +	struct Mechanism::Data_
    +	{
    +		Data_(const std::string & package_name)
    +			: package_name_(package_name)
    +			, package_info_(0)
    +		{ /* no-op */ }
    +
    +		~Data_()
    +		{
    +			FreeContextBuffer(package_info_);
    +		}
    +
    +		std::string package_name_;
    +		PSecPkgInfo package_info_;
    +	};
    +
    +	Mechanism::Mechanism(const std::string & package_name/* = std::string()*/)
    +		: data_(new Data_(package_name))
    +	{
    +		if (QuerySecurityPackageInfo((LPSTR)package_name.c_str(), &data;_->package_info_) != SEC_E_OK)
    +		{
    +			delete data_;
    +			data_ = 0;
    +			throw std::runtime_error("Failed to query package info");
    +		}
    +		else
    +		{ /* all is well */ }
    +	}

     	/*virtual */Mechanism::~Mechanism()
    -	{ /* no-op */ }
    +	{
    +		delete data_;
    +	}
     }}}

As you can see in this chunk, `Data_` doesn't _do_ much of anything: it will free the `PSecPkgInfo` instance when it's done, but that's about all. All of the logic is still in the `Mechanism` class, where it belongs.

Now for the factory:

    diff --git a/lib/sspi/MechanismFactory.cpp b/lib/sspi/MechanismFactory.cpp
    index 8ffd315..3565a9c 100644
    --- a/lib/sspi/MechanismFactory.cpp
    +++ b/lib/sspi/MechanismFactory.cpp
    @@ -1,6 +1,5 @@
     #include "MechanismFactory.h"
     #include "Mechanism.h"
    -#define SECURITY_WIN32
     #include <windows.h>
     #include <security.h>

    @@ -52,7 +51,7 @@ namespace Vlinder { namespace Chausette { namespace SSPI {

     	/*virtual */Mechanism * MechanismFactory::getDefaultMechanism() const/* = 0*/
     	{
    -		return new Mechanism;
    +		return new Mechanism(getAvailableMechanisms()[0]);
     	}

     	/*virtual */void MechanismFactory::releaseMechanism(Security::Mechanism * mechanism)/* = 0*/

As you can see, we assume that on Windows, the default package is whichever is listed first in the available packages - or "mechanisms" as we call them. This holds true for Windows and, as long as we don't start sorting those packages, will hold true when we care for it to hold true.

Now a final little chunk:

    diff --git a/tests/RFC1961/main.cpp b/tests/RFC1961/main.cpp
    index 3d9540c..396f6ab 100644
    --- a/tests/RFC1961/main.cpp
    +++ b/tests/RFC1961/main.cpp
    @@ -31,6 +31,7 @@ int main()
     	std::auto_ptr< Vlinder::Chausette::GSSAPI::MechanismFactory > mechanism_factory(new Vlinder::Chausette::GSSAPI::MechanismFactory);
     #endif
     	std::vector< std::string > mechanisms(Vlinder::Chausette::Security::MechanismFactory::getInstance().getAvailableMechanisms());
    +	std::auto_ptr< Vlinder::Chausette::Security::Mechanism > mechanism(mechanism_factory->getDefaultMechanism());

     #ifdef _MSC_VER
     	WSADATA wsa_data;

in which we get the default mechanism in our test. Of course, we should really think of creating an actual unit test, but that's beyond the scope of this installment.

So, data encapsulation works because we don't need to know the definition of the data in order to be able to work with it, and it's useful because it hides the nitty-gritty from those who don't need to know it.

## When RAII is too much

I've been going on about RAII in practically every installment of this podcast now - at least since I introduced the concept a while ago. You must either think that I am stark raving mad, or that I'm addicted to RAII. You might actually be right - whichever option you opt for - but you should also know that I can go without RAII for a few (albeit very few) lines of code. Sometimes, RAII is more trouble than it's worth.

Look at the following chunk of code:

    diff --git a/lib/sspi/Mechanism.cpp b/lib/sspi/Mechanism.cpp
    index b4e7149..e801e14 100644
    --- a/lib/sspi/Mechanism.cpp
    +++ b/lib/sspi/Mechanism.cpp
    @@ -1,6 +1,7 @@
     #include "Mechanism.h"
     #include <windows.h>
     #include <security.h>
    +#include "Credentials.h"

     namespace Vlinder { namespace Chausette { namespace SSPI {
     	struct Mechanism::Data_
    @@ -36,5 +37,35 @@ namespace Vlinder { namespace Chausette { namespace SSPI {
     	{
     		delete data_;
     	}
    +
    +	/*virtual */std::auto_ptr< Security::Credentials > Mechanism::getCredentials(const std::string & principal, int flags)/* = 0*/
    +	{
    +		CredHandle cred_handle;
    +		TimeStamp expiry;
    +		if (AcquireCredentialsHandle(
    +			(LPSTR)principal.c_str(),
    +			data_->package_info_->Name,
    +			flags,
    +			0 /* no LUID */,
    +			0 /* no auth data */,
    +			0 /* unused */,
    +			0 /* unused */,
    +			&cred;_handle,
    +			&expiry;) != SEC_E_OK)
    +		{
    +			throw std::runtime_error("acquire credentials failed");
    +		}
    +		else
    +		{ /* all is well */ }
    +		try
    +		{
    +			return std::auto_ptr< Security::Credentials >(new Credentials(cred_handle));
    +		}
    +		catch (...)
    +		{
    +			FreeCredentialsHandle(&cred;_handle);
    +			throw;
    +		}
    +	}
     }}}

This is where I obtain a handle on the credentials of a given principal and, if that works, pass it on to a new instance of `Credentials`, which will manage its lifetime and whose lifetime is managed by an `auto_ptr`. Now, the important bit here is that there are two things that can go wrong between the `try` and the `catch`: the allocation might fail, in which case we'd be in big trouble but, more importantly, the constructor of the `Credentials` class would never be called, and construction of the `Credentials` instance might fail. If I were to define `Credentials` such that anything that is passed to its constructor will be taken over by the `Credentials` class, even if its construction fails - a popular and often worthy option - I'd have a problem in that I'd need to know which step went wrong. It is the option `auto_ptr` implements, though, and that is a Good Thing, though it would also complicate matters if construction of `auto_ptr` actually _could_ fail.

Now, what would have happened had I used RAII for this task? There are two options: either I'd have created a scoped handle on the credentials handle, which I would have dismissed after the construction of the `Credentials` instance, but that would have left the same problem as I have now: determining which construction failed in order to know whether or not to dismiss the guard. An option that doesn't actually make the code any cleaner is not really an option.

The alternative would have been to create a class that would explicitly hand ownership of the credentials handle to the new instance of the `Credentials` class, much like `auto_ptr` does with pointers. If it goes out of scope while still holding the reference, it will call the proper clean-up function.

Implementing that option can be fun - I would invite you to do it and contribute your result. It can also be far more work than writing a `try`-`catch` block with as its only benefit to make the code marginally cleaner. I say marginally because, although the clarity of the semantics would be a lot better, this piece of code isn't repeated anywhere else. As such, weighing the benefits of implementing the "right" RAII solution (automatic ownership transfer) vs. the use of a `try`-`catch` block, the `try`-`catch` block wins because it is that much less work. Implementing the wrong RAII solution simply doesn't make any sense.

So, I may be off my rocker and/or addicted to RAII, but apparently I still have a wee bit of common sense. I'll try applying that again in four weeks - I'm taking the next two weeks off from the podcast, so there will be no mid-August installment.