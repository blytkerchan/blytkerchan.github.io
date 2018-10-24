---
author: rlc
comments: true
date: 2014-10-22 01:38:53+00:00
layout: post
permalink: /blog/2014/10/improving-the-brainf-interpreter/
slug: improving-the-brainf-interpreter
title: Improving the BrainF interpreter
wordpress_id: 3338
categories:
- Software Development
- VHDL
tags:
- brainf---
- VHDL
---

As I wrote in a [previous post](http://rlc.vlinder.ca/blog/2014/10/writing-a-brainf-interpreter-in-vhdl/), I wrote a BrainF interpreter in VHDL over a week-end. I decided to improve it a bit.
<!--more-->
The first think was to add `nop` and `halt` instructions. The `halt` instruction, with which the program buffer is filled by default, halts interpretation and can be put in the BrainF code as a `#` sign. As this is a "normal" instruction, it can be skipped using an "if"-like loop `[#]` which might come in handy for assertions and somesuch. To really be useful I'd have to expose some debug registers -- e.g. with the values of the memory pointer and the instruction pointer, but that'll come later.

The `nop` and `halt` instructions were easier to add than I had expected: I added them to the start of the list of instructions, because I expect a VHDL compiler to translate this into a 4-bit integer and I'd like `nop` to be instruction 0. 
[aside type="code" status="closed"]
    
    diff --git a/BrainF.vhdl b/BrainF.vhdl
    index 13895be..da7e11b 100644
    --- a/BrainF.vhdl
    +++ b/BrainF.vhdl
    @@ -30,7 +30,7 @@ entity BrainF is
             );
     end entity;
     architecture behavior of BrainF is
    -    type Instruction is (dot, plus, minus, advance, back_up, begin_loop, end_loop);
    +    type Instruction is (nop, halt, dot, plus, minus, advance, back_up, begin_loop, end_loop);
         type Instructions is array(0 to (MAX_INSTRUCTION_COUNT - 1)) of Instruction;
         type Pipeline is array(0 to 1) of Instruction;
         subtype IPointer is integer range 0 to MAX_INSTRUCTION_COUNT;
    

[/aside]
Any instruction that is not recognized now maps to a `nop`, so the `dot` instruction now has to be explicitly translated -- as does, of course, `halt`.
[aside type="code" status="closed"]
    
    @@ -43,13 +43,15 @@ architecture behavior of BrainF is
         function toInstruction(i : std_logic_vector(7 downto 0)) return Instruction is
         begin
             case i is
    +        when x"23" => return halt;
             when x"2B" => return plus;
             when x"2D" => return minus;
    +        when x"2E" => return dot;
             when x"3E" => return advance;
             when x"3C" => return back_up;
             when x"5B" => return begin_loop;
             when x"5D" => return end_loop;
    -        when others => return dot;
    +        when others => return nop;
             end case;
         end toInstruction;
         function increment(b : std_logic_vector(7 downto 0)) return std_logic_vector is
    

[/aside]
and we fill the pipe with `nop`s rather than `dot`s and the program with `halt`s.
[aside type="code" status="closed"]
    
    @@ -75,13 +77,13 @@ architecture behavior of BrainF is
         signal stalled                      : std_logic := '0'; -- signals it's going forward in a loop. The p_fetch process will continue 
                                                                 -- fetching until it finds the corresponding end-of-loop and puts that in pipe(0) at that time. 
         -- produced by p_fetch
    -    signal pipe                         : Pipeline := (others => dot);
    +    signal pipe                         : Pipeline := (others => nop);
         signal iptr                         : IPointer := 0;
         signal nest_count                   : NestCount := 0;
         signal expect_stall                 : std_logic := '0';
         signal should_back_up_on_stall      : std_logic := '0'; -- set if we expect a stall on an end_loop instruction
         -- produced by p_loadInstructions
    -    signal program                      : Instructions := (others => dot);
    +    signal program                      : Instructions := (others => halt);
         signal prev_load_instructions       : std_logic := '0';
         signal instruction_step             : std_logic := '0';
         signal iwptr                        : IPointer := 0;
    

[/aside]We immediately stall when we halt, and we reset to a pipe filled with `nop`s...[aside type="code" status="closed"]
    
    @@ -129,6 +131,10 @@ begin
                         else
                             stalled <= '0';
                         end if;
    +                when halt => 
    +                    stalled <= '1';
    +                when nop =>
    +                    null;
                     end case;
                 end if;
             end if;
    @@ -138,7 +144,7 @@ begin
             variable done_skipping : boolean := False;
         begin
             if resetN = '0' or load_instructions = '1' then
    -            pipe <= (others => dot);
    +            pipe <= (others => nop);
                 iptr <= 0;
                 nest_count <= 0;
                 done <= '0';
    @@ -160,7 +166,7 @@ begin
                     -- pipe(1). Hence, while we can anticipate our not stalling (and therefore load the next instruction 
                     -- into pipe(1) regardless) we have to make sure that if we do stall, we start by backing up the 
                     -- instruction pointer twice (or not count the end_loop instruction as nesting).
    -                if (pipe(1) = begin_loop or pipe(1) = end_loop) and stalled /= '1' and expect_stall = '0' then
    +                if (pipe(1) = begin_loop or pipe(1) = end_loop or pipe(1) = halt) and stalled /= '1' and expect_stall = '0' then
                         expect_stall <= '1';
                         done_skipping := False;
                         if pipe(1) = end_loop then
    @@ -182,6 +188,8 @@ begin
                             pipe(0) <= pipe(1);
                             iptr <= iptr + 2;
                             done_skipping := True;
    +                    elsif stalled = '1' and pipe(0) = halt then
    +                        done <= '1';
                         elsif stalled = '1' and pipe(0) = pipe(1) and not done_skipping then
                             nest_count <= nest_count + 1;
                         elsif stalled = '1' and nest_count /= 0 and ((pipe(0) = begin_loop and pipe(1) = end_loop) or (pipe(0) = end_loop and pipe(1) = begin_loop)) then
    @@ -198,6 +206,8 @@ begin
                             if iptr /= MAX_INSTRUCTION_COUNT then
                                 iptr <= iptr + 1;
                             end if;
    +                    elsif stalled = '1' and pipe(0) = halt then
    +                        null;
                         elsif not done_skipping then
                             assert stalled = '1' and pipe(0) = end_loop report "Unexpected stall!" severity failure;
                             if should_back_up_on_stall = '1' then
    @@ -222,7 +232,7 @@ begin
         p_loadInstructions : process(clock, resetN)
         begin
             if resetN = '0' then
    -            program <= (others => dot);
    +            program <= (others => halt);
                 prev_load_instructions <= '0';
                 instruction_step <= '0';
                 iwptr <= 0;
    @@ -230,7 +240,7 @@ begin
             else
                 if rising_edge(clock) then
                     if prev_load_instructions = '0' and load_instructions ='1' then
    -                    program <= (others => dot);
    +                    program <= (others => halt);
                         iwptr <= 0;
                         instruction_step <= '0';
                         internal_program_full <= '0';
    @@ -280,6 +290,7 @@ begin
                                 end if;
                             end if;
                         end if;
    +                    
                         prev_memory_byte_read_ack <= memory_byte_read_ack;
                     end if;
                     prev_read_memory <= read_memory;
    

