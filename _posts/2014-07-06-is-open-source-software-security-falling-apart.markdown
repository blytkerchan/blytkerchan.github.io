---
author: rlc
comments: true
date: 2014-07-06 01:21:17+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2014/07/is-open-source-software-security-falling-apart/
slug: is-open-source-software-security-falling-apart
title: Is Open Source software security falling apart?
wordpress_id: 3163
categories:
- Opinions
- Software Development
- Software Testing
tags:
- open source
---

There have been a number of well-publicized security flaws in open source software lately -- the most well-publicized of course being the OpenSSL Heartbleed bug ((OpenSSL is very widely used, which makes its effect on the Internet enormous, and the effect of bugs in the protocol implementation huge. That explains why such bugs are so well-publicized. Another factor in the publicity is the name of the bug (which was very well-found).)).

Then there's the demise of Truecrypt, recent bugs in GnuTLS and recent bugs in the Linux kernel.

So, is there a systemic problem with Open Source software? Does proprietary software have the same problem?

<!--more-->

Writing secure code is hard. That's (probably) why Truecrypt gave up the ghost ((Truecrypt gave up the ghost in May of this year, ostensibly because modern OSs come with their own disk encryption options. This does not reflect the quality of Truecrypt -- just that it is no longer maintained.)) and it's why security bugs happen in the first place. For every N lines of code, there are M bugs where [latex]0 \le M \le cN[/latex].

The only way to not write buggy code is to not write code at all. This is true regardless of whether you're getting paid for writing the code, and regardless of how much experience you have writing code. Of course, more experienced coders are less likely to write buggy code most of the time, but even the most experienced coder is guaranteed to write buggy code some of the time.

So why are security bugs in Open Source software popping up left and right? I see two reasons for that: 


	
  1. Open Source software is getting more popular

	
  2. Open Source software is Open Source software



Open Source software is embedded in your telephone, used by banks, governments and the military, and most businesses around the world. It is the very definition of ubiquitous. The size of open source projects ranges from huge (Linux kernel, for example) to tiny ([Github's "gists"](https://gist.github.com/discover), for example) and their quality is equally on the complete range (great to extremely poor).

In recent years, with the advent of the Internet and with Open Source code becoming part of university culture, Open Source software, and some of philosophies that go with it, has become more and more popular and has started to displace proprietary software in unexpected places. That means two things: security issues with Open Source software have become more important, and more people are looking for issues with Open Source software -- for their own reasons: some to slow it down, some to improve its quality.

The fact that Open Source software is Open Source software means that if problems are found in the software, those problems are not hidden.

Let's have a look at all unknown vulnerabilities with unknown impacts and/or unknown attack vectors in 2014 so far (there aren't that many): 
      <table >
         CVE entries for unknown vulnerabilities with unknown impacts and/or unknown attack vectors in 2014
         
            <tr >
               CVE ID
               Description
            </tr>
         
         <tbody >
            <tr >
               
<td width="150" >
                  [CVE-2014-0462](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0462)
               
</td>
               
<td >Unspecified vulnerability in OpenJDK 6 before 6b31 on Debian GNU/Linux and Ubuntu 12.04 LTS and 10.04 LTS has unknown impact and attack vectors, a different vulnerability than CVE-2014-2405.
</td>
            </tr>
            <tr >
               
<td width="150" >
                  [CVE-2014-1961](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-1961)
               
</td>
               
<td >Unspecified vulnerability in the Portal WebDynPro in SAP NetWeaver allows remote attackers to obtain sensitive path information via unknown attack vectors.
</td>
            </tr>
            <tr >
               
<td width="150" >
                  [CVE-2014-2405](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-2405)
               
</td>
               
<td >Unspecified vulnerability in OpenJDK 6 before 6b31 on Debian GNU/Linux and Ubuntu 12.04 LTS and 10.04 LTS has unknown impact and attack vectors, a different vulnerability than CVE-2014-0462.
</td>
            </tr>
            <tr >
               
<td width="150" >
                  [CVE-2014-2657](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-2657)
               
</td>
               
<td >Unspecified vulnerability in the print release functionality in PaperCut MF before 14.1 (Build 26983) has unknown impact and remote vectors, related to embedded MFPs.
</td>
            </tr>
            <tr >
               
<td width="150" >
                  [CVE-2014-2881](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-2881)
               
</td>
               
<td >Unspecified vulnerability in the Diffie-Hellman key agreement implementation in the management GUI Java applet in Citrix NetScaler Application Delivery Controller (ADC) and NetScaler Gateway before 9.3-66.5 and 10.x before 10.1-122.17 has unknown impact and vectors.
</td>
            </tr>
            <tr >
               
<td width="150" >
                  [CVE-2014-4648](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-4648)
               
</td>
               
<td >Unspecified vulnerability in Piwigo before 2.6.3 has unknown impact and attack vectors, related to a "security failure."
</td>
            </tr>
         </tbody>
      </table>

Two of these are in open source projects (actually, both are in OpenJDK). The other four are in proprietary software.
If we expand the list to include anything that is an unspecified vulnerability, there are 205, 27 of which are in Open Source software.

I ran a few other filters over the database, and found the vast majority of the 2028 currently-active vulnerabilities from 2014 involved proprietary code and those that involved Open Source projects (about 10%) were generally well-described and already fixed.

The same is not true for proprietary software: while it is generally not a good idea to give out the recipe ("the username is 'debug', the password 'forgetmenot'") vulnerabilities are generally described in terms so vague it's hard to assess the impact of a vulnerability -- and therefore to plan accordingly.

In Open Source software, you just have to take a look at the commit log. The Heartbleed bug is so good example: the commit made it clear what the problem was, how it worked and how it was fixed. This kind of transparency does have drawbacks, though: the bad guys have just as much access as the good guys do, so you really do have to keep your software up-to-date.

Running queries over the CVE database, I've found that the percentage of vulnerabilities that were in Open Source software has remained relatively stable even though Open Source software has become more popular, which in itself would indicate a decline in vulnerabilities and therefore an increase in quality.

One would expect to find more vulnerabilities in a category of software as it becomes more popular, as it would be increasingly scrutinized, followed by a decrease as awareness goes up. Awareness has been, and remained, high w.r.t. security in the Open Source world for decades -- well before it became as popular as it is today.
I verified this premise by looking for recent vulnerabilities in old software -- Microsoft Windows CE 4.2 ((I had to do that anyway  for unrelated research)). Microsoft Windows CE 4.2 has been obsolete for a very long time, but devices using it are still being shipped and maintained, even though support for the embedded OS by Microsoft ceased in 2008. While there are recent vulnerabilities in newer versions of CE, security researchers don't seem to bother with old, obsolete platforms as much as they do with the shiny new ones. Popularity spurs interest from hackers (regardless of the color of their hat) as well as the general public. That doesn't mean there are no vulnerabilities in older software: it means vulnerabilities are more likely to be found in more popular software, if they're there.

So, is Open Source software security falling apart? No, it's not: Open Source software is as healthy as ever, and as safe as it ever has been. As with all software, procurement should be done with open eyes and a healthy dose of scepticism, but a preference for the proprietary does not appear founded if it is based on a premise of better software security.
