---
author: rlc
comments: true
date: 2010-06-27 02:52:20+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/06/tpm-on-your-content-under-c32-handing-away-your-rights/
slug: tpm-on-your-content-under-c32-handing-away-your-rights
title: 'TPM on your content under #c32 - handing away your rights?'
wordpress_id: 799
categories:
- Opinions
tags:
- Posts that need to be re-tagged (WIP)
---

Under bill C-32 it would be illegal to remove TPM under by far most circumstances. Does that mean that, if you decide to publish software you create with TPM, you're handing away the rights of your software to the TPM manufacturer? No, it doesn't.
<!--more-->
Let's say you're writing a big and expensive piece of software: you've poored time and money into its development, perhaps even hired other people to work on your dime for that development, and you're ready to bring it to the market. Like I said, this is a big and expensive piece of software: you _know_ it's going to be very successful and you don't want software pirates to get their hands on it, so you decide to buy a dongle kit - which is a TPM measure.

When implementing such a TPM, you basically buy a bunch of dongles and get a licence to use an SDK or an API that allows you to use those dongles in your software. In your code, at a few strategic places, you insert the calls necessary to make sure the dongle is present. Does that mean you have signed away your rights to your own software? That you can't change your mind and remove the dongle from your product? Of course not!

Similarly, say you take up a singing career: you chant something melodious and revolutionary into your PC's microphone while filming yourself with your webcam and post it on YouTube. Some-one in Toronto sees you and thinks: "this kid's got talent" but you say "nah - I can do this myself" and you decide to produce your own DVD and sell it on the Internet. For some reason, you decide to "protect" your DVD with CSS - meaning you have the DVD pressed by a company that can actually create CSS-enabled DVDs. They send you back the copies of the DVDs, which you sell on your website. Does this mean you can no longer use your master copies, raw material, etc.? Would that infringe the copyright of the guy who pressed the DVDs for you? Of course not!

In neither of these cases would you be circumventing a TPM: in the first case - you change your mind about using dongles with your software or you decide to change dongle providers - you change your source code and compile a new version of the software. It's not like you'd have to reverse-engineer your software in order to be able to remove any calls to the dongle API, nor would you be messing with the physical dongle to make it not work. In the second case, you have a perfectly legal copy that doesn't have TPM on it, which you can use however you want. There's no circumventing TPM there either. In both cases, here's what the bill says (emphasis mine):



<blockquote>“circumvent” means,

(a) in respect of a technological protection measure within the meaning of paragraph (a) of the definition “technological protection measure”, to descramble a scrambled work or decrypt an encrypted work or to otherwise avoid, bypass, remove, deactivate or impair the technological protection measure, **unless it is done with the authority of the copyright owner**;

“technological protection measure” means any effective technology, device or component that, in the ordinary course of its operation,

(a) controls access to a work, to a perform- er’s performance fixed in a sound recording or to a sound recording **and whose use is authorized by the copyright owner**;</blockquote>



as the copyright holder, you can withdraw the authorization to use the TPM on your content, _and_ you can give yourself (or anyone else) authorization to remove the TPM.
