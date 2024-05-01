---
author: rlc
categories:
- Software Development
comments: true
date: 2010-07-02 00:52:22+00:00
layout: post
title: 'Socks 5: Expanding the factory'
wordpress_id: 810
---

In this installment, we will expand the `MechanismFactory` class for SSPI. We will take a slightly closer look at the SSPI call than we would normally do, and we will also take a look at the Unicode/"ANSI" differences on Windows. Because of this, we will _not_ have time to take a look at the GSS-API side of things, which we will therefore look into next time around.

<!--more-->

Let's first take a look at the code being added:

    /*virtual */std::vector< std::string > MechanismFactory::getAvailableMechanisms() const/* = 0*/
    {
    	if (available_mechanisms_.empty())
    	{
    		ULONG package_count;
    		ScopedPSecPkgInfo buffer;
    		SECURITY_STATUS status;
    		status = EnumerateSecurityPackages(&package;_count, &buffer;);
    		if (status != SEC_E_OK)
    		{
    			throw std::bad_alloc();
    		}
    		else
    		{ /* all is well */ }
    		for (ULONG curr_package(0); curr_package != package_count; ++curr_package)
    		{
    #ifdef UNICODE
    			std::wstring wname(buffer[curr_package].Name);
    			std::vector< char > transcode_buffer(wcstombs(0, wname.c_str(), 0));
    			wcstombs(&transcode;_buffer[0], wname.c_str(), transcode_buffer.size());
    			std::string name(transcode_buffer.begin(), transcode_buffer.end());
    #else
    			std::string name(buffer[curr_package].Name);
    #endif
    			available_mechanisms_.push_back(name);
    		}
    	}
    	else
    	{ /* don't have to populate it */ }

    	return available_mechanisms_;
    }

There are a few things to notice about this function.

### Caching our answer

First of all, you'll notice that the available mechanisms are cached: we assume (with some reason) that the available authentication mechanisms don't change during the life-time of the application. It is cached by making the `available_mechanisms_` variable a member of the factory class - the derived version. It is populated only once, on the first call to this function. Any subsequent call only returns the cached value. Of course, if we should find that the available mechanisms _do_ change during the life-time of the application, we can make this mechanism a bit less efficient by adding a `reset` function to the factory, removing any cached values - but we won't do that for now.

### RAII again

The second thing you'll notice is that I use a type called `ScopedPSecPkgInfo`. The type used by the Windows API is `PSecPkgInfo`. The scoped version takes care of RAII for us. The type looks like this:

    namespace {
    	struct ScopedPSecPkgInfo
    	{
    		ScopedPSecPkgInfo()
    			: buffer_(0)
    		{ /* no-op */ }

    		~ScopedPSecPkgInfo()
    		{
    			if (buffer_)
    			{
    				FreeContextBuffer(buffer_);
    			}
    			else
    			{ /* nothing to free */ }
    		}

    		PSecPkgInfo* operator&()
    		{
    			return &buffer;_;
    		}

    		SecPkgInfo & operator[](int i)
    		{
    			return buffer_[i];
    		}

    		PSecPkgInfo buffer_;
    	};
    }

In many examples, you'll see a separate call to the `FreeContextBuffer` function. If you've been following these posts and this podcast for a while and/or if you're familiar with my work, you'll know that I largely prefer having such calls made automatically using RAII. One obvious reason would be that the `wstring`, `string` and `vector` can all raise exceptions and one such exception would prevent `FreeContextBuffer` from being called unless it is either done automatically, like it is now, or by using `try` `catch` pairs. Using RAII is more than just a preference on my part: it makes the code clearer and it makes it exception-safe.

### Overloading the address-of operator

Another thing that you may have noticed is that the `EnumerateSecurityPackages` function takes a pointer to a `PSecPkgInfo`, not to a `ScopedPSecPkgInfo`. If you've seen that, you've also seen that I take the address of `buffer`, not of `buffer.buffer_` - at least not at the call site. How does that work?

The answer is that the address-of operator, `operator&`, is overloaded for `ScopedPSecPkgInfo` and returns a `PSecPkgInfo*`. Some will say this is bad practice and, most of the time, I actually agree with that assertion: much the same as `goto` and similar practices, overloading the address-of operator should usually be frowned upon - but usually is not always. In this particular case, we're isolated from most of the other code, the `ScopedPSecPkgInfo` class is not shared with anyone and is written such that it would be useless to do so, so there is no danger of it going anywhere. For these reasons, the usual arguments against this practice don't hold: we know what we're doing and we're doing it in isolation.

### Unicode vs. "ANSI"

The Windows-world has a strange habit of calling what most people call "extended ASCII" "ANSI". I have no idea what the American National Standards Institute has to do with this, but there are surely historical (if not hysterical) reasons for it.

Windows comes with a duplicated API: one with wide characters and one with not-so-wide characters. By default, it will use what, in the Windows world, is called "Unicode" - and what the rest of us call UTF-16. When it does that, the `UNICODE` macro is defined and a call like `EnumerateSecurityPackages` is translated to `EnumerateSecurityPackagesW`. Among other things, that means that the names of the methods used are wide-character strings as well. That's what this code is for:

    #ifdef UNICODE
    	std::wstring wname(buffer[curr_package].Name);
    	std::vector< char > transcode_buffer(wcstombs(0, wname.c_str(), 0));
    	wcstombs(&transcode;_buffer[0], wname.c_str(), transcode_buffer.size());
    	std::string name(transcode_buffer.begin(), transcode_buffer.end());
    #else
    	std::string name(buffer[curr_package].Name);
    #endif

The central function in this bit of code is `wcstombs` ("wide character string to multi-byte string"). When called with `NULL` as its first argument, it returns the number of bytes needed to transcode the wide-character string to a multi-byte character string - which is what I use to allocate the buffer. The transcoded version is then stored in a string.

I'm actually being a bit pedantic here: I could have used the `std::string` directly as a contiguous buffer to transcode into, but it is only guaranteed to work as of C++0x (current draft, if memory serves). That is not the only way this code could be optimized, however - so as a quiz to you, try to find another way.

### Testing

In order to test all this, I've added two lines to the test code:

    	std::auto_ptr< Vlinder::Chausette::SSPI::MechanismFactory > mechanism_factory(new Vlinder::Chausette::SSPI::MechanismFactory);
    	std::vector< std::string > mechanisms(Vlinder::Chausette::Security::MechanismFactory::getInstance().getAvailableMechanisms());

The first one creates an instance of the factory and is actually the only part of the code that needs to know the concrete type of the factory. The second line calls the abstract factory to obtain the available mechanisms, which was the goal of all this, after all.

Now, it's up to you to load this into your debugger and trace through it. Put some breakpoints in strategic places to see what's happening: you'll probably learn at least as much from that, as from listening to me talk.

Please feel free to ask questions. We'll continue this in two weeks.