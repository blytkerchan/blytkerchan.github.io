---
author: rlc
comments: true
date: 2010-10-23 03:36:16+00:00
layout: post
permalink: /blog/2010/10/why-ipv6-matters/
slug: why-ipv6-matters
title: Why IPv6 Matters
wordpress_id: 1082
categories:
- Business
- Computers and Society
- Opinions
- Technology
tags:
- Posts that need to be re-tagged (WIP)
---

Given the rapid growth of the Internet, and the number of Internet-enabled devices, we are running out of IPv4 addresses - fast. This is a problem mostly for ISPs and large businesses who allocate their own public IP addresses from pools of addresses and sell or sub-let those addresses to .. us. When _they_ run out of addresses, as with any finite resource, the _haves_ will once again be pitted against the _have-nots_ and the Internet will become less egalitarian. But that is not the only reason why you should be interested in IPv6: more important than the 340 trillion, trillion, trillion addresses that the 128-bit address space of IPv6 allows (as opposed to the "mere" four billion of IPv4) are IPv6's _other_ features.
<!--more-->
The Obama administration hosted a workshop on the importance of the adoption and deployment of IPv6 addresses for industry, the U.S. Government, and the Internet economy on sept 29 of this year at which the federal Chief Information Officer presented a memo which explains why the U.S. government is interested:


<blockquote>The Federal government must transition to IPv6 in order to:
<ul><li>Enable the successful deployment and expansion of key Federal information technology (IT) modernization initiatives, such as Cloud Computing, Broadband, and SmartGrid, which rely on robust, scalable Internet networks;</li>
<li>Reduce complexity and increase transparency of Internet services by eliminating the architectural need to rely on Network Address Translation (NAT) technologies;</li>
<li>Enable ubiquitous security services for end-to-end network communications that will serve as the foundation for securing future Federal IT systems; and,</li>
<li>Enable the Internet to continue to operate efficiently through an integrated, well-architected networking platform and accommodate the future expansion of Internet-based services.
</li></ul> 

</blockquote>


Right in the first bullet-point, the memo mentions two key reasons why IPv6 is necessary: the Smart Grid and Cloud Computing.

Cloud Computing is, of course, the abstraction of the hardware and/or platform applications run on in order to become scalable to immense proportions. There are basically three types of clouds: Software-as-a-Service (SaaS) clouds, Platform-as-a-Service (Paas) clouds and Infrastructure-as-a-Service (IaaS) clouds. All three of these need to scale and all three are made a lot easier to implement - if not plainly possible - by IPv6.

