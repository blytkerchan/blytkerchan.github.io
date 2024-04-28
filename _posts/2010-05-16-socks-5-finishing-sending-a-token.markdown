---
author: rlc
comments: true
date: 2010-05-16 12:00:22+00:00
layout: post
title: "Socks 5: Finishing sending a token"
wordpress_id: 625
categories:
  - C++ for the self-taught
tags:
  - Posts that need to be re-tagged (WIP)
  - SOCKS
---

In this installment, we will finish the implementation for sending a token from the client to the server. We will answer the remaining open questions and, in doing so, improve the code a bit more. When we're done, we will have a client that sends a token to the server, and a server that reads the token and parses its envelope - which is a pretty good foundation to build on. We will later make that foundation a bit more solid by removing the classes involved from the test code and moving them to their final locations. First, however, let's take a look at those questions and the answers.

<!--more-->

There will be fairly little prose in this installment, and perhaps a bit more code than usual, but a line of code speaks a hundred words (not quite as efficacious as a picture, but more so that prose alone).

## Question 4: "remove the sleep from the client code – but make sure the server still gets time to do its job"

Simply removing the sleep does not have the wanted effect: as soon as the client is done, the server will quit as well. Still, at some point, the two will no longer be in the same process so we don't want either of the two to simply sleep for a second so the other can do what it needs to do: ultimately, the server will have to quit when we want it to quit (and not a second later just in case) and the client should quit when done.

The solution for now is to move the wait into the only part of the program that will remain a bit of test code. Let's look at how that's done:

First, we remove the `sleep` from the client

    diff --git a/tests/RFC1961/Client.cpp b/tests/RFC1961/Client.cpp
    index ee677e0..a4e0120 100644
    --- a/tests/RFC1961/Client.cpp
    +++ b/tests/RFC1961/Client.cpp
    @@ -26,7 +26,6 @@ Client & Client::operator()()
     	else
     	{
     		std::clog << "Client is done" << std::endl;
    -		sleep(1);
     	}

     	client_done_ = true;

Then, we add it to the `main` function, with a caveat: I've introduced a new variable `local_done` and renamed `done` to `shared_done` to it's clearer which one is shared and which one isn't. The local copy gets the value first, the shared copy gets the value a second later. That allows for the one-second delay between the client and the server's end.

    diff --git a/tests/RFC1961/main.cpp b/tests/RFC1961/main.cpp
    index 63424df..aba5876 100644
    --- a/tests/RFC1961/main.cpp
    +++ b/tests/RFC1961/main.cpp
    @@ -6,17 +6,19 @@

     int main()
     {
    -	bool done(false);
    -	Server server(done, TEST_PORT);
    +	bool shared_done(false);
    +	bool local_done(shared_done);
    +	Server server(shared_done, TEST_PORT);
     	boost::thread server_thread(boost::ref(server));
    -	Client client(done, TEST_PORT);
    +	Client client(shared_done, TEST_PORT);
     	boost::thread client_thread(boost::ref(client));

     	do
     	{
    -		boost::thread::yield();
    -		done = client.done() || server.done();
    -	} while (!done);
    +		sleep(1);
    +		shared_done = local_done;
    +		local_done = client.done() || server.done();
    +	} while (!(shared_done && local_done));
     	client_thread.join();
     	server_thread.join();

## Question 5: "repair the main function (if you can find the error)"

We've already done this, when I explained how to read a diff.

## Question 6: "find and remove the race condition"

The race conditions is really theoretical only (mostly) but it's still there, so it needs to be repaired. The race condition is between this code in the server

    	socket_ = new Socket;
    	socket_->bind(0x7f000001, port_);
    	socket_->listen();

and this code in the client

    	Socket socket;
    	socket.connect(0x7f000001, port_);
    	ssize_t sent(socket.send(data));

If, for some reason, the client runs its code before the server, it will try to connect to the server while the server is not ready yet - which would be an error.

In order to avoid this from happening, I've added a flag to the server which it will set when it is ready. The `main` function will wait for this flag before starting the client:

    diff --git a/tests/RFC1961/Server.cpp b/tests/RFC1961/Server.cpp
    index 9595290..cbc1da0 100644
    --- a/tests/RFC1961/Server.cpp
    +++ b/tests/RFC1961/Server.cpp
    @@ -16,6 +16,7 @@ Server::Server(bool & done, unsigned short port)
     	, state_(idle__)
     	, socket_(0)
     	, client_socket_(0)
    +	, ready_(false)
     { /* no-op */ }

     Server::~Server()
    @@ -37,6 +38,7 @@ Server & Server::operator()()
     		switch (state_)
     		{
     		case idle__ :
    +			ready_ = true;
     			state_ = listening__;
     			// fall through
     		case listening__ :
    diff --git a/tests/RFC1961/Server.h b/tests/RFC1961/Server.h
    index a89e54b..5cddd02 100644
    --- a/tests/RFC1961/Server.h
    +++ b/tests/RFC1961/Server.h
    @@ -15,6 +15,7 @@ public :

     	Server & operator()();
     	bool done() const;
    +	bool ready() const throw() { return ready_; }

     private :
     	enum State
    @@ -36,6 +37,7 @@ private :
     	State state_;
     	Details::Socket * socket_;
     	Details::Socket * client_socket_;
    +	bool ready_;
     };

     #endif
    diff --git a/tests/RFC1961/main.cpp b/tests/RFC1961/main.cpp
    index aba5876..91dae61 100644
    --- a/tests/RFC1961/main.cpp
    +++ b/tests/RFC1961/main.cpp
    @@ -10,6 +10,10 @@ int main()
     	bool local_done(shared_done);
     	Server server(shared_done, TEST_PORT);
     	boost::thread server_thread(boost::ref(server));
    +	while (!server.ready())
    +	{
    +		boost::thread::yield();
    +	}
     	Client client(shared_done, TEST_PORT);
     	boost::thread client_thread(boost::ref(client));

## Question 7: "enforce, in the code, the fact that we don’t want instances of the Server and Client classes to be copied"

All you need to do to enforce this is declare the copy constructor and assignment operator of the classes of which you want to deny copying.

    diff --git a/tests/RFC1961/Client.h b/tests/RFC1961/Client.h
    index 2bb67d4..5d20878 100644
    --- a/tests/RFC1961/Client.h
    +++ b/tests/RFC1961/Client.h
    @@ -10,6 +10,9 @@ public :
     	bool done() const;

     private :
    +	Client(const Client &);
    +	Client & operator=(const Client &);
    +
     	bool & done_;
     	bool client_done_;
     	unsigned short port_;
    diff --git a/tests/RFC1961/Server.h b/tests/RFC1961/Server.h
    index 5cddd02..c868730 100644
    --- a/tests/RFC1961/Server.h
    +++ b/tests/RFC1961/Server.h
    @@ -18,6 +18,9 @@ public :
     	bool ready() const throw() { return ready_; }

     private :
    +	Server(const Server &);
    +	Server & operator=(const Server &);
    +
     	enum State
     	{
     		idle__,

In the next installment, we'll port the test to Windows.
