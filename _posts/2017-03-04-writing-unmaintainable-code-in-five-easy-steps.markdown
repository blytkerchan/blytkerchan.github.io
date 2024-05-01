---
author: rlc
categories:
- Software Development
comments: true
date: 2017-03-04 20:26:12+00:00
layout: post
tags:
- design patterns
- maintainability
- programming
- rants
title: Writing unmaintainable code in five easy steps
wordpress_id: 4154
---

I have recently had to modify some code that, to say the least, was very hard to maintain -- or refactor, for that matter.

The following are a few, firmly tongue-in-cheek, steps to make sure your code is thoroughly frustrating to whoever needs to maintain it after you.

<!--more-->

**Step 1: unpredictability**
Above all else, be impossible to predict.

People who want to maintain your code will want to move things around sometimes. For example, they might want to change the behavior of whatever you were coding in some specific circumstance. It may be impossible for you to know exactly the kind of maintenance you have to thwart, but you should at least make sure that things that don't usually go together are firmly intertwined, that your functions are named for things they don't do and that your code is firmly coupled to every other part of the system -- including the hardware.

For example: if you know your app, firmware, or whatever will be acceptance tested on a specific piece of hardware, make sure it works on that hardware but will be almost impossible to port to anything else. At random places in the code, insert dependencies to whatever is as specific as possible to the hardware you're developing for. It's important that those dependencies be in _random_ places: you don't want anyone (even yourself) to be able to guess where those dependencies may be.

**Step 1: unreadability.**
To make sure your code is unmaintainable, make sure it is as difficult to read as possible.

One way to do this is to carefully misspell words in such a way that you have to actually pronounce the code to understand what it says. Another good trick is to mix languages. For example: if you're in a French-speaking part of the world, mix English and French liberally. Don't just mix in a few phrases in French in a predominantly English-language text: that might just look well-educated. You really want to mix in French spelling in English words or change the language mid-sentence, or mid-word. The French have five different ways of spelling the sound "o" ("eau", "au", "o", "oh" and "aux"): use them! (I.e. "don't" can become "deaunt").

If you speak a second or third language, sprinkle your code with whatever seems inappropriate at the time. Don't let the difference in alphabets stop you if it's a cyrillic language you're sprinkling in: there are always letters that look or sound alike (so $\rho$ can become a p or an r, depending on your fancy). You don't even have to really speak the language: Google Translate is your friend!

Oh, and notice this is the second step 1! Remember step 1: unpredictability!

**Step 3: object-orientation**
Anyone with a wee bit of education in software or firmware development will tell you to cut your code up in classes, modules, components or whatever. You won't be able to deliver your code without some level of modularization. That doesn't mean that modularization has to make any kind of sense, however -- make sure it doesn't!

Classification is an art as well as a science. The question, therefore, is not _whether_ to classify, but what criteria to use. You need your criteria to be as obscure as possible. Good candidates are the digits in $\tau$ (which, of course, equals $2\pi$, but using $\pi$ is just too obvious). Seemingly random digits are extremely useful as tools to group otherwise unrelated things together -- you just need to find creative ways of using them.

If you want to be slightly more predictable than that, you could just go by the question "who uses this". For example, a user will see the LEDs on the device, hear the sounds the device makes and read what is displayed on its screen. All three of those things should, therefore, be managed by the same class, which you could call `InteractionManager`, or `IM` for short.

Alternatively, you could go for extreme object orientation: create a small class for every small task the software does, and make objects of those classes short-lived but recurrent. The more classes you have, the easier it is to make them all depend on each other in a deliciously intricate web of dependencies!

**Step 4: Mjolnir**
If you have a tool that is both useful and unwieldy, use it!

Mjolnir is the name of Thor's hammer. Only the worthy can wield it, and it is both a blunt instrument and extremely destructive. It's everything you want to make your code unmaintainable. Tools like this come in many guises: they can be a particularly intricate hand-written class that does almost the same thing as an equivalent from a standard library -- but not quite. It can be an idiom that has its uses, such as the PImpl pattern, but used abusively.

Try to make sure you use inappropriate idioms wherever you can: PImpls can have their own PImpls if you can get away with it!

**Step 5: frameworks**
For every framework in existence, there is another framework that does almost the same thing but is more obscure and less well-documented -- and there is a framework for everything! Find the framework that best suits your need, learn its idiosyncracies and exploit them.

**Bonus step! Don't document your tests.**
Of course, you want your code to work correctly, even if it is a bowl of cold spaghetti. Whatever you do, though, _do not_ document how you made sure it works and _do not_ tell anyone else. If you do, whoever comes after you can make sure their changes didn't break anything, which is anathema to unmaintainable code.