---
author: rlc
comments: true
date: 2010-04-16 12:00:54+00:00
layout: post
permalink: /blog/2010/04/socks-5-step-2-exchanging-a-token/
slug: socks-5-step-2-exchanging-a-token
title: 'SOCKS 5 Step 2: exchanging a token'
wordpress_id: 534
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
- SOCKS
---

[donate]

With a few minor adjustments to the existing `Token` class, we can finish the first part of our implementation of RFC 1961 for now - we will hook it into an implementation of the GSS API later. Before we do that, though, we'll create a new directory in our project called lib/rfc1961 and move our files there: it seems more appropriate that way, as we will have a lot more code to write. We will also move our implementation into its own namespace, which will be `Vlinder::Chausette::RFC1961`. In the first part of this installment, we will look at the changes necessary to do that and we will discuss the importance of namespaces.

In the second part of this installment, we will start implementing a simple program to send a GSSAPI token from a client to a server. As we will see, this isn't as simple as it might seem at first glance. We will build upon this example in the following installments to finish the implementation of RFC 1961.
<!--more-->
First, let's take a look at the changes to move the implementation into its own namespace, and the changes leading up to that. The first thing I did was to implement the constructors of the `Token` class (`struct`) and implement the `TokenType` enumerator. These two changes are very related, which is why they're in a single patch. The reason why I've added a constructor to the `Token` class is that I want to be able to automatically set the `ver_`, `mtyp_`, `len_` and `token_` members by passing a type and a raw token (without the extra version and type information) to a class instance, a bit like this:

    
    std::vector raw_token(/* do something to initialize the token here */);
    /* do something brilliant with the token here */
    Token token(Token::authentication_token__, raw_token);
    

but I also want to be able to create an empty token, like this: 
    
    Token token;

both of which I can do with this new piece of code. Of course, now that I support tokens of different types, I also need to be able to serialize and deserialize them, as per the RFC. For most token types, that doesn't change much of anything, but for tokens that indicate a failure, that means that there is no length and no data - which has to be taken into account in the code.

In the second patch leading up to moving the implementation to its own namespace, we check the version of the tokens we receive (and assert that the tokens we send are the right version as well). This, of course, is the version of the RFC - not necessarily the version of the GSSAPI standard for which we communicate tokens. It is very good practice to implement at least some kind of versioning in anything your serialize, so you can remain interoperable when the software and/or the specifications evolve. There are various ways of doing this. The authors of RFC 1961 chose to have a single version byte in the structure - which is a very common approach.

In the final patch, we move the implementation into its own namespace. We also move it into its own directory, in anticipation of having similarly-named files elsewhere in the project and in order to reflect the namespaces in the directory structure, which is by no means a requirement of the language (which in Java, for example, it is), but I do think it is a good practice. As you can see, there isn't much else to moving the implementation into its own namespace than adding a `namespace` declaration with a name and wrapping the code in a block. The name of the namespace is `Vlinder::Chausette::RFC1961`. I chose this name out of convention: Vlinder is the company name (Vlinder Software); Chausette is the project name; RFC 1961 is the part of the project being implemented. This is predictable (which is a Good Thing) and has very little chance of conflicting with namespaces other people might use implementing the same thing. Most companies won't put their own name as a namespace - and you won't find the `Vlinder` namespace in libraries such as [Arachnida](http://arachnida.sf.net) or [Funky](http://funky.vlinder.ca/) either, because it is a practice I haven't started using for a long time yet, but I think it is a good practice nonetheless.

Now, the next step is to create a program that will communicate a token over the network. We'll start by creating a skeleton of that program with two classes in it: one `Server` class and one `Client` class. Each of those classes will look basically the same for now, so let's just take a look at the `Client` class: 
    
    #ifndef chausette_tests_rfc1961_client_h
    #define chausette_tests_rfc1961_client_h
    
    class Client
    {
    public :
    	Client(bool & done);
    
    	Client & operator()();
    	bool done() const;
    
    private :
    	bool & done_;
    	bool client_done_;
    };
    
    #endif

As you can see, this class overloads the function call operator, which means the class itself (or rather, an instance of this class) is executable as a function. This is what we call a _functor_. The reason for this class to be a functor is so we can use it directly to start a thread with, like so: 
    
    Client client(done);
    boost::thread client_thread(boost::ref(client));

The class also has a member called `done` which will return a boolean value indicating whether the client is done processing everything it needs to process. It also contains a reference to a flag indicating that the implementation around it is done (which is appropriately called `done_` as well). In our skeleton implementation, there's not much for a client to do, but our server will spin until it is told the implementation is done, like so: 
    
    while (!done_)
    {
    	boost::thread::yield();
    }

