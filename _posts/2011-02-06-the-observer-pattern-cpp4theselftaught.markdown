---
author: rlc
categories:
- Programming
- Software Development
- Computer Science
- Design Patterns
- C++
comments: true
date: 2011-02-06 02:37:02+00:00
layout: post
title: The Observer Pattern
wordpress_id: 1167
---

In this installment of C++ for the self-taught, we will be looking at the Observer pattern: we will be starting the implementation of the proxy-part of our SOCKS server by accepting connections and servicing them.<!--more-->

In this installment, there will be quite a few things aside from the Observer pattern that will appear in the code, but we won't dwell on those for now - that just means we will be mining this code for another installment or two to thoroughly understand what's going on in it.

The focus, in the code itself, is on code re-use, terseness and functional clarity. The focus is _not_ on how easy it is to understand what's going on behind the scenes at first glance.

Let's start by having a look at this little video I prepared to explain the Observer Pattern: a conversation between "Hugh" and "Joanne" in which "Joanne" explains the pattern, and its uses, to "Hugh":

As "Joanne" explained, the all the Subject has to know about the Observer is its interface. In this case, as I said in the previous installment, the Observer has to be able to react to four events:

    virtual void onNewConnection(Socket &socket;) = 0;
    virtual void onDataReady(Socket &socket;) = 0;
    virtual void onWriteReady(Socket &socket;) = 0;
    virtual void onExceptionalDataReady(Socket &socket;) = 0;

Each of these is defined as a pure virtual method of an abstract class, called `Observer`.

The Subject itself, in this case, is the `Server` class, which implements two methods related to the pattern:

    void attach(Observer *observer);
    void detach(Observer *observer);

Note that in this implementation, `Subject` is not an interface: the users of the `Server` are expected to understand that we're using the Observer pattern.

This is not always the case: one of the larger-scale architectures I designed a few years ago was heavily based on the Observer pattern and used interfaces for both the Subject and the Observer, to allow different types of object to be linked together and pass information to each other in a directed acyclic graph.

In the implementation we're looking at in this installment, the `Observer` interface is implemented by a class called `Application`, which implements all four call-backs. Let's have a look at its declaration:

    class Application : Observer
    {
    public :
    	typedef std::vector< std::string > Arguments;

    	Application();
    	~Application();

    	void run(const Arguments &arguments;);

    private :
    	Application(const Application&);
    	Application& operator=(const Application&);

    	virtual void onNewConnection(Socket &socket;);
    	virtual void onDataReady(Socket &socket;);
    	virtual void onWriteReady(Socket &socket;);
    	virtual void onExceptionalDataReady(Socket &socket;);

    	bool done_;
    	Server *server_;
    };

Note that this class inherits from `Observer` _privately_: only the code in the `Application` class itself can cast a pointer or reference to an `Application` to `Observer`, which is exactly what it does when it attached itself:

    void Application::run(const Application::Arguments &arguments;)
    {
    	// for now, expect our own path in arguments[0], the IP address to
    	// listen on in arguments[1] and the port in arguments[2]
    	assert(arguments.size() >= 1);
    	std::string ip(arguments.size() > 1 ? arguments[1] : CHAUSETTE_EPISODE28_DEFAULT_IP);
    	unsigned short port(arguments.size() > 2 ? boost::lexical_cast< unsigned short >(arguments[2]) : CHAUSETTE_EPISODE28_DEFAULT_PORT);
    	sockaddr_storage address;
    	memset(&address;, 0, sizeof(address));
    	sockaddr_in &in;_address = reinterpret_cast< sockaddr_in& >(address);
    	in_address.sin_family = AF_INET;
    	in_address.sin_port = htons(port);
    	in_address.sin_addr.s_addr = inet_addr(ip.c_str());
    	server_ = new Server(address);
    	server_->attach(this);	// if attach throws, the ~Application destructor will take
    				// care of destroying the server if anything after attach
    				// throws, we still want detach to be called. We'll get to
    				// using a scope guard later - this time, we'll just use
    				// try..catch
    	try
    	{
    		done_ = false;
    		while (!done_)
    		{
    			server_->update();
    		}
    	}
    	catch (...)
    	{
    		server_->detach(this);
    		throw;
    	}
    	server_->detach(this);
    }

A few notes about this code:

- `server_` is a _member_ of the class because we need it in the call-backs used for the Observer pattern: the Subject doesn't pass a reference or pointer to itself when it notifies the Observer; it is a _pointer_ to a `Server` because we can't initialize the server without having the address to bind it to, for which we first have to parse the arguments - so we can't construct it when we construct the `Application`.
- I've started using `sockaddr_storage` for all network addresses (as much as possible) to prepare for IPv6 readiness. This code still parses the arguments to the application as IPv4 addresses, however, so I cast a reference to the `sockaddr_storage` instance into a `sockaddr_in&`, using a `reinterpret_cast` because the two types are unrelated.
- This application is designed to be single-threaded: the `Server` class has an `update` method that is called periodically (in a tight loop, in this case) to allow it to service requests. This has the advantage of not having to think about thread synchronization - which simplifies things a bit.

Now let's look at the implementation of the Subject:

    void Server::attach(Observer *observer)
    {
    	observers_.push_back(observer);
    }

    void Server::detach(Observer *observer)
    {
    	Observers::iterator where(std::find(observers_.begin(), observers_.end(), observer));
    	if (where != observers_.end())
    	{
    		observers_.erase(where);
    	}
    	else
    	{ /* not found, not a problem */ }
    }

- `observers_` has the following type:  
  `typedef std::list< Observer* > Observers`  
  meaning it's a list of pointers to `Observer`s. This has three advantages:

      1. the pointers to the `Observer`s are _polymorphic_, meaning they act as their derived classes (in our case, the `Application`, but the `Server` doesn't know that)


      2. pointers don't own what they point to, so destroying the `Server` won't destroy its observers


      3. iterators of a `list` remain valid when elements are added to the list and when elements are removed from the list - unless the element being removed is the one pointed to by the iterator. This means we can manipulate the list of observers from within the observer's call-back, if we want to.

      Unfortunately, using pointers also means that if the observer dies without detaching itself from the subject, its behavior becomes undefined.

- `detach` gives a _no fail guarantee_: `find` and `erase` can't fail, and `detach` doesn't fail if `find` doesn't find anything. This, of course, is how it should be.

Now, all that's missing is to see the observer in action: