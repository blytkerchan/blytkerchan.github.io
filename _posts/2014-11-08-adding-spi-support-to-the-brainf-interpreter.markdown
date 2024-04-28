---
author: rlc
comments: true
date: 2014-11-08 20:42:38+00:00
layout: post
title: Adding SPI support to the BrainF interpreter
wordpress_id: 3359
categories:
  - VHDL
tags:
  - brainf---
  - SPI
  - VHDL
---

While at Chicago's O'Hare airport, waiting for my connecting flight to Reno, I had a bit of time to start coding on my BrainF interpreter again -- once I had found an outlet, that is[^1]. My goal was to add something that would allow something else to communicate with the interpreter. There are a few buses I like for this kind of thing, and SPI is one of them.

[^1]: Apparently, power outlets at Chicago O'Hare are a rare commodity, to the point that their internal website points you to "Power stations" of which there were three in my vacinity, but all of them were fully -- ehm.. -- used. I finally found an outlet in the foodcourt with a gentleman standing next to it, but only using one socket, so I connected my laptop the the other so socket and a small constellation of devices to the various USB ports on my laptop...

<!--more-->

I like SPI for a number of reasons. First, it's a full-duplex bus: both sides (master and slave) talk at the same time, at the same rate. It is also astoundingly simple: the master drives a clock -- which can be as fast as it can bang bits -- and selects the slave to talk to with a dedicated `slave_select#` signal, one for each slave. There are two other signals which are shared by all of the slaves: MOSI, for master-out-slave-in, and MISO, for (you guessed it) master-in-slave-out. When a slave is not selected, it sets its MISO output to high-impedance (tristate) so the selected slave can talk. When it is selected, common convention is to drive it low when you have nothing to say, or drive it to whatever your bit value is when you do.

As you're reading and writing at the same time, you need to be kind to your master, and hope he's kind with you as well. Common convention[^2] is to read on the falling edge of the clock, and write on the rising edge. Usually, these clocks are at about 100 KHz, which means you can go at 100 Kbps, though in theory, you could reach speeds into the realm of MHz -- the only _real_ limit, again, is how fast you can bang your bits and, at some point, how much noise you can tolerate.

[^2]: It's not like this thing is over-specified!

Now, I just mentioned noise: these inputs are going to have to be debounced, which means they are going to be at least a bit desynchronized. But for the BrainF interpreter, we can pretend we're living in a noise-free world for now, and forget about debouncing for a bit -- I'll add one of those later.

Having a few hours to kill, I decided to make this SPI slave generic, and try to make it robust (without taking the fun out of writing it). I want to be able to interface with it putting a pair of FIFOs in front of it -- or hooking it up directly to the interpreter, if need be -- so I need a good interface. This is what I came up with:

    entity SPISlave is
        port(
              clock                 : in std_logic
            ; resetN                : in std_logic

            -- bus to the outside
            ; spi_clock_I           : in std_logic
            ; spi_slave_select_NI   : in std_logic
            ; spi_mosi_I            : in std_logic
            ; spi_miso_O            : out std_logic

            -- internal bus:
            -- signal to this component that data_I contains something
            ; data_ready_I          : in std_logic
            -- data to send
            ; data_I                : in std_logic_vector(7 downto 0)
            -- acknowledge we've copied the byte, so you can provide another one
            ; data_ack_O            : out std_logic
            -- indicate data_O contains valid data from the master
            ; data_ready_O          : out std_logic
            -- signal that we've changed the byte (can be used to push into a FIFO or set an SR flip-flop or something)
            ; new_data_byte_O       : out std_logic
            -- byte from the master
            ; data_O                : out std_logic_vector(7 downto 0)
            );
    end entity;

Of course, `clock` and `resetN` do what you'd expect them to do. The next four signals are the four signals defined by SPI. As I said, the component doesn't do any debouncing of its own, so there should be a debouncer in front of the three inputs.

The internal bus is intended to be versatile: tell it that you have data ready and it will ack when you can put the next byte in -- so you can use the ack to pop from a FIFO, for example. There's no ack the other way around: we can't slow down the master and we don't have a FIFO inside the SPI component, so if you want to buffer, you have to do it outside the SPI component -- push on `new_data_byte_O and data_ready_O` and pop when you're ready. As long as you're faster than the SPI bus in consuming the data, you'll be fine even without a FIFO.

There's a bunch of internal signals, a flip-flop for the data-ready output, and some other details I won't go into right now -- you can see it all at the new [GitHub repo](https://github.com/blytkerchan/BrainF).

There are fiveimportant events the slave has to handle:

1. being selected

2. being deselected

3. new data being available to send

4. rising edge of the SPI clock

5. falling edge of the SPI clock

<img src="/assets/2014/10/select-1-300x90.png" alt="Selection just before a SPI clock rising edge">

<img src="/assets/2014/10/select-3-300x90.png" alt="Selection just before a SPI clock falling edge">

**Being selected** means the master is now talking to us, which means we should start sending it data if we have any and we should read the data it sends us. The question is when the select becomes effective: my implementation needs at least a clock tick between the falling edge of the select# signal and the first rising edge of the SPI clock, and will ignore a falling edge in the SPI clock if it occurs before that first rising edge.

<img src="/assets/2014/10/select-2-300x90.png" alt="Delesection - first case">

<img src="/assets/2014/10/select-4-300x90.png" alt="Delesection - second case">

**Being deselected** means we should stop driving the MISO output immediately, and should stop reading the MOSI input. This can occur at any time, so we need to make sure that we align the 8-bit byte boundary for the next time we're selected.

**New data being available to send** is indicated by the surrounding code by the data-ready input going high. If we're selected at the moment that that happens, we'll start sending the data at the next 8-bit boundary. The reason for this is that if the data becomes available after the transaction has begun, the MISO output will be pulled down by the slave, so to start sending data at just any moment would shift the bits of every byte by a potentially random amount. As SPI has no start-stop bits, there is no way to frame the data -- unless there is a protocol above SPI that takes care of framing (e.g. by adding start/stop octets and an escape octet).

When new data is available to send before we're selected, the data is kept pending until we're selected by the master, at which time we start pumping out the bytes.

At the **rising edge of the SPI clock** we set MISO to its value, so the master can read it at the falling edge.

At the **falling edge of the SPI clock** we read the value of MOSI, which the master will have set on the preceding rising edge.

As per my habits, I've written an assertive testbench to go with this slave.