That code is in this patch.

Before we go much furhter, there is something I would like you to note about the bit of code that creates the thread. If you look carefully, you'll see that we use a _reference wrapper_ to pass the client functor to the thread class. The reason for this is that the thread class needs to retain a copy of whatever we pass to it, which it has to be able to call as a function, but we don't want it to actually copy our functor. In order to allow for both ourselves and the thread class to be happy, we use `boost::ref` to wrap a reference to our instance and pass it as an object to the thread class.

Now for the final step for today's installment, in which we will send a token from a client to a server and display it on the server end. All of the code is in this patch, which we will start dissecting right away. You might notice two changes to the Token class and associated code. The change in Token.cpp allows us to dump a token in a human-readable fashion; the change in Token.h allows us to know the maximum size of a token, in bytes. I could have used `sizeof` for this but I don't want to get stuck on using a POD. I won't discuss these two changes in more detail than that - I hold them to be self-evident. If they aren't, please feel free to ask.

Let's first take a close look at the server implementation. Here's the complete code, we'll cut it in pieces afterward:
    
    Server & Server::operator()()
    {
    	enum State
    	{
    		listening__,
    		accepting__,
    		reading__,
    		error__,
    	};
    
    	int socket(::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP));
    	if (socket == -1)
    	{
    		done_ = true;
    		std::cerr << "Failed to create socket" << std::endl;
    		throw std::runtime_error("Failed to create socket");
    	}
    	else
    	{ /* all is well */ }
    	struct SocketGuard
    	{
    		SocketGuard(int & s)
    			: s_(s)
    		{ /* no-op */ }
    
    		~SocketGuard()
    		{
    			if (s_ != -1)
    			{
    				close(s_);
    			}
    			else
    			{ /* Not something I can close */ }
    		}
    
    		int & s_;
    	} socket_guard(socket);
    	sockaddr_in address;
    	memset(&address;, 0, sizeof(address));
    	address.sin_family = AF_INET;
    	address.sin_port = htons(port_);
    	address.sin_addr.s_addr = htonl(0x7f000001);
    	if (::bind(socket, (sockaddr*)&address;, sizeof(address)) != 0)
    	{
    		done_ = true;
    		std::cerr << "Failed to bind socket" << std::endl;
    		throw std::runtime_error("Failed to bind socket");
    	}
    	else
    	{ /* all is well */ }
    	if (::listen(socket, 0) != 0)
    	{
    		done_ = true;
    		std::cerr << "Failed to listen on socket" << std::endl;
    		throw std::runtime_error("Failed to listen on socket");
    	}
    	else
    	{ /* all is well */ }
    
    	State state(listening__);
    	fd_set read_fds;
    	int client_socket(-1);
    	SocketGuard client_socket_gaurd(client_socket);
    	std::vector< char > buffer;
    	buffer.reserve(Token::max_token_size__);
    	while (!done_)
    	{
    		switch (state)
    		{
    		case listening__ :
    			{
    				std::clog << "Listening for a new connection" << std::endl;
    				timeval timeout;
    				timeout.tv_sec = SERVER_TIMEOUT / 1000;
    				timeout.tv_usec = (SERVER_TIMEOUT % 1000) * 1000;
    				FD_ZERO(&read;_fds);
    				FD_SET(socket, &read;_fds);
    				int select_result(select(socket + 1, &read;_fds, 0, 0, &timeout;));
    				if (select_result < 0)
    				{
    					state = error__;
    				}
    				else if (select_result == 0)
    				{ /* nothing to do in this case: we timed out */ }
    				else
    				{
    					if (FD_ISSET(socket, &read;_fds))
    					{
    						state = accepting__;
    					}
    					else
    					{ /* dunno what happened - there should be no such thing as a spurious wake-up here.. */ }
    				}
    			}
    			break;
    		case accepting__ :
    			std::clog << "Accepting a new connection" << std::endl;
    			client_socket = accept(socket, 0, 0);
    			state = reading__;
    			break;
    		case reading__ :
    			std::clog << "Reading from connection" << std::endl;
    			if (client_socket == -1)
    			{
    				state = error__;
    				break;
    			}
    			else
    			{ /* all is well - carry on */ }
    			buffer.resize(Token::max_token_size__);
    			ssize_t received(recv(client_socket, &buffer;[0], buffer.size(), 0));
    			if (received <= 0)
    			{ /* nothing to do here */ }
    			else
    			{
    				buffer.resize(received);
    				assert(buffer.capacity() == Token::max_token_size__); // shouldn't deallocate memory just because this token is smaller
    				Token received_token(deserialize(buffer));
    				std::cout << received_token << std::endl; // dump it to the console
    			}
    			close(client_socket);
    			client_socket = -1;
    			state = listening__;
    			break;
    		case error__ :
    		default :
    			done_ = true;
    			break;
    		}
    	}
    
    	done_ = true;
    	return *this;
    }

