---
author: rlc
comments: true
date: 2010-06-17 03:42:22+00:00
layout: post
permalink: /blog/2010/06/socks-5-starting-gss-api-the-factory-pattern/
slug: socks-5-starting-gss-api-the-factory-pattern
title: 'Socks 5: Starting GSS-API - The Factory Pattern'
wordpress_id: 746
categories:
- C++ for the self-taught
- Software Design
tags:
- Posts that need to be re-tagged (WIP)
- SOCKS
---

[donate]

In this installment, we'll be doing a final bit of clean-up and starting to implement a GSS-API/SSPI client program, while focusing on the _Abstract Factory Pattern_
<!--more-->
The first set of changes we'll discuss in this installment prepares our code for use with IPv6. It's pretty cheap to do that at this stage and would be far more costly to do later. In fact, the only thing we need to do in order to allow his is to use the `sockaddr_storage` structure wherever we pass addresses around. TCP and UDP ports are the same between IPv4 and IPv6 - mainly because they are built on top of IP - so the only thing that really changes is the size of the address. There are a few caveats that we might want to work out later, but as long as we keep in mind that we want our code to work both with IPv4 and IPv6 networks, we'll be OK for now.

The two commits that follow, moving the code and renaming the include guards, should, of course, have been a single commit, but I am human, so I forget things sometimes.

You can have a look at both of these commits and see that they're pretty trivial, so we'll skip an in-depth analysis for now.

Talking about in-depth analyses: I've analysed the Binary Search algorithm and put a [post](/assets/2010/06/binary-search/) on the site if you want to take a look at it. It explains quite a few interesting things, such as the O notation (including its formal definition); why binary search is efficient; when it is more efficient to sort and then search, and why, etc. Have a look, leave a comment, etc.

Another commit sets up Windows projects for our new libcore and librfc1961 libraries. We'll be building on from here for our next libraries as well.



### GSS-API


Before we begin, it is not my intent to make this podcast, nor this series of posts, about GSS-API and it is not my intent to write a HOWTO documentation for people who want to write GSS-API servers or clients - although that is what we will be doing here, my focus will be on the C++ side of things. For your convenience, and for some background information, I've committed Sun Microsystem's GSS-API Programming Guide. We will start by writing a client application.



### SSPI


The same goes for SSPI, which is Microsoft's equivalent of GSS-API and which is amply documented [here](http://msdn.microsoft.com/en-us/library/aa380493(VS.85).aspx). I will not go into in-depth analyses of SSPI and will not explain in detail how SSPI works, even if we will be working with SSPI - even in this post.



## The Factory Pattern


We will be implementing two distinct libraries, which we will call libgss and libsspi, but both of which will perform the same functionalities. Those functionalities will be described by interfaces which we will suit to our use-cases. As an interface is an abstract description of the functionality it represents, we cannot create an instance of an interface, but we can create an instance of a class that implements that interface. Where that class comes from and what class that will be will depend on a number of things, including the operating system we will be running on. Each of the interfaces will be defined in a third library called libsecurity. That library will also define how the instances of the classes that implement those interfaces are created. This is where the factory pattern comes in.

