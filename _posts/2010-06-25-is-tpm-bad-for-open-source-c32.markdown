---
author: rlc
comments: true
date: 2010-06-25 16:59:04+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/06/is-tpm-bad-for-open-source-c32/
slug: is-tpm-bad-for-open-source-c32
title: Is TPM bad for Open Source? (#c32)
wordpress_id: 795
categories:
- Opinions
tags:
- Posts that need to be re-tagged (WIP)
---

It's been argued that TPM and bill C-32 are bad for Free/Libre Open Source Software development. Is that true? If so, why? If not, why not? Personally, I don't think so, and I'll tell you why.
<!--more-->
Let's first have a look at what you can legally do under C-32: 

<blockquote>30.6 It is not an infringement of copyright in a computer program for a person who owns a copy of the computer program that is authorized by the owner of the copyright, or has a licence to use a copy of the computer program, to

(a) reproduce the copy by adapting, modifying or converting it, or translating it into another computer language, if the person proves that the reproduced copy

(i) is essential for the compatibility of the computer program with a particular computer,

(ii) is solely for the person’s own use, and

(iii) was destroyed immediately after the person ceased to be the owner of the copy of the computer program or to have a licence to use it; or

(b) reproduce for backup purposes the copy or a reproduced copy referred to in paragraph (a) if the person proves that the reproduction for backup purposes was destroyed immediately after the person ceased to be the owner of the copy of the computer program or to have a licence to use it.

30.61 It is not an infringement of copyright in a computer program for a person who owns a copy of the computer program that is authorized by the owner of the copyright, or has a licence to use a copy of the computer program, to reproduce the copy for the sole purpose of obtaining information that would allow the person to make the program and any other computer program interoperable.
</blockquote>



Now, I am not a lawyer, but when I read this, I take it to mean that, under section 30.6 of the bill, software - even proprietary software - may be adapted for the purpose of interoperability. In fact, it may even be "translated into another computer language" - i.e. disassembled - for the purpose of interoperability (either with a computer or with another computer program). This allows for a rather large set of possible reverse-engineering practices to be legal under this bill.



<blockquote>41.12 (1) Paragraph 41.1(1)(a) does not apply to a person who owns a computer program or a copy of one, or has a licence to use the program or copy, and who circumvents a technological protection measure that protects that program or copy for the sole purpose of obtaining information that would allow the person to make the program and any other computer program interoperable.

(2) Paragraph 41.1(1)(b) does not apply to a person who offers services to the public or provides services for the purposes of circumventing a technological protection measure if the person does so for the purpose of making the computer program and any other computer program interoperable.

(3) Paragraph 41.1(1)(c) does not apply to a person who manufactures, imports or provides a technology, device or component for the purposes of circumventing a technological protection measure if the person does so for the purpose of making the computer program and any other computer program interoperable and

(a) uses that technology, device or component only for that purpose; or

(b) provides that technology, device or component to another person only for that purpose.

(4) A person referred to in subsection (1) may communicate the information obtained under that subsection to another person for the purposes of allowing that person to make the computer program and any other computer program interoperable.

(5) A person to whom the technology, device or component referred to in subsection (3) is provided or to whom the information referred to in subsection (4) is communicated may use it only for the purpose of making the computer program and any other computer program interoperable.

(6) However, a person is not entitled to benefit from the exceptions under subsections (1) to (3) or (5) if, for the purposes of making the computer program and any other computer program interoperable, the person does an act that constitutes an infringement of copyright

(7) Furthermore, a person is not entitled to benefit from the exception under subsection (4) if, for the purposes of making the computer program and any other computer program interoperable, the person does an act that constitutes an infringement of copyright or an act that contravenes any Act of Parliament or any Act of the legislature of a province.</blockquote>



Again, not being a lawyer, I take this to mean that if I were to make a media player with the intention of being interoperable with, say, iTunes - which would require me to break the DRM/TPM on iTunes files, I would be allowed to do so (unless the iTunes licence says otherwise, which it does). Similarly, a library that allows me to crack CSS on a DVD would be legal if provided for the purpose of making a media player interoperable with the closed-source variants, as long as I don't infringe any copyrights while developing my media player.

I should say that by far most open source software doesn't consist of media players: there are enormous amounts of code that has nothing to do with TPM and is still open source software. Also: I don't see an "industry vs. open source" movement here (at least not on the industry's side, nor on the government's side): open source software is widely used by, and developed by, the software industry. The industry has as big a stake in Free/Libre Open Source Software as the students and hobbyists that are up in arms against it. Need I remind you that Intel, IBM, Google, Red Hat, etc. are all corporations who have invested heavily in Linux and other open source technologies?

I don't see any legitimate activities in the software development business that would be seriously hampered by this bill.
