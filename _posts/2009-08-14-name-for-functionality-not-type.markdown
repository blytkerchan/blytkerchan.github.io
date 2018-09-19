---
author: rlc
comments: true
date: 2009-08-14 16:12:15+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2009/08/name-for-functionality-not-type/
slug: name-for-functionality-not-type
title: Name For Functionality, Not Type
wordpress_id: 158
categories:
- Opinions
- Software
- Software Design
tags:
- Posts that need to be re-tagged (WIP)
---

I just read a [blog by Michel Fortin](http://web.archive.org/web/20111208114024/http://michelf.com/weblog/2009/hungarian-notation-the-original/), where he quotes [Joel On Software](http://www.joelonsoftware.com/articles/Wrong.html) regarding [Hungarian notation](http://en.wikipedia.org/wiki/Hungarian_notation), or rather, [Hungarian WartHogs](http://www.ddj.com/cpp/184403804). Naming a variable for its type, or a type for its location or namespace, is a mistake.

I agree with Joel on his introduction: there are different levels of programmers and, at some point, your nose simply starts to itch when you see code that looks OK, but really isn't. More than once (and I have witnesses to this fact) I have repaired bugs that we knew existed, but didn't know where they were, simply by fixing a piece of code that didn't "feel" right. For a few months that was a full-time job for me, in fact: I was to look over the shoulders of programmers debugging things and fix their bugs for them. Though I was really good at it, it's not a great job to have to do every day.

So, I agree that at some point, you start having an idea of what clean code should _feel_ like, and you start trying to explain that to other people. If you're coding in K&R; C, then the original Hungarian Notation that Joel talks about may be a good path to go on. However, if you're coding in a type-safe language, such as C99 or C++, Hungarian notation, whether it be the app-style or the system-style, is simply a mistake - and a very bad one.

In case Joel reads this: no, I don't think exceptions are the best invention since chocolate milkshake - and I don't particularly like chocolate milkshake either. I don't passionately hate Hungarian notation. I _do_ think, however, that Hungarian notation is a mistake and that if you think you need it, there's something _you are doing wrong_.


## The Example


Joel gave us an example to get rid of cross-site scripting. I agree cross-site scripting is a problem, but it is a problem only if you don't obey the rule that you should check what comes into your program with run-time checks - always. Anything you read from a file, a connection, a console, the command-line or any other place where a human being could possibly give you any kind of input, should be considered dirty until cleaned, **_and should be cleaned as soon as possible_**. You don't need any special notation for this (such as us for unsafe string and ss for safe string). In fact, it is a mistake to do that because _your name will lie to you_. Consider the following code: 
    
    s = Request("name")
    Write "Hello, " & Request("name")

which Joel "corrected" into 
    
    s = Request("name")
    Write "Hello, " & Encode(Request("name"))

We agree on the problem of the first version of the code: it is vulnerable to cross-site scripting. We don't agree on the solution - to encode the string when it is used. I.e., IMHO, the solution should be to make sure the string is _never_, or at least _for as short a period as possible_ in memory in an unsafe form. I.e., if there is no way to make sure that Request("name") returns an encoded (clean) string, the code should be 
    
    s = Encode(Request("name"))

Joel proposed this solution but rejected it because you might want to store the user's input in a database. He's right on that point - he's also right to reject his second proposed solution, which is to encode anything that gets output to the HTML. His "real" solution is still wrong, however: the first proposed solution just needs a tweak.

What you need, in this case, is a way to capture your user's input, clean it and get it in a format that you can meaningfully store in a database and output back to the screen. IMHO, the best way to do that is to use a reversible clean-up method that puts the string in an intermediary form that you can store in the database, and from which you can convert to safely output it to HTML. The intermediate form should be easily recognizable for debugging purposes. I usually use Base64 for this. That way, if you forget to convert from your intermediate form, you are not vulnerable to XSS but you have a (clearly visible) bug. Your database isn't vulnerable to XSS either, and you don't need an extra way to make sure of that. Using base64 makes the clean-up completely reversible. However, I concede that this is rather crude. The point is, though, that though this is crude, it precludes from relying on style for the security of the application. Refining the method, wrapping it in an object type of some kind, for example, is straight-forward and comes with more advantages - and very few disadvantages.



## The Fragility of Hungarian Notation


Hungarian notation is fragile: you have to rely on the names of your variables to tell you something about their type. Even in the original Hungarian notation, there was no functionality-related information so Joel's "us", which contains an unsafe string, could be an unsafe string meaning absolutely anything. But that is not the only problem. Hungarian notation makes your code lie to you. Consider the following code:
    
    us = UsRequest("name")
    usName = us
    recordset("usName") = usName
    
    
    
    
    ' much later
    sName = SFromUs(recordset("usName"))
    WriteS sName

which according to Joel is just dandy. That's nice, until another programmer comes along and inserts something between lines 1 and 2: 
    
    us = UsRequest("name")
    usName = us
    us = UsRequest("address")
    usAddress = us
    recordset("usName") = usName
    recordset("usAddress") = usAddress
    
    
    
    
    ' much later
    sName = SFromUs(recordset("usName"))
    sAddress = SFromUs(recordset("usAddress"))
    WriteS sName
    WriteS sAddress

which is fine and dandy as well, but let's say some-one introduces SRequest, which for some reason is more efficient that UsRequest and renders safe strings. The code is changed (under pressure) into this:
    
    us = SRequest("name")
    usName = us
    us = UsRequest("address")
    usAddress = us
    recordset("usName") = usName
    recordset("usAddress") = usAddress
    
    
    
    
    ' much later
    sName = recordset("usName")
    sAddress = recordset("usAddress")
    WriteS sName
    WriteS sAddress

which means most of the code now lies to you.

The code presented here is trivial and it is unlikely that this specific scenario will occur. However, scenarios like this occur _every day_, and more and more code is changed to lie to the reader.

You need a style that doesn't let your code lie to you - and Hungarian notation doesn't qualify.

Just one more example to drive the point home: in C and C++, the _t suffix traditionally implies that the name denotes a typedef.

What is **wchar_t**?

In C, it is a typedef.

In C++, it is a built-in type, and _**the name lies about it**_.

The functionality of a variable is _very unlikely_ to change. When the code changes enough for a variable's functionality to change, the variable is usually renamed because it doesn't _feel_ right to have a variable explicitly say one thing and do another - _explicitly_, not in some kind of code that you have to decipher. Use that and you'll be a lot safer.
