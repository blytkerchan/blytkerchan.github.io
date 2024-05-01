---
author: rlc
categories:
- Technology
- How-to
- Parenting
- Software Installation
- Network Configuration
- Web Browsing
- Chrome Configuration
- Screen Saver Configuration
- Guest Session Configuration
- LightDM Configuration
- Child Safety
- Public Kiosk Setup
- Virtual Machine Setup
- Security Hardening
comments: true
date: 2016-07-27 11:16:52+00:00
layout: post
title: Setting up a Xubuntu-based kiosk
wordpress_id: 4060
---

This is another "HOWTO" post -- setting up a Xubuntu-based kiosk, which I did to make a new "TV" for my kids.

<!--more-->

## Prerequisites

I'm running a Xubuntu-based laptop to do this, so I first had to install usb-creator from [here](https://launchpad.net/usb-creator). Installed the two `.deb` files using `dpkg -i <.deb file>` and fixed up the missing dependencies with `aptitude`.

## Create a USB stick with Xubuntu

- Download the minimal CD image from [here](https://help.ubuntu.com/community/Installation/MinimalCD)
- run `usb-creator-gtk` and install the mini.iso file to your USB drive[^1].
- Install the Xubuntu as proposed in the target computer.
- When asked what software to install, select **Manual package selection**, **standard system utilities**, **Xubuntu minimal installation** and **OpenSSH server** (to allow remote access into the kiosk), then press the **Continue** button.

[^1]: I'm using a 2 GiB USB pendrive to do this -- bigger should be fine, smaller might not be.

Keeping everything else to defaults should install a basic system. When it's done installing, it will want to reboot.

## Configuring the wired network

- Log in to the device as your user, then do `sudo su -` to become root.
- run `ls /sys/class/net` to get a list of network devices. In my case. my hard-wire NIC is called `enp6s0` but it may (and likely will be) different for you -- so replace `enp6s0` with whatever your device's name is in the following.
- run `dhclient enp6s0` as root, after connecting your Ethernet wire. If your network setup is sane, that should get you an IP address.

## Installing auxiliary applications

We'll want to install a few extra applications to get started, starting with a screen saver and whatever is needed to browse the web and somesuch.

- A screen saver: `sudo apt install xscreensaver xscreensaver-screensaver-\*`

- Non-free stuff: `sudo apt install xubuntu-restricted-extras`

- Firefox (to install Chrome): `apt install firefox`

- To install Chrome, download it using Firefox (I tried Lynx, which is better than Firefox, but Chrome's website uses Javascript), then run `sudo dpkg -i google-chrome*.deb`, then run `sudo apt-get -f install` and `apt purge firefox` to finish the installation.

## Configuring Chrome

- Log in to the guest account for Xubuntu and start Chrome using `google-chrome --password-store=basic`. Go to whatever website you need to go to and enter any credentials that will need to be persisted. Configure it any way you need to.
- Open a console and run `xscreensaver-demo` to set whatever settings you want to set in the screen saver
- When done, **keep the session open** and switch to a root console. Find the HOME directory under `/tmp/guest-...` and copy the .config/google-chrome directory to `/usr/share/lightdm/guest-session/skel/.config` and the `.xscreensaver` file to `/usr/share/lightdm/guest-session`. They will be copied from there to the new HOME directory whenever a new guest session starts.
- Create /etc/guest-session/auto.sh with the following contents:

  xscreensaver&
  google-chrome --make-default-browser
  google-chrome --password-store-basic <first url to surf to>
  xfce4-session-logout --logout

- Create /etc/guest-session/prefs.sh with the following contents:

  touch ${HOME}/.skip-guest-warning-dialog

- Create /etc/lightdm/lightdm.conf.d/50-auto.conf with the following contents:

  [SeatDefaults]
  autologin-guest=true

Reboot to test -- you should be done.

## A few notes

I set this up for my children to have a "TV" they can use, so they just have access to the mouse and it's in a fairly trustworthy environment (our down-stairs living room). If you're setting up a public kiosk, you may want to invest in things like a touch screen and you may want to look into on-screen keyboards and somesuch. I have no use-case for that, so you're on your own.

The way I set this up was using a laptop with no disk, and an external hard drive. I can take the hard drive with me and hook it up to any other computer at any time, running the OS in a VM if I need to.

You may also want to harden the setup a bit, although with only a mouse there's not much you can do as a guest with this setup.