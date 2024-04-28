---
author: rlc
comments: true
date: 2009-08-08 18:59:29+00:00
layout: post
title: How Data Transport Should Work IMNSHO
wordpress_id: 146
categories:
  - Software Design
tags:
  - Posts that need to be re-tagged (WIP)
---

One of the most ubiquitous problems in software design is to get data from one place to another. When some-one starts coding code that does that, you seem to inevitably end up with spaghetti code that mixes the higher-level code, the content and the transport together in an awful mix that looks like a cheap weeks-old spaghetti that was left half-eaten and abandoned next to a couch somewhere. Now, I have never seen what that actually looks like, but I have a rather vivid imagination - and I'll bet you have too.

<!--more-->

In my opinion, there is a right way to do it - and there are many, many wrong ways. The _right_ way is trying to chop your data into messages and building a transport layer that is compeltely ignorant of those messages. The GS1 EPCGlobal standards, with which I have worked for the last few years, up until a few months ago, got this exactly right and since I first read their model in 2007, I have applied it in numerous occasions and have started to advocate it whenever there was a reason to do so. I have since refined a few aspects of it to better suit my purposes, so I think it's about time I did some explaining.

In my opinion, there is a single, universal way to get a bit of information - no matter the size or the contents - accross from one location to another: you simply split the logic that you need to get it accross into three _layers_: the **Application Layer**, the **Message Layer** and the **Transport Layer**.

## The Application Layer

The Application Layer contains all the high-level logic that is basically not involved in getting data from one point to another _and should not be aware_ that there is any other "point" that data might have to go to. All it is interested in is getting things done, no matter how it gets those things done. It reacts to events, which comes in the form of messages, and it generates events, in the form of messages as well. it knows how to handle the _contents_ of those messages and, on an API level, it knows how to extract the contents from the messages - i.e. it knows which methods to call on the Message object to get the contents out. What it does not know, and does not need to know, is where the message came from (in the case of events) or where the message is going to (in the case it generates them) - unless that has some semantic value, in which case it will get it from the message itself.

When the application layer receives a message, the message has already been validated. That means that it doesn't need to worry about the validity or the authenticity of the contents of the message: the only thing the Application Layer is concerned with is the semantic value of the contents of the message. I.e. if a message tells the Application Layer to do something and it is possible for it to do so, it should do so.

### Channels

From the Application Layer's point of view, there are two ways for it to receive a message, which are semantically different from each other and, from its point of view, constitute two different _channels_: there is the _Event Channel_ on which it will receive normal events that it needs to know about in order to perform specific actions, and there is the _Exception Channel_ on which it will receive exceptional messages - such as alarms - that require immediate action. If the Application Layer is not concerned with exceptions or events, it will simply ignore the existence of these two channels altogether - i.e. if there is no need to know, it shall not know.

A this channel, the _Data Channel_, is used by the Application Layer to emit queries. Those queries may or may not elicit a response and that response may or may not be delivered asynchronously.

The Message-Transport Binder

In order to subscribe to the event and exception channels and in order to use the data channel, the Application Layer uses an object called the _Message-Transport Binder_ or MTB for short. This object, which is largely opaque to the Application Layer, knows a bit more about the Transport Layer and the Message Layer - i.e. it knows enough to bind them together and expose a coherent API to the Application Layer.

The MTB, which would usually be a self-contained singleton, exposes at least the following methods:

- send(Message): Message
- send(Message, NoResponseTag): void
- expect(Message, Message): void
- attach(Channel, Observer): void
- detach(Channel, Observer): void

The first method sends a message and returns the resulting response; the second sends a message and doesn't return anything; the third sends a message and expects another message as a response, and will raise an exception if the two don't match; the third attaches an object as an observer to one of the two observable channels (the event channel and the exception channel) and the third detaches such an observer, providing a no-fail guarantee. The first four methods all provide a strong guarantee. (If implemented in a language that allows for return-type overloads, the first and second methods can be overloaded on return type rather than using a tag to distinguish them.)

These five methods constitute the "low-level API" of the message-transport binder. This API is considered low-level because the Appplication Layer, in order to use this API, needs to know the Message Layer, because it needs to create its own messages. The MTB may also expose a higher-level API, for which the Application Layer need not know the Message Layer at all (because it would be used behind the scenes) but which would be specific to the application in question.

## The Message Layer