[/aside]The test bench required a few changes:[aside type="code" status="closed"]
    
    diff --git a/BrainF_tb.vhdl b/BrainF_tb.vhdl
    index 452abab..53d74f2 100644
    --- a/BrainF_tb.vhdl
    +++ b/BrainF_tb.vhdl
    @@ -11,6 +11,7 @@ use work.txt_util.all;
     entity BrainF_tb is
     end entity;
     architecture behavior of BrainF_tb is
    +    constant WARMUP_COUNTDOWN : integer := 4;
         constant INITIAL_COUNTDOWN : integer := 10;
         --constant PROGRAM : string := "++++++++";
         --constant PROGRAM : string := "[.]";
    @@ -41,7 +42,7 @@ architecture behavior of BrainF_tb is
                 ; done : out std_logic
                 );
         end component;
    -    type State is (initial, start_loading_program, loading_program, running_program, success);
    +    type State is (warmup, initial, start_loading_program, loading_program, running_program, success);
         
         function to_std_logic_vector(c : character) return std_logic_vector is
             variable cc : integer;
    @@ -62,7 +63,7 @@ architecture behavior of BrainF_tb is
         signal memory_byte_read_ack     : std_logic := '0';
         signal done                     : std_logic := '0';
         
    -    signal tb_state                 : State := initial;  
    +    signal tb_state                 : State := warmup;  
         
         signal should_be_done           : std_logic := '0';
         
    @@ -88,13 +89,24 @@ begin
         should_be_done <= '1' after PROGRAM_TIMEOUT;
         
         p_tb : process(clock)
    -        variable countdown : integer := INITIAL_COUNTDOWN;
    +        variable countdown : integer := WARMUP_COUNTDOWN;
             variable program_load_counter : integer := 0;
         begin
             if rising_edge(clock) then
                 case tb_state is
    +            when warmup =>
    +                assert done = '0' report "Cannot be done while warming up (pipe filling with halt instructions)" severity failure;
    +                assert program_full = '0' report "Program cannot be initially full" severity failure;
    +                assert ack_instruction = '0' report "Cannot acknowledge an instruction I haven't given yet" severity failure;
    +                assert memory_byte_ready = '0' report "Cannot have memory ready when I haven't asked for anything yet" severity failure;
    +                if countdown = 1 then
    +                    tb_state <= initial;
    +                    countdown := INITIAL_COUNTDOWN;
    +                else
    +                    countdown := countdown - 1;
    +                end if;
                 when initial =>
    -                assert done = '0' report "Cannot be done in the initial state" severity failure;
    +                assert done = '1' report "Once warmed up, it should know it has no program and say it's done" severity failure;
                     assert program_full = '0' report "Program cannot be initially full" severity failure;
                     assert ack_instruction = '0' report "Cannot acknowledge an instruction I haven't given yet" severity failure;
                     assert memory_byte_ready = '0' report "Cannot have memory ready when I haven't asked for anything yet" severity failure;
    @@ -104,7 +116,6 @@ begin
                         countdown := countdown - 1;
                     end if;
                 when start_loading_program =>
    -                assert done = '0' report "Cannot be done while loading the program" severity failure;
                     assert program_full = '0' report "Program cannot be initially full" severity failure;
                     assert ack_instruction = '0' report "Cannot acknowledge an instruction I haven't given yet" severity failure;
                     assert memory_byte_ready = '0' report "Cannot have memory ready when I haven't asked for anything yet" severity failure;
    

[/aside]
Now that the program buffer is initialized with `halt` instructions, the interpreter fires up for three clock ticks before halting, so I had to add an extra state to the testbench (called it "warming up") during which the program-done signal isn't set yet, and after which it is.

The nice thing about this change is that it opens up the possibility to set "breakpoints" in the code: a BrainF program can halt execution, but could possibly later continue it by putting a `nop` in the place of the `halt` and continuing execution (e.g. by adding a `continue` command that could be sent to the interpreter).

Another bonus is that the `done` signal now comes up as soon as the program is done -- which means you know when you can stop simulation, and you could eventually have it generate an interrupt to tell some other bit that processing is done.