Right off the bat, here's what you can see: 

  1. this is an overloaded function-call operator `operator()` that doesn't take any parameters


  2. at the end of the function, there's a big loop with a big switch statement in it, which is what a primitive state machine looks like
  3. at the start of the function, there's an enumerator `State`, which reinforces the idea that this is a state machine
  4. there's some C-like code interspersed with a type declaration and a few bits of code that are unmistakably C++


So, what's going on? Well, this is what some real-life code will look like in some cases: it needs cleaning up (which we will do in a later installment) and it has a few pretty primitive constructs but it'll get the job done. The bits of C stem from the fact that the network API used in this code, BSD sockets, is a C API. For most intents and purposes, C and C++ mix very well, but they are not the same language. Note, though, that this code has not been ported to Windows yet: Windows implements something very close to BSD sockets, but this implementation uses the version defined in the [Single Unix Specification](http://www.unix.org/online.html). We'll port it to Windows in another installment.

From top to bottom, what this code does is create a socket 
    
    int socket(::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP));
    if (socket == -1)
    {
    	done_ = true;
    	std::cerr << "Failed to create socket" << std::endl;
    	throw std::runtime_error("Failed to create socket");
    }
    else
    { /* all is well */ }

and give ownership of it to an [RAII object](http://landheer-cieslak.com/3-resource-allocation-and-raii/)
    
    struct SocketGuard
    {
    	SocketGuard(int & s)
    		: s_(s)
    	{ /* no-op */ }
    
    	~SocketGuard()
    	{
    		if (s_ != -1)
    		{
    			close(s_);
    		}
    		else
    		{ /* Not something I can close */ }
    	}
    
    	int & s_;
    } socket_guard(socket);

Note that all this `SocketGuard` class does is close the socket when it's destroyed, but that also means I don't have to do any `try`/`catch`ing anywhere, which is a good thing because there are a few `throw` statements in there. Once the socket is bound to an address (which is the same as saying that it has been given a name - in this case the IP address and the TCP port) we tell the system that we want to listen for incoming connections. There are a few important notions for network programming: we will be using a streaming protocol, meaning the boundaries of messages sent over the line may be blurred by the underlying protocol: if the client sends its data fast enough, we'll get it all at the same time. This protocol, the Transmission Control Protocol, gives us a few guarantees: data sent in a given order will arrive in the same order, and no data will be sent by the client without being received by the server - otherwise, the client is notified of the error. All this comes at a cost which makes TCP a poor choice for some applications, but the benefits outweigh the costs in other applications. In our case, the authors of the SOCKS RFCs apparently came to the conclusion that the benefits outweighed the costs.

Once the socket is put in a listening mode, we want to accept new connections. However, the surrounding system may well want us to stop accepting connections - and at some time, we might want to do more than just accepting connections. That is why we'll be using the `select` call here: it is described as a _synchronous multiplexing_ function in that it will tell you which file descriptors (or sockets in our case) are ready to be read from, written to, or have out-of-bound data. For the moment, we are only interested in sockets we can read from, as that is how new connections are signalled. So, when our little, primitive, state machine is in the _listening_ state, we will wait on `select` for a number of milliseconds (note the odd bit of math around line 73:
    
    timeval timeout;
    timeout.tv_sec = SERVER_TIMEOUT / 1000;
    timeout.tv_usec = (SERVER_TIMEOUT % 1000) * 1000;

As we define the `SERVER_TIMEOUT` constant in milliseconds, we have to divide by 1000 to get the seconds, and multiply the remainer by 1000 to get the remaining microseconds). If it times out, we check the `done_` flag (line 66) and start over. If it doesn't time out, we have a connection, in which case we go into the _accepting_ state to accept the connection and fall through to the _reading_ state. I say "fall through" but due to the `break` on line 100 we actually check the `done_` flag between the two.

Once in the _reading_ state we forget all about our multiplexing and just call a blocking `recv`. Once we have our token, we dump it to `std::cout`, close the socket and go back to listening for new connecitons.
    
    case reading__ :
    	std::clog << "Reading from connection" << std::endl;
    	if (client_socket == -1)
    	{
    		state = error__;
    		break;
    	}
    	else
    	{ /* all is well - carry on */ }
    	buffer.resize(Token::max_token_size__);
    	ssize_t received(recv(client_socket, &buffer;[0], buffer.size(), 0));
    	if (received <= 0)
    	{ /* nothing to do here */ }
    	else
    	{
    		buffer.resize(received);
    		assert(buffer.capacity() == Token::max_token_size__); // shouldn't deallocate memory just because this token is smaller
    		Token received_token(deserialize(buffer));
    		std::cout << received_token << std::endl; // dump it to the console
    	}
    	close(client_socket);
    	client_socket = -1;
    	state = listening__;
    	break;