Completely oblivious to the business logic of the Application Layer and as ignorant about the way the messages will be transported - which is the domain of the Transport Layer - the Message Layer is concerned with wrapping contents into a message that can be understood on both ends of the communication channels. It provides the tools to create a Message object that allows the Application Layer to extract the contents from the message and/or to wrap the contents into a message, and to serialize and deserialize a message, which allows the Message-transport Binder to pass the message onto the Transport Layer without the Transport Layer knowing anything about messages, and vice-versa.

The API consists of any number of overloads of a _getMessage_ function, each of which returns an opaque Message object with the contents neatly tucked into it. Other than that, the Message Layer API consists of the Message type itself, a way to create association and validation masks for messages (for asynchonous message validation - see below) and a way to serialize/deserialize messages into a memory buffer. Hence, the Message Layer is partly aware of the higher-level communications protocol: it knows how a message is formatted (serialized), how a response is associated with a query and what query corresponds to what message. What it does not know is what those queries/messages mean, semantically (that's what the Application Layer is about) nor how they are transported from one Application Layer to another (that's what the Transport Layer is about).

## The Transport Layer

This is where we see our three channels again, though this time, the code in question doesn't know, semantically, what those channels are about. The Transport Layer is completely oblivious to the contents, format and semantics of the messages it transports: it sees it simply as data that may be provided with a little bit of meta-data to allow it to perform some actions asynchronously - namely associating and validating response messages.

The Transport Layer is the only part of the message transport that is concerned with things like Transport Layer Security (TLS, SSL, etc.) authentication (TLS and SSL again), TCP/IP, addressing, etc. While the Message-Transport Binder _may_ know how to map a symbolic node name to an IP address, that is
all that it would know about addressing. The Transport Layer, which may or may not be implemented as a device driver in some cases, knows how to get a message from address A to address B.

It provides a similar API to the low-level MTB API:

- send(Buffer, AssociationInfo): Buffer
- send(Buffer): void
- expect(Buffer, ValidationInfo): void
- attach(Channel, Observer): void
- detach(Channel, Observer): void

The first method is provided with a buffer to send - which corresponds to the serialized message, but the Transport Layer doesn't know that - and is given the meta-data necessary to associate an incoming message from the data channel with the message it sent. The AssociationInfo object contains three bits of data:

1. an expected message length: any message that arrives on the data channel that is not of the required length cannot be associated with the message in question;
2. an association mask and
3. an association value

Any message that arrives on the data channel (as a return message) is checked for its length after which the association mask is applied to the message. If the masked value corresponds to the assocation value, the message is returned as the return message for the one that was originally sent. The reason for this is that, although the Application Layer may not be interested in a response for certain messages, the other end of the communication (which receives those messages as an event) may return something (i.e. respond on their event channel, which is the data channel on our side). If those messages aren't matched, they'll be ignored but, in order to be able to ignore them, the Transport Layer needs to know how to associate the two.

The second method is similar to the first, but doesn't take any association info, so the Transport Layer won't try to get a response message and any response message that it does get will simply be ignored.

The third message goes a step further than the first: it will not only associate the return message with the sent message but, once the association is done, will apply a second mask to the message (the _validation mask_) and will compare that with the _validation value_. If the two correspond, all is well. If not, an exception is raised. It is conceivible, in certain cases, for this exception to be delivered asynchronously - e.g. in the case where the Transport Layer is implemented in a device driver. In either case, the way the association and validation is done remains the same - and is actually done without any knowledge of what the message might _mean_. If the validation match isn't successful, the raised exception will, of course, contain the received message - as long as the association _was_ successful.

The fourth and fifth methods are exactly the same as they were for the Message-Transport Binder.

# Conclusions

This way of splitting the application (business) logic from the message layer and transport layer, the barrier in between being the Message-Transport Binder, allows for any type of message to be transported over any type of transport, the message having any type of meaning without _any_ of the components being dependant on the other two: chaning the transport affects only the Transport Layer and (very minimally) the Message-Transport Binder (which has to be linked to a new Transport Layer, with the same old API). Adding messages to the protocol affects the Message Layer and the little bit of code that actually uses the new message - which might be in the MTB or in the Application Layer. Changing the message format affects only the Message Layer - so going from, e.g., XML to a binary format is now a matter of hours (i.e. re-writing the serialize/deserialize fucntions), not days or weeks.

As neither the Message-Transport Binder nor the Message Layer nor the Transport Layer are concerned with the application logic, they are not concerned with anything that might happen in that level either. Adding new actions for a given event, or ignoring events that were previously treated, is now an affair _only_ of the Application Layer. The other two layers (and the MTB) are in no way concerned by any of that.
