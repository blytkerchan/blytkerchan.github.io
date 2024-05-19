In [July last year](/blog/2014/07/ics-security-current-and-future-focus/), I discussed why Adam Crain and Chris Sistrunk fuzzed DNP3 stacks in devices from various vendors, finding many issues along the way (see [project Robus](https://automatak.com/robus/)). This time, I'll provide a bit of an overview of what has happened since.

<!--more-->

In a nutshell:

- [EPRI](http://epri.com), the Electric Power Research Institute, held a DNP3 Secure Authentication interoperability event to demonstrate the interoperability of various devices that implement DNP3 Secure Authentication

- Development of the DNP3 Key Management Protocol (DKMP) was started

- The DNP3 Technical Committee held a face-to-face meeting during which security was a recurring subject

- Project Robus expanded to test (at least one) Modbus implementation

- TLS and Secure Authentication support is being added to [OpenDNP3](https://github.com/automatak/dnp3), the only F/OSS implementation of DNP3

## EPRI DNP3 Secure Authentication interoperability event

In autumn 2014, EPRI held an event with several device vendors to demonstrate the interoperability of DNP3 Secure Authentication stacks, both version 2 and version 5 (versions 1, 3 and 4 were intermediate versions that were never part of IEEE-1815). A complete report is available [here](http://www.epri.com/abstracts/Pages/ProductAbstract.aspx?ProductId=000000003002003736) but the TL;DR is that SAv2 and SAv5 can coexist with DNP3 without SA as well as with each other; that different implementations interoperate almost seamlessly; and that implementation choices that are pretty well universal are to exclude support for asymmetric keys and to exclude multi-user support.

There is much to be said about the merits of Secure Authentication, and the EPRI report discusses those merits in some detail. What they really showed in this event, though, is that the vendors that participated are ready for wide deployment of SAv5.

One thing that was clearly missing -- and pretty much kicked off on the spot -- was a protocol to manage Update Keys.

## The start of DKMP, the DNP3 Key Management Protocol

<blockquote>Cryptographic key management was a particular challenge because the interface between some of the components has not yet been designed. This project performed much of that design and laid the groundwork for standardizing the interface. -- DNP3 (IEEE Std 1815™) Secure Authentication: Implementation and Migration Guide and Demonstration Report</blockquote>

DNP3 is a SCADA protocol. As such, it is not geared towards key management and large parts of the behind-the-scenes stuff that is needed to bootstrap Secure Authentication is largely unspecified.

This means that different vendors come up with different solutions, often geared towards their own tools and not always completely thought through. This could rapidly become a problem for users, especially as SA becomes more popular.

To mitigate this potential problem, EPRI and some of the vendors present -- most notably [Triangle MicroWorks](http://www.trianglemicroworks.com) -- started work on the DNP3 Key Management Protocol.

At this point, it looks like it will become a non-normative annex to the next edition of IEEE 1815. That means it will become an optional addition to DNP3, which in turn means it will take quite some time before enough vendors implement it to be useful -- unless, of course, utilities start pushing hard for it, or there is a strong regulatory mandate, neither of which seems very likely at the moment.

## The DNP3 technical committee face-to-face

Aside from conformance tests, there was a strong focus on security at F2F2014, and there will likely be a strong focus on it again for F2F2015.

For one thing, there was a potential low-bandwidth denial-of-service attack that was made possible through an "extension" of the specification: a variable-sized object (octet strings) could have zero-length (for zero-length strings) and would then be encoded without using any bytes in the message -- which potentially allowed either a master or an outstation to send a very small packet with seemingly thousands of empty objects, resulting in a near-endless loop.

The hole was plugged by simply clearly stating that this is not allowed: zero-length strings with existing means are not supported by the protocol. According to how you interpret the existing specification, this was already the case, but now it's explicit.

To allow for zero-length strings, quite a few changes to the protocol were proposed, ranging from the introduction of iterators (that would have been nice) to Pascal-style strings. In the end, most of the proposals died on the table, and only the Pascal-style strings remained. Authoring the technical bulletin that specified the new object (and continued participation in the tech committee) earned me the right to vote, which is also nice.

Many other discussions about security occurred, but I think F2F2015 will be far more interesting in that regard.

## Robus

Robus made far fewer waves than I had expected, with only one CERT advisory for Modbus and another for a protocol I had never heard of (Telegyr 8979). I had expected Modbus to present a number of easy targets, as there are many, _many_ ad-hoc implementations.

## OpenDNP3

OpenDNP3 is the only Open Source DNP3 implementation worth its salt. It describes itself as the "de facto reference implementation of IEEE 1815-2012". It is maintained by Adam Crain (the same Adam Crain who is behind project Robus), who has been adding TLS and DNP3 SAv5 support to his stack, which means there will soon be an Open Source DNP3 SA implementation.

# Conclusion

I've only looked at DNP3 here, but using DNP3 as an indicator, it looks like the industry is becoming more security-aware.

This does not mean that we're out of the woods, though: there are still devices being developed today that expect their configuration tool to authenticate the user (and do not check username/password themselves) -- which basically shows that not all developers understand what this is about, which means we still have some work to do.