Note a few caveats in this code (other than `recv` being a blocking call, which is odd in this context). On line 110, I've resized the vector into which I'll be receiving the data, and on line 116 I resize it again. The reason for this is that I don't want the vector implementation to overwrite the data in the vector when I tell it what amount of data I got. This is less than ideal, but writing a buffer class is outside the scope of today's installment. Note, though, that I do assert that the vector implementation won't mess up and start allocating and de-allocating memory for nothing (line 117).

On the client's side, things are a bit easier: 
    
    Client & Client::operator()()
    {
    	int socket(::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP));
    	if (socket == -1)
    	{
    		done_ = true;
    		std::cerr << "Failed to create socket" << std::endl;
    		throw std::runtime_error("Failed to create socket");
    	}
    	else
    	{ /* all is well */ }
    	struct SocketGuard
    	{
    		SocketGuard(int & s)
    			: s_(s)
    		{ /* no-op */ }
    
    		~SocketGuard()
    		{
    			if (s_ != -1)
    			{
    				close(s_);
    			}
    			else
    			{ /* Not something I can close */ }
    		}
    
    		int & s_;
    	} socket_guard(socket);
    	sockaddr_in address;
    	memset(&address;, 0, sizeof(address));
    	address.sin_family = AF_INET;
    	address.sin_port = htons(port_);
    	address.sin_addr.s_addr = htonl(0x7f000001);
    	if (::connect(socket, (sockaddr*)&address;, sizeof(address)) != 0)
    	{
    		done_ = true;
    		std::cerr << "Failed to make the connection!" << std::endl;
    		throw std::runtime_error("failed to make the connection!");
    	}
    	else
    	{ /* all is well */ }
    	Token token_to_send(Token::failure__);
    	std::vector< char > data(serialize(token_to_send));
    	ssize_t sent(::send(socket, &data;[0], data.size(), 0));
    	if (sent <= 0)
    	{
    		std::cerr << "Failed to send";
    	}
    	else
    	{
    		std::clog << "Client is done" << std::endl;
    		sleep(1);
    	}
    
    	client_done_ = true;
    	return *this;
    }

The first 34 lines are the same for both. After that, the client connects to the server (of which the name, or address and port, is specified in the `address` variable) and send the token, which is first serialized into a vector.

Vectors are almost-ideal buffers for this kind of data, because they guarantee contiguous data storage, which means you can use them as managed buffers which you can resize at will.

Note that the client takes a nap when it succeeds, on line 53. This is because the server is still in the same process - but it's still wrong to do this.

Finally, the main function, revisited: 
    
    int main()
    {
    	bool done(false);
    	Server server(done, TEST_PORT);
    	boost::thread server_thread(boost::ref(server));
    	Client client(done, TEST_PORT);
    	boost::thread client_thread(boost::ref(client));
    
    	do
    	{
    		boost::thread::yield();
    		done = client.done() || server.done();
    	} while (!client.done() || !server.done());
    
    	return 0;
    }

Once the server and the client are created - they both now take the port number to connection should be made with - and the threads are created as well, the main function just cycles around until both the client and the server are done. Yet, again, there is something slightly wrong with this picture.

All of this works, all of it would probably pass a code review and would certainly pass tests, but in each and every part of the code, there is something a bit off: code that is copied, rather than shared, between the client and the server; a `sleep` in the client to allow the server to do its work, an overly long switch statement in a large loop to implement a rather primitive state machine, and I haven't even talked about the hard-code magic numbers and the odd, blocking call to `recv` yet. Why post this code and leave all these bugs in there?

Well, for one thing, to point them out to you: this type of code is very common and, if you get to a point where you start working as a programmer professionally, you may well run into this type of code - or worse. You need to be able to navigate your way around in it, but you also need to be able to improve it - which you may consider your "homework" if you will: 

  1. change the copied code between server and client to shared code between the two
  2. make sure that once a connection is accepted the server doesn't block until the client writes
  3. break the server's code up into pieces
  4. remove the sleep from the client code - but make sure the server still gets time to do its job
  5. **Bonus:** repair the main function (if you can find the error)
  6. **Bonus:** find and remove the race condition
  7. **Bonus:** enforce, in the code, the fact that we don't want instances of the `Server` and `Client` classes to be copied
If you have time left, try porting it to Windows (easier than you might think).
