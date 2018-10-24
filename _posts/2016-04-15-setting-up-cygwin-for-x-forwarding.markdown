---
author: rlc
comments: true
date: 2016-04-15 16:52:52+00:00
layout: post
permalink: /blog/2016/04/setting-up-cygwin-for-x-forwarding/
slug: setting-up-cygwin-for-x-forwarding
title: Setting up Cygwin for X forwarding
wordpress_id: 3816
categories:
- HOWTO
tags:
- Cygwin
- HOWTO
- X forwarding
---

{% include shadowbox.html open_only=true %}
<b><i>The TL;DR:</i></b><br/>

This is one of those "recipe" posts that tend to be useful if you happen to want to do exactly what I just did. The end result of this one is a Windows shortcut called "Linux terminal" on the desktop, that opens up an SSH terminal to a Linux box, with X forwarding.
</div>
<!--more-->
For my day-to-day work I, like many people, use a mix of Linux, Windows and iOS; the three of which working less-than-seamlessly together to help make my working day productive. In my case, the Linux boxes are mostly Ubuntu boxes (I moved from vanilla Debian to Ubuntu a few years ago; from RedHat to Debian before that) and the Windows boxes are either a Windows 7 desktop, a Windows 7 laptop or a Windows 10 laptop.

Now, I have a bit of work to do on the Linux box and it has fewer screens than the Windows desktop box -- and is less of a carry-me-around than the two laptops, so I decided to resurrect the ol' X-over-SSH thing. I tried Putty and Xming first, but Xming is no longer free, and Putty had some trouble getting that to work with the old, free version of Xming. I have used Cygwin for any years and it has its own X server, so I decided to use that in stead.

In this post, I won't go through all the steps I tried that didn't work from all the various websites I visited to troubleshoot my setup. In stead, I'll just give you the recipe that did work -- the one I'm working with now.


## Step 1: installing Cygwin


I already had Cygwin installed when I started, but you might not, so here's what you do:



 	
  1. Download the installer: the 64-bit version is [here](http://cygwin.com/setup-x86_64.exe); the 32-bit version is [here](http://cygwin.com/setup-x86.exe). I'll be using the 64-bit version throughout.

 	
  2. Run the installer. It'll pop up a welcome screen that should look a lot like this:  

[![Screenshot of Cygwin installer welcome screen](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot.png)](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot.png)

 	
  3. Click "Next" a few times (Install from Internet; choose the root directory; etc. I recommend you change the download directory to something other than the default, because I don't much like the default setting (you'll see why) -- but it's a free country, as they say). At some point, you'll git the package selection window.


  4. Select each of the following packages:

    * xorg-server


    * xinit


    * xauth


    * openssh


    * vim (because really, _can_ you live without Vim?)


    * mintty (if you're on 32-bit, I recommend rxvt in stead)


The easiest way to do this is to type the package name in the Search box, and click on the word "Skip" until it says "7.5-2" or somesuch (whatever the current version is -- just click on "Skip" and it'll work



  5. Hit "Next", accept the suggestion to download and install the dependencies, let the installer run for awhile and grab a coffee


If this part is confusing to you, look [here](http://x.cygwin.com/docs/ug/setup-cygwin-x-installing.html) for an explanation with more screenshots and hand-holding.



## Setting up SSH


I will assume that you know your way around a command prompt, so the following prefixes with a `$` the things you do as a normal user, and with a `%` the things you do as root.

First thing is to run the terminal. The Cygwin installation will have created a Start menu item called "Cygwin64 terminal" (or "Cygwin Terminal"). Click on that and a command prompt will open.

Let's assume your Linux box is at 192.168.0.80 and your login on the box is "me". On your Windows box, we'll assume the same thing (you're called "me"), so in the following, substitute your login for "me" and whatever names you have your computers for "George" (the Windows box) and "Tux" (the Linux box). When you start the Cygwin terminal, you should see something like this:

    
    me@George ~
    $ 



First thing we'll do is create a public key to log into the Linux box:

    
    $ ssh-keygen
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/me/.ssh/id_rsa): 
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /home/me/.ssh/id_rsa.
    Your public key has been saved in /home/me/.ssh/id_rsa.pub.
    The key fingerprint is:
    SHA256:uBxpvWTQ3uBWMPiU4pCF9od82Q01lA0o2Yz/uhDvStg me@George
    The key's randomart image is:
    +---[RSA 2048]----+
    |     +..o* +=+   |
    |    = o.*o= ...  |
    |   . =.=o=.o     |
    |      =B=+o .    |
    |      =oS ..     |
    |     o O +  .    |
    |      + E ..     |
    |       . o.      |
    |        ..o.     |
    +----[SHA256]-----+
    rlc@George ~
    $ 


(that is: type `ssh-keygen` and hit Enter a few times until it's done).

Now, send the public key over to the Ubuntu box:
    
    $ scp ~/.ssh/id_rsa.pub me@192.168.0.80:


and log into the Linux box:
    
    $ ssh me@192.168.0.80


It will ask you for your password -- this time. We'll make sure it's the last time:

    
    $ mkdir -p ~/.ssh
    $ chmod 0700 ~/.ssh
    $ cat id_rsa.pub >> ~/.ssh/authorized_keys
    $ chmod 0600 ~/.ssh/authorized_keys


The last line is in case the authorized_keys file was created by the first, in which case it will most likely not have the right permissions set.



## Configure the SSH server



    
    $ sudo su -
    [sudo] password for me:
    % vim /etc/ssh/sshd_config



Find where it says "X11Forwarding" and check that the following settings all concur:

    
    X11Forwarding yes
    X11DisplayOffset 10
    X11UseLocalHost no
    AllowTcpForwarding yes


I also have the following: 
    
    TCPKeepAlive yes
    ClientAliveInterval 30
    ClientAliveCountMax 10000


which means ssh doesn't time out when I go get a coffee.

We're all done on the Linux side: assuming you have something that uses X on the box, the Linux end of things will be able to run it over SSH. Now for Cygwin.



## Setting up the Windows box


We'll start by making sure the X server starts when you log in: create a shortcut with the following target:
`C:\cygwin64\bin\run.exe -p /usr/X11R6/bin XWin -listen tcp -multiwindow -clipboard -silent-dup-error`
and put it in the Startup folder of your start menu.
[![Properties of the shortcut](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot-1.png)](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot-1.png)

Run it. You should get a little X logo in the system bar.

Now, we'll need a `DISPLAY` environment variable to point to our X server, which we can add by right-clicking on "Computer", selecting "Properties", "Advanced system settings" and pressing the button "Environment Variables...". Add it to your user variables can give it the value `:0`. This will tell SSH (and, ultimately, the Linux box) where your X server is.

Finally, create a second shortcut, targeted at `C:\cygwin64\bin\mintty.exe -i /Cygwin-Terminal.ico -e /usr/bin/ssh -Y me@192.168.0.80`
[![Second shortcut](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot-2.png)](http://rlc.vlinder.ca/wp-content/uploads/2016/04/screenshot-2.png)

Run it, and you should be back on your Linux box. Run `xterm&` on that box and you should get an X-hosted xterm window, on your Windows box.