The other is the Smart Grid. The Smart Grid is basically a complete overhaul of the electricity grid, making individual devices in the grid (from the controls that are up in the electricity pole to the substations, to the SCADAs in the nuclear plants , etc. Among other things, this means that it won't just be your computer, a server, etc. who will be using the Internet: the electricity grid, the phone grid, etc. will all be using the same Internet.

This means that that Internet needs to be robust, secure and scalable.



### IPv6 Robustness




#### Keeping connections alive


IPv6 provides better robustness through a few different means: for one thing, it eliminates the need for NAT (Network Address Translation) through its much larger address space. That means that every device has its own address that is not translated along the way. NAT works fine for IPv4 as long as there is only one level of it: as soon as there is more than one translation taking place, there is a good chance of problems occurring. Those problems get worse as more translations take place. As IPv6 eliminates the need for NAT, these problems go away.

For an example of the kinds of problems you might encounter: consider dialing some-one at a large business or university. You usually get a phone number, followed by another number (the extension). The other person will see, on the display of their phone, the phone number you are dialing from - but not the extension. If something goes wrong during the call - the connection is dropped - you have to re-dial the phone number, followed by the extension again.

Now, as IPv4 and IPv6 are both routed protocols, the thing that can go wrong during a "call" is that a route changes: you might go from one gateway to another, for example. The problem is that the new gateway has a different IP address than the one you were using. As you are hiding behind that IP address, the address seen by the device you were communicating with now changes, which means that from that device's point of view, you are some-one else. That means that the connection will be dropped, because a connection (in TCP/IP parlance) consists of a pair of two IP addresses (and two ports).

If, in stead, the other device can see your real address, it will recognize you for who you (still) are and the connection will be kept alive.



#### Auto-configuration


Another point where robustness is concerned is in configuration: many of the problems you will encounter when you try to connect a device to the Internet, and keep that device connected for a while, are configuration problems. Networks change, and so do the local IP addresses used on them Gateways change, get replaced, etc.

IPv6 has two separate ways of automatically configuring a device: a _stateful_ configuration, done using DHCP (similar to IPv4's DHCP, but more flexible) and a _stateless_ configuration, which doesn't need a server - at all. This is useful when you consider broadband access, where depending on the current layout of your network, you might want your users to change the routes they're using to access the Internet. In IPv4, such a change would be difficult to accomplish because it would have to go through DHCP if the client device would need to be aware of it, and in most cases it would break any existing connections the client device might have (due to the NAT problem described above). In IPv6, stateless autoconfiguration allows the network to change dynamically without losing any connections.



#### Mobility


Most of us who own cell phones will know that one of the nicest features of a cell phone network is that you can go from one place to another (e.g. in the passenger's seat of a car, while some-one else is driving) while communicating. IPv4 is very bad at this, mostly due to NAT (again): hopping from one router to another will often make you change your local IP address and will almost always change the address through which you're visible to the outside world - which will break all your connections.

In order to receive calls on an IPv4 device, special infrastructure (routers) is needed for them to accommodate the devices. With IPv6, all the necessary features (including ingress filtering and optimized routing) are built-in.



### Speed


Aside from robustness, speed is an important issue: in order to accommodate large volumes of traffic to allow everyone to download music and video as well as do less important things ;) relatively small-footprint devices have to be able to quickly parse the IPv6 headers. The IPv6 header is both more flexible and simpler than the IPv4 header: all the optional stuff that bloats the IPv4 header has been removed from the IPv6 header. All that's left is the strict minimum for a router to know what to do with it. Along with a few restrictions - such as the fact that a router will never fragment an IPv6 packet and that the end-points should therefore make sure they negotiate a packet size that will be able to traverse the whole route from A to B - this makes for a faster network.



#### Streaming


Two things are important for streaming: when streaming point-to-point, the quality of service (each packet getting quickly from A to B) is important. When streaming from one point to many (e.g. a live radio or television broadcast stream) multicasting is important in that you shouldn't have to separately send the same information to each client.

IPv6 improves in both these areas: the IPv6 header contains a special field the _flow label field_ which allows routers to know how to treat a given packet and prioritize some packets over others, and IPv6 has multi-cast support, allowing a single packet to be delivered to any number of devices in the same group.

This means that while currently, to watch _The National_ live on the Internet, the CBC has to allow you to connect to it, with IPv6 you'll just have your computer subscribe to the group that receives the multicast, and the routers will do the rest. This means less bandwidth is wasted and that extra bandwidth that is now freed up can be used for other things.



### Security


Unlike IPv4, which was designed without any idea of security in mind, IPv6 was designed with security in mind from the get-go. IPSec is a mandatory part of IPv6 and provides for _mutual authentication_ as well as _encryption_ of the data.

Security is about four things: _Confidentiality_, _Integrity_, _Availability_ and _Non-Repudiation_. That means that the data exchanged should not be comprehensible to someone eavesdropping, and you should know who you're talking to. You should also be able to make sure that the data you receive was the data that was sent on the other end, and it should be hard to make communications impossible. As with any communications protocol, availability is hard to guarantee as it is easy to unplug a cable. The other three ingredients, however, can be taken care of using software and communication protocols. Confidentiality and Integrity are given by using IPSec's security protocols. For non-repudiation you just need to add logging - which is not part of the protocol.

IPSec _can_ be implemented with IPv4, but is not a standard part of IPv4. It is part of IPv6.



### Conclusion


So, why should you care about IPv6?

It will make the Internet more robust, more secure, faster and less expensive (because it will be more efficient).