[![](http://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Abstract_factory.svg/200px-Abstract_factory.svg.png)](http://en.wikipedia.org/wiki/File:Abstract_factory.svg)The factory pattern I am talking about is more formally known as the _Abstract Factory Pattern_. I think the best diagram I have seen so far of this pattern is the one on Wikipedia, which is on the right (click on the image to enlarge): an abstract version of the factory - i.e. an interface for the factory - is defined and shared between implementations. Each implementation comes with an implementation not only of the diverse interfaces to be implemented by the class instances created by the factory, but with a factory as well. We will be using a textbook example of this pattern to create everything from security contexts to tokens.

For example: both GSS-API and SSPI support different security mechanisms. In GSS-API, they are called mechnisms; in SSPI they are called Security Support Providers (SSPs). We'll follow the GSS-API naming in this case, and call them Mechanisms. For now, we just need to know that they exist, that a default mechanism is available in both GSS-API and in SSPI, and that we need to be able to get a handle on that mechanism - which in our case means creating an instance of the mechanism. Let's take a look at what that would be like in code. Let's first take a look at what a mechanism interface looks like in C++: 
    
    #ifndef chausette_security_mechanism_h
    #define chausette_security_mechanism_h
    
    namespace Vlinder { namespace Chausette { namespace Security {
    	class Mechanism
    	{
    	public :
    		virtual ~Mechanism() = 0;
    
    	protected :
    		Mechanism();
    
    	private :
    		// neither CopyConstructible nor Assignable
    		Mechanism(const Mechanism &);
    		Mechanism & operator=(const Mechanism &);
    	};
    }}}
    
    #endif

Now, this class doesn't actually do anything, but you will notice that the default constructor is protected, that the copy constructor and assignment operator are private and that the destructor is virtual. That means that you can't create instances of this class, but you can destroy them. Note that the destructor is _abstract_. That doesn't mean it isn't locally implemented, though - it's a destructor so it has to be implemented - but it reinforces the idea that this class cannot be constructed on itself: it is abstract without even having anything in it. If we look at the corresponding .cpp file: 
    
    #include "Mechanism.h"
    
    namespace Vlinder { namespace Chausette { namespace Security {
    	/*virtual */Mechanism::~Mechanism()/* = 0*/
    	{ /* no-op */ }
    
    	Mechanism::Mechanism()
    	{ /* no-op */ }
    }}}

we can see that both the destructor and the constructor are implemented.

Now for the factory, which looks like this: 
    
    #ifndef chausette_security_mechanismfactory_h
    #define chausette_security_mechanismfactory_h
    
    namespace Vlinder { namespace Chausette { namespace Security {
    	class MechanismFactory
    	{
    	public :
    		static MechanismFactory & getInstance();
    
    		virtual Mechanism * getDefaultMechanism() const = 0;
    		virtual void releaseMechanism(Mechanism * mechanism) = 0;
    
    	protected :
    		MechanismFactory();
    		virtual ~MechanismFactory();
    
    		static void setInstance(MechanismFactory * instance);
    
    	private :
    		// neither CopyConstructible nor Assignable
    		MechanismFactory(const MechanismFactory &);
    		MechanismFactory & operator=(const MechanismFactory &);
    
    		static MechanismFactory * instance__;
    	};
    }}}
    
    #endif

Again, this class is abstract and neither CopyConstructible nor Assignable. It has a static `getInstance` function, though, which would indicate that the class is a _singleton_: only one instance of the class can exist at any one time. Arguably, that would be the case for the security mechanisms as well, but that might not be the case, so we don't enforce it. The question is, though: where does the instance that `getInstance` returns come from? The answer is, of course, from the _concrete_ implementation of the factory, which will call the protected `setInstance` function. Let's take a look at the corresponding cpp file: 
    
    #include "MechanismFactory.h"
    #include <stdexcept>
    
    namespace Vlinder { namespace Chausette { namespace Security {
    	MechanismFactory * MechanismFactory::instance__(0);
    
    	/*static */MechanismFactory & MechanismFactory::getInstance()
    	{
    		if (instance__)
    			return *instance__;
    		else
    			throw std::logic_error("Factory not initialized");
    	}
    
    	MechanismFactory::MechanismFactory()
    	{ /* no-op */ }
    
    	MechanismFactory::~MechanismFactory()
    	{ /* no-op */ }
    
    	/*static */void MechanismFactory::setInstance(MechanismFactory * instance)
    	{
    		instance__ = instance;
    	}
    
    }}}

Now I would think you can guess what the SSPI library will look like up to here, implementing mostly the basic functions that are defined in those interfaces. For brevity, we'll only look at the factory implementation .cpp file: 
    
    #include "MechanismFactory.h"
    #include "Mechanism.h"
    
    namespace Vlinder { namespace Chausette { namespace SSPI {
    	MechanismFactory::MechanismFactory()
    	{
    		setInstance(this);
    	}
    	/*virtual */MechanismFactory::~MechanismFactory()
    	{
    		setInstance(0);
    	}
    
    	/*virtual */Mechanism * MechanismFactory::getDefaultMechanism() const/* = 0*/
    	{
    		return new Mechanism;
    	}
    
    	/*virtual */void MechanismFactory::releaseMechanism(Mechanism * mechanism)/* = 0*/
    	{
    		delete mechanism;
    	}
    }}}

The rest of the implementation can be found in thiscommit.

This gives us a short overview of what a factory could look like. Next time, we'll start implementing GSS-API and use `gss_indicate_mechs` to figure out which mechanisms are available - and we'll do the same with SSPI's `EnumerateSecurityPackages`.
