---
author: rlc
comments: true
date: 2014-10-03 20:00:42+00:00
layout: post
permalink: /blog/2014/10/writing-a-brainf-interpreter-in-vhdl/
slug: writing-a-brainf-interpreter-in-vhdl
title: Writing a BrainF interpreter ... in VHDL
wordpress_id: 3303
categories:
- Software Development
- VHDL
tags:
- brainf---
- VHDL
---

I've written parsers and interpreters before, but usually in C++ or, if I was feeling like doing _all_ of the hard work myself, in C.

<!--more-->

Interpreters usually end up looking like a state machine managed by a tight loop with a lot of machinery around to manage objects, caches and somesuch. Other times they end up being visitors on an AST in stead. In any case, once the pattern emerges and the first few design decisions have been made, the rest kinda falls into place on its own.

When designing something in VHDL, the mindset is a bit different: VHDL is a hardware description language and as such, it is very explicit -- so if I thought I had to do everything in C, there's even more to do when using VHDL...

Almost ten years ago, I wrote the Funky interpreter (for a lispy functional language) with my daughter (who was a baby at the time) sleeping in my arms. A few years later, I had my baby boy sleeping in my arms while I was writing another interpreter for another DSL.

While I've written parsers and interpreters without sleeping children in my arms, and I've had sleeping children in my arms without writing interpreters, there still seems to be a link between the two: at some point, singing a lullaby takes the form of writing an interpreter -- this time for BrainF, in VHDL and on my iPad, with my youngest son sleeping in my arms...

My first draft had a few syntax errors and typos -- I don't have a VHDL compiler on my iPad -- but the general idea was there:
[aside type="code" status="closed"]

    
    -- BrainF* interpreter
    -- Version: 20140927
    -- Author:  Ronald Landheer-Cieslak
    -- Copyright (c) 2014  Vlinder Software
    -- License: http://opensource.org/licenses/CDDL-1.0
    library ieee:
    use ieee.std_logic_1164.all;
    use ieee.numeric_std.all;
    
    entity BrainF is
        generic(
              MAX_INSTRUCTION_COUNT : positive := 65536
            ; MEMORY_SIZE : positive := 65536
            );
        port(
              resetN : in std_logic
            ; clock : in std_logic
            
            ; load_instructions : in std_logic
            ; instruction : in std_logic_vector(7 downto 0)
            ; ack_instruction : out std_logic
            ; program_full : out std_logic
            
            ; read_memory : in std_logic
            ; memory_byte : out std_logic_vector(7 downto 0)
            ; memory_byte_ready : out std_logic
            ; memory_byte_read_ack : in std_logic
            
            ; done : out std_logic
            );
    end entity;
    architecture behavior of BrainF is
        type Instruction is (dot, plus, minus, advance, back_up, begin_loop, end_loop);
        type Instructions is array(0 to (MAX_INSTRUCTION_COUNT - 1)) of Instruction;
        type Pipeline is array(0 to 1) of Instruction;
        type IPointer is integer range 0 to MAX_INSTRUCTION_COUNT;
        type NestCount is integer range 0 to MAX_INSTRUCTION_COUNT - 1;
        
        type Memory is array(0 to (MEMORY_SIZE - 1)) of std_logic_vector(7 downto 0);
        type Pointer is integer range 0 to (MEMORY_SIZE - 1);
        
        function toInstruction(i : std_logic_vector(7 downto 0)) return Instruction is
        begin
            case i is
            when x"2B" => return plus;
            when x"2D" => return minus;
            when x"3E" => return advance;
            when x"3C" => return back_up;
            when x"5B" => return begin_loop;
            when x"5D" => return end_loop;
            when others => return dot;
            end case;
        end toInstruction;
        function increment(b : std_logic_vector(7 downto 0)) return std_logic_vector(7 downto 0) is
        begin
            if b = x"FF" then
                return x"00";
            else
                return std_logic_vector(unsigned(b) + 1);
            end if;
        end increment;
        function decrement(b : std_logic_vector(7 downto 0)) return std_logic_vector(7 downto 0) is
        begin
            if b = x"00" then
                return x"FF";
            else
                return std_logic_vector(unsigned(b) - 1);
            end if;
        end decrement;
        
        -- produced by p_interpret
        signal ptr : Pointer := 0;
        signal mem : Memory := (others => (others => '0')));
        signal stalled : std_logic := '0';
        -- produced by p_fetch
        signal pipe : Pipeline := (others => dot);
        signal iptr : IPointer := 0;
        signal nest_count : NestCount := 0;
        -- produced by p_loadInstructions
        signal program : Instructions := (others => dot);
        signal prev_load_instruction : std_logic := '0';
        signal instruction_step : std_logic := '0';
        signal iwptr : IPointer := 0;
        -- produced by p_readMemory
        signal prev_memory_byte_read_ack : std_logic := '0';
        signal prev_read_memory : std_logic := '0';
    begin
        p_interpret : process(resetN, clock)
        begin
            if resetN = '0' or load_instructions = '1' then
                ptr <= 0;
                mem <= (others => (others => '0'));
                stalled <= '0';
            elsif load_instructions = '0' and read_memory = '0' then
                if rising_edge(clock) then
                    case pipe(0) is
                    when dot =>
                        null;
                    when plus =>
                        mem(ptr) <= increment(mem(ptr));
                    when minus =>
                        mem(ptr) <= decrement(mem(ptr));
                    when advance =>
                        if ptr = MEMORY_SIZE - 1 then
                            ptr <= 0;
                        else 
                            ptr <= ptr + 1;
                        end if;
                    when back_up =>
                        if ptr = 0 then
                            ptr <= MEMORY_SIZE - 1;
                        else
                            ptr <= ptr - 1;
                        end if;
                    when begin_loop =>
                        if mem(ptr) = x"00" then
                            stalled <= '1';
                        else
                            stalled <= '0';
                        end if;
                    when end_loop =>
                        if mem(ptr) = x"00" then
                            stalled <= '0';
                        else
                            stalled <= '1';
                        end if;
                    end case;
                end if;
            end if;
        end process;
        
        p_fetch : process(resetN, clock)
        begin
            if resetN = '0' or load_instructions = '1' then
                pipe <= (others => dot);
                iptr <= 0;
                nest_count <= 0;
                done <= '0';
            elsif load_instructions ='0' and read_memory = '0' then
                if stalled = '1' then
                    if pipe(0) = begin_loop then
                        case pipe(1) is
                        when begin_loop =>
                            nest_count <= nest_count + 1;
                        when end_loop =>
                            if nest_count = 0 then
                                pipe(0) <= pipe(1);
                            else
                                nest_count <= nest_count - 1;
                            end if;
                        when others =>
                            null;
                        end case;
                    elsif pipe(0) = end_loop then
                        case pipe(1) is
                        when end_loop =>
                            nest_count <= nest_count + 1;
                        when begin_loop =>
                            if nest_count = 0 then
                                pipe(0) <= pipe(1);
                            else
                                nest_count <= nest_count - 1;
                            end if;
                        when others =>
                            null;
                        end case;
                    end if;
                else
                    pipe(0) <= pipe(1);
                end if;
                if iptr = MAX_INSTRUCTION_COUNT then
                    pipe(1) <= dot;
                    done <= '1';
                else
                    pipe(1) <= program(iptr);
                    done <= '0';
                end if;
                if stalled = '1' and pipe(0) = end_loop then
                    if iptr /= 0 then
                        iptr <= iptr - 1;
                    end if;
                else
                    if iptr /= MAX_INSTRUCTION_COUNT then
                        iptr <= iptr + 1;
                    end if;
                end if;
            end if;
        end process;
        
        p_loadInstructions : process(clock, resetN)
        begin
            if resetN = '0' then
                program <= (others => dot);
                prev_load_instruction <= '0';
                instruction_step <= '0';
                iwptr <= 0;
                program_full <= '0';
            else
                if rising_edge(clock) then
                    if prev_load_instructions = '0' and load_instructions ='1' then
                        program <= (others => dot);
                        iwptr <= 0;
                        instruction_step <= '0';
                        program_full <= '0';
                    elsif prev_load_instructions = '1' and load_instructions ='1' then
                        if instruction_step = '0' then
                            if iwptr < MAX_INSTRUCTION_COUNT then
                                program(iwptr) <= toInstruction(instruction);
                                iwptr <= iwptr + 1;
                            else
                                program_full <= '1';
                            end if;
                        end if;
                    
                        instruction_step <= not instruction_step and not program_full;
                    else
                        iwptr <= 0;
                        instruction_step <= '0';
                    end if;
                    prev_load_instructions <= load_instructions;
                end if;
            end if;
        end process;
        ack_instruction <= instruction_step;
        
        p_readMemory : process(clock, resetN)
            variable rptr : integer range 0 to MEMORY_SIZE := 0;
        begin
            if resetN = '0' or read_memory = '0' then
                rptr := 0;
                memory_byte <= (others => '0');
                memory_byte_ready <= '0';
            else
                if rising_edge(clock) then
                    if read_memory = '1' then
                        if prev_read_memory = '0' then
                            memory_byte <= mem(0);
                            memory_byte_ready <= '1';
                            rptr := 1;
                        else
                            if prev_memory_byte_read_ack = '0' and memory_byte_read_ack = '1' then
                                if rptr /= MEMORY_SIZE then
                                    memory_byte <= mem(rptr);
                                    rptr := rptr + 1;
                                else
                                    memory_byte_ready <= '0';
                                end if;
                            end if;
                        end if;
                        prev_memory_byte_read_ack <= memory_byte_read_ack;
                    end if;
                    prev_read_memory <= read_memory;
                end if;
            end if;
        end process;
    end behavior;

[/aside]

There's a `pipe` of instructions: `pipe(0)` contains the instruction currently being interpreted by the `p_interpret` process, and `pipe(1)` contains the next instruction. The `p_interpret` process interprets the opcode and works on the memory array (`mem`) at the location pointed to by its pointer (`ptr`). Two instructions manipulate the pointer (`advance` and `back_up`) and two instructions manipulate the byte being pointed at (`minus` and `plus`). The two looping instructions, `begin_loop` and `end_loop`, are mainly handled by the p_fetch process, which manipulates the instruction pointer, `iptr`, with the `p_interpreter` process indicating only whether it wants to (re-)execute the loop's body -- determined of course by the value of whatever byte `ptr` is pointing at.

The `p_fetch` process fills the pipe, shifts it, and handles the instruction pointer, `iptr` including looping logic. This turned out to be the most challenging part, because this is where you have to wrap your head around inter-process synchronization in VHDL -- which isn't new (at least not completely new) to me, but is quite different than in C++ and takes a bit of thinking when the synchronization has to go both ways between two processes.

The other two processes, `p_loadInstructions` and `p_readMemory`, are basically pumps for eight-bit-wide buses. The `p_loadInstructions` process translates from ASCII to internal instructions, but that's just so that code is encapsulated within the component and I can use an enumeration for my instructions without exposing it.

There were a few problems with this version, other than the typos: running in a simulation, I quickly found that loops didn't work properly: while the `p_interpret` process handled them just fine, indicating when it wanted to not execute a loop (stalling on a `begin_loop` instruction) and when it wanted to execute a loop again (stalling on an `end_loop` instruction), the `p_fetch` process had a bit of a hard time catching up: thinking some loops were nested when they weren't, and having some instructions execute twice when they shouldn't be.

The thing is, when a value is assigned to a signal, it isn't immediately visible to the other processes: it only becomes visible when the current state of all the signals has propagated. That's because in theory (and in the FPGA), everything is running in parallel, synchronous to the rising edge of the clock as it propagates through the circuit. Hence, when the `stalled` signal was set, the `p_fetch` process would only see it when it was already two instructions further down the road.

This meant I had to stall `p_fetch` before `p_interpret` told it to stall, _even if_ `p_interpret` wasn't going to stall it at all, unless I wanted to interpret the instruction in `pipe(0)` (which is where `p_interpret` reads it), read the memory value at the pointer _or_ the one next to it if the instruction was a shift instruction (called `advance` and `back_up` in the code), perform the calculation if it's a `plus` or a `minus` and then decide whether `p_interpret` was going to ask us to stall. Obviously, I wasn't going to do that: it would involve a lot of extra code duplicating some of the functionality of the `p_interpret` process. That would be as bad a design in VHDL as it would be in any other language.

In stead, I added an `expect_stall` signal, which is set if the instruction being read into `pipe(1)` is either `begin_loop` or `end_loop`. On the next instruction, if `expect_stall` is high that means we don't know whether `p_interpret` is going to stall yet, so we shouldn't go any further for now. Hence, all it does when `expect_stall` is high, is pull it down again.

    
                    if (pipe(0) = begin_loop or pipe(0) = end_loop) and expect_stall = '1' then
                        expect_stall <= '0';
                    else


This didn't quite solve the issue yet: when `stalled` finally became visible, the instruction pointer, `iptr` was still two instructions ahead of the location of `begin_loop` or `end_loop` instruction:
    
    
    pipe(0) | pipe(1) | next
                        ^^^^
                        iptr
    


so if the `p_interpret` process didn't stall, all was fine and dandy but if it did, and `pipe(0)` contained the `end_loop` instruction, `iptr` would have to be adjusted before going backward -- and would have to be re-adjusted when the going backward was done. To make sure the `end_loop` instruction wasn't seen twice - and therefore wouldn't count itself as a nested loop, I coded the adjustment as follows:

    
                            if should_back_up_on_stall = '1' then
                                assert iptr >= 3 report "Stalled with an invalid instruction pointer!" severity failure;
                                pipe(1) <= program(iptr - 3);
                                iptr <= iptr - 3;
                                should_back_up_on_stall <= '0';
                            else
    


As you can see, there's a `should_back_up_on_stall` signal there. That indicates that the instruction we expected a stall for was `end_loop`. I tried fiddling a bit with a three-step pipe so I didn't have to use a separate signal to indicate the direction I was going to go, but I ended up using this approach because it is easier to read the code -- and it works!

When it's done looping, the `p_interpret` process drops the `stalled` signal but the instruction pointer gets re-adjusted before that's visible:

    
                        elsif stalled = '1' and nest_count = 0 and pipe(0) = end_loop and pipe(1) = begin_loop and should_back_up_on_stall = '0' then
                            -- we are done backing up!
                            pipe(0) <= pipe(1);
                            iptr <= iptr + 2;
                            done_skipping := True;


so the `p_fetch` process counts on the `p_interpret` process to do "the right thing" -- even if it's not visible yet.

Running the code, which now looks like this: [aside status="closed" type="code"]
    
    -- BrainF* interpreter
    -- Version: 20140929
    -- Author:  Ronald Landheer-Cieslak
    -- Copyright (c) 2014  Vlinder Software
    -- License: http://opensource.org/licenses/CDDL-1.0
    library ieee;
    use ieee.std_logic_1164.all;
    use ieee.numeric_std.all;
    
    entity BrainF is
        generic(
              MAX_INSTRUCTION_COUNT : positive := 65536
            ; MEMORY_SIZE : positive := 65536
            );
        port(
              resetN : in std_logic
            ; clock : in std_logic
            
            ; load_instructions : in std_logic
            ; instruction_octet : in std_logic_vector(7 downto 0)
            ; ack_instruction : out std_logic := '0'
            ; program_full : out std_logic := '0'
            
            ; read_memory : in std_logic
            ; memory_byte : out std_logic_vector(7 downto 0) := (others => '0')
            ; memory_byte_ready : out std_logic := '0'
            ; memory_byte_read_ack : in std_logic
            
            ; done : out std_logic := '0'
            );
    end entity;
    architecture behavior of BrainF is
        type Instruction is (dot, plus, minus, advance, back_up, begin_loop, end_loop);
        type Instructions is array(0 to (MAX_INSTRUCTION_COUNT - 1)) of Instruction;
        type Pipeline is array(0 to 1) of Instruction;
        subtype IPointer is integer range 0 to MAX_INSTRUCTION_COUNT;
        type InterpreterState is (execute_instruction, fetch_instruction);
        subtype NestCount is integer range 0 to MAX_INSTRUCTION_COUNT - 1;
        
        type Memory is array(0 to (MEMORY_SIZE - 1)) of std_logic_vector(7 downto 0);
        subtype Pointer is integer range 0 to (MEMORY_SIZE - 1);
        
        function toInstruction(i : std_logic_vector(7 downto 0)) return Instruction is
        begin
            case i is
            when x"2B" => return plus;
            when x"2D" => return minus;
            when x"3E" => return advance;
            when x"3C" => return back_up;
            when x"5B" => return begin_loop;
            when x"5D" => return end_loop;
            when others => return dot;
            end case;
        end toInstruction;
        function increment(b : std_logic_vector(7 downto 0)) return std_logic_vector is
        begin
            if b = x"FF" then
                return x"00";
            else
                return std_logic_vector(unsigned(b) + 1);
            end if;
        end increment;
        function decrement(b : std_logic_vector(7 downto 0)) return std_logic_vector is
        begin
            if b = x"00" then
                return x"FF";
            else
                return std_logic_vector(unsigned(b) - 1);
            end if;
        end decrement;
        
        -- produced by p_interpret
        signal ptr                          : Pointer := 0;
        signal mem                          : Memory := (others => (others => '0'));
        signal stalled                      : std_logic := '0'; -- signals it's going forward in a loop. The p_fetch process will continue 
                                                                -- fetching until it finds the corresponding end-of-loop and puts that in pipe(0) at that time. 
        -- produced by p_fetch
        signal pipe                         : Pipeline := (others => dot);
        signal iptr                         : IPointer := 0;
        signal nest_count                   : NestCount := 0;
        signal expect_stall                 : std_logic := '0';
        signal should_back_up_on_stall      : std_logic := '0'; -- set if we expect a stall on an end_loop instruction
        -- produced by p_loadInstructions
        signal program                      : Instructions := (others => dot);
        signal prev_load_instructions       : std_logic := '0';
        signal instruction_step             : std_logic := '0';
        signal iwptr                        : IPointer := 0;
        signal internal_program_full        : std_logic := '0';
        -- produced by p_readMemory
        signal prev_memory_byte_read_ack    : std_logic := '0';
        signal prev_read_memory             : std_logic := '0';
    begin
        p_interpret : process(resetN, clock, load_instructions, read_memory)
        begin
            if resetN = '0' or load_instructions = '1' then
                ptr <= 0;
                mem <= (others => (others => '0'));
                stalled <= '0';
            elsif load_instructions = '0' and read_memory = '0' then
                if rising_edge(clock) then
                    case pipe(0) is
                    when dot =>
                        null;
                    when plus =>
                        mem(ptr) <= increment(mem(ptr));
                    when minus =>
                        mem(ptr) <= decrement(mem(ptr));
                    when advance =>
                        if ptr = MEMORY_SIZE - 1 then
                            ptr <= 0;
                        else 
                            ptr <= ptr + 1;
                        end if;
                    when back_up =>
                        if ptr = 0 then
                            ptr <= MEMORY_SIZE - 1;
                        else
                            ptr <= ptr - 1;
                        end if;
                    when begin_loop => 
                        if mem(ptr) = x"00" then
                            stalled <= '1';
                        else
                            stalled <= '0';
                        end if;
                    when end_loop =>
                        if mem(ptr) /= x"00" then
                            stalled <= '1';
                        else
                            stalled <= '0';
                        end if;
                    end case;
                end if;
            end if;
        end process;
        
        p_fetch : process(resetN, clock, load_instructions, read_memory)
            variable done_skipping : boolean := False;
        begin
            if resetN = '0' or load_instructions = '1' then
                pipe <= (others => dot);
                iptr <= 0;
                nest_count <= 0;
                done <= '0';
                expect_stall <= '0';
                should_back_up_on_stall <= '0';
                done_skipping := False;
            elsif load_instructions ='0' and read_memory = '0' then
                if rising_edge(clock) then
                    -- if pipe(1) contains a begin_loop instruction, the p_interpret process may start stalling as soon as 
                    -- it sees it, which we will only know one (extra) clock cycle afterwards. In that case, we don't want
                    -- to give it the next instruction unless we know it has had time to take a decision. Hence, if there's
                    -- a begin_loop instruction in pipe(1) we set the expect_stall flag. If there's a begin_loop in pipe(0)
                    -- and the expect_stall flag is set, we clear the flag and do nothing else. If the flag is not set, we
                    -- check whether the stalled signal is raised and, if so, start searching for the end of the loop. If
                    -- it's not set, we continue as normal.
                    -- if pipe(1) contains an end_loop instruction, p_interpret may also stall but if it does, we need to 
                    -- start backing up. When pipe(1) contains an instruction, the instruction pointer (iptr) already 
                    -- points one past the instruction, because we're getting ready to read the next instruction into 
                    -- pipe(1). Hence, while we can anticipate our not stalling (and therefore load the next instruction 
                    -- into pipe(1) regardless) we have to make sure that if we do stall, we start by backing up the 
                    -- instruction pointer twice (or not count the end_loop instruction as nesting).
                    if (pipe(1) = begin_loop or pipe(1) = end_loop) and stalled /= '1' and expect_stall = '0' then
                        expect_stall <= '1';
                        done_skipping := False;
                        if pipe(1) = end_loop then
                            should_back_up_on_stall <= '1';
                        else
                            should_back_up_on_stall <= '0';
                        end if;
                    end if;
                    if (pipe(0) = begin_loop or pipe(0) = end_loop) and expect_stall = '1' then
                        expect_stall <= '0';
                    else
                        if stalled = '0' then
                            pipe(0) <= pipe(1);
                        elsif stalled = '1' and nest_count = 0 and pipe(0) = begin_loop and pipe(1) = end_loop then
                            -- we're done skipping over the loop!
                            pipe(0) <= pipe(1);
                        elsif stalled = '1' and nest_count = 0 and pipe(0) = end_loop and pipe(1) = begin_loop and should_back_up_on_stall = '0' then
                            -- we are done backing up!
                            pipe(0) <= pipe(1);
                            iptr <= iptr + 2;
                            done_skipping := True;
                        elsif stalled = '1' and pipe(0) = pipe(1) and not done_skipping then
                            nest_count <= nest_count + 1;
                        elsif stalled = '1' and nest_count /= 0 and ((pipe(0) = begin_loop and pipe(1) = end_loop) or (pipe(0) = end_loop and pipe(1) = begin_loop)) then
                            nest_count <= nest_count - 1;
                        end if;
                        if stalled = '0' or (stalled = '1' and pipe(0) = begin_loop) then
                            if iptr = MAX_INSTRUCTION_COUNT then
                                pipe(1) <= dot;
                                done <= '1';
                            else
                                pipe(1) <= program(iptr);
                                done <= '0';
                            end if;
                            if iptr /= MAX_INSTRUCTION_COUNT then
                                iptr <= iptr + 1;
                            end if;
                        elsif not done_skipping then
                            assert stalled = '1' and pipe(0) = end_loop report "Unexpected stall!" severity failure;
                            if should_back_up_on_stall = '1' then
                                assert iptr >= 3 report "Stalled with an invalid instruction pointer!" severity failure;
                                pipe(1) <= program(iptr - 3);
                                iptr <= iptr - 3;
                                should_back_up_on_stall <= '0';
                            else
                                -- this is where we start backing up
                                pipe(1) <= program(iptr);
                                done <= '0';
                                if iptr /= 0 then
                                    iptr <= iptr - 1;
                                end if;
                            end if;
                        end if;
                    end if;
                end if;
            end if;
        end process;
        
        p_loadInstructions : process(clock, resetN)
        begin
            if resetN = '0' then
                program <= (others => dot);
                prev_load_instructions <= '0';
                instruction_step <= '0';
                iwptr <= 0;
                internal_program_full <= '0';
            else
                if rising_edge(clock) then
                    if prev_load_instructions = '0' and load_instructions ='1' then
                        program <= (others => dot);
                        iwptr <= 0;
                        instruction_step <= '0';
                        internal_program_full <= '0';
                    elsif prev_load_instructions = '1' and load_instructions ='1' then
                        if instruction_step = '0' then
                            if iwptr < MAX_INSTRUCTION_COUNT then
                                program(iwptr) <= toInstruction(instruction_octet);
                                iwptr <= iwptr + 1;
                            else
                                internal_program_full <= '1';
                            end if;
                        end if;
                    
                        instruction_step <= not instruction_step and not internal_program_full;
                    else
                        iwptr <= 0;
                        instruction_step <= '0';
                    end if;
                    prev_load_instructions <= load_instructions;
                end if;
            end if;
        end process;
        ack_instruction <= instruction_step;
        program_full <= internal_program_full;
        
        p_readMemory : process(clock, resetN, read_memory)
            variable rptr : integer range 0 to MEMORY_SIZE := 0;
        begin
            if resetN = '0' or read_memory = '0' then
                rptr := 0;
                memory_byte <= (others => '0');
                memory_byte_ready <= '0';
            else
                if rising_edge(clock) then
                    if read_memory = '1' then
                        if prev_read_memory = '0' then
                            memory_byte <= mem(0);
                            memory_byte_ready <= '1';
                            rptr := 1;
                        else
                            if prev_memory_byte_read_ack = '0' and memory_byte_read_ack = '1' then
                                if rptr /= MEMORY_SIZE then
                                    memory_byte <= mem(rptr);
                                    rptr := rptr + 1;
                                else
                                    memory_byte_ready <= '0';
                                end if;
                            end if;
                        end if;
                        prev_memory_byte_read_ack <= memory_byte_read_ack;
                    end if;
                    prev_read_memory <= read_memory;
                end if;
            end if;
        end process;
    end behavior;

[/aside] requires a _test bench_: a chunk of code used to exercise the component that's intended for synthesis. The test bench itself is not intended for synthesis, so it can do lots of things that you shouldn't do in code you want to synthesize (such as `after` and `wait` statements).

I tend to put assertions in code intended for synthesis as well as in the test bench, even if it has no effect when synthesized: I find they document the code as much as they help during testing, validating assumptions. I also try to write assertive test benches, so I can automate running them -- say by simulating a given time so that if it hasn't failed by then, it is unlikely (or impossible) to fail afterwards.

The test bench I wrote for this interpreter isn't quite complete yet: it doesn't fetch the altered memory from the interpreter to check what happened, nor does it take output from the interpreter during its runs (unlike regular BrainF, the `dot` opcode is implemented as a no-op, not as an output), but for a week-end pet project, I think it turned out pretty nice.

Here's the code for the test bench: [aside type="code" status="closed"]
    
    -- BrainF* interpreter - testbench
    -- Version: 20140929
    -- Author:  Ronald Landheer-Cieslak
    -- Copyright (c) 2014  Vlinder Software
    -- License: http://opensource.org/licenses/CDDL-1.0
    library ieee;
    use ieee.std_logic_1164.all;
    use ieee.numeric_std.all;
    use work.txt_util.all;
    
    entity BrainF_tb is
    end entity;
    architecture behavior of BrainF_tb is
        constant INITIAL_COUNTDOWN : integer := 10;
        --constant PROGRAM : string := "++++++++";
        --constant PROGRAM : string := "[.]";
        --constant PROGRAM : string := "-+[-+][[-+]]";
        --constant PROGRAM : string := "++[-][[-+]]";
        constant PROGRAM : string := ">+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.[-]>++++++++[<++++>-] <.>+++++++++++[<++++++++>-]<-.--------.+++.------.--------.[-]>++++++++[<++++>- ]<+.[-]++++++++++.";
        constant PROGRAM_TIMEOUT : Time := 138 ns;
    
        component BrainF is
            generic(
                  MAX_INSTRUCTION_COUNT : positive := 65536
                ; MEMORY_SIZE : positive := 65536
                );
            port(
                  resetN : in std_logic
                ; clock : in std_logic
                
                ; load_instructions : in std_logic
                ; instruction_octet : in std_logic_vector(7 downto 0)
                ; ack_instruction : out std_logic
                ; program_full : out std_logic
                
                ; read_memory : in std_logic
                ; memory_byte : out std_logic_vector(7 downto 0)
                ; memory_byte_ready : out std_logic
                ; memory_byte_read_ack : in std_logic
                
                ; done : out std_logic
                );
        end component;
        type State is (initial, start_loading_program, loading_program, running_program, success);
        
        function to_std_logic_vector(c : character) return std_logic_vector is
            variable cc : integer;
        begin
            cc := character'pos(c);
            return std_logic_vector(to_unsigned(cc, 8));
        end to_std_logic_vector;
        
        signal clock                    : std_logic := '0';
        
        signal load_instructions        : std_logic := '0';
        signal instruction_octet        : std_logic_vector(7 downto 0) := (others => '0');
        signal ack_instruction          : std_logic := '0';
        signal program_full             : std_logic := '0';
        signal read_memory              : std_logic := '0';
        signal memory_byte              : std_logic_vector(7 downto 0) := (others => '0');
        signal memory_byte_ready        : std_logic := '0';
        signal memory_byte_read_ack     : std_logic := '0';
        signal done                     : std_logic := '0';
        
        signal tb_state                 : State := initial;  
        
        signal should_be_done           : std_logic := '0';
        
        signal end_of_simulation        : std_logic := '0';
    begin
        interpreter : BrainF
            port map(
                  resetN => '1'
                , clock => clock
                , load_instructions => load_instructions
                , instruction_octet => instruction_octet
                , ack_instruction => ack_instruction
                , program_full => program_full
                , read_memory => read_memory
                , memory_byte => memory_byte
                , memory_byte_ready => memory_byte_ready
                , memory_byte_read_ack => memory_byte_read_ack
                , done => done
                );
        -- generate the clock
        clock <= not clock after 1 ps;
        -- generate the time-out signal
        should_be_done <= '1' after PROGRAM_TIMEOUT;
        
        p_tb : process(clock)
            variable countdown : integer := INITIAL_COUNTDOWN;
            variable program_load_counter : integer := 0;
        begin
            if rising_edge(clock) then
                case tb_state is
                when initial =>
                    assert done = '0' report "Cannot be done in the initial state" severity failure;
                    assert program_full = '0' report "Program cannot be initially full" severity failure;
                    assert ack_instruction = '0' report "Cannot acknowledge an instruction I haven't given yet" severity failure;
                    assert memory_byte_ready = '0' report "Cannot have memory ready when I haven't asked for anything yet" severity failure;
                    if countdown = 1 then
                        tb_state <= start_loading_program;
                    else
                        countdown := countdown - 1;
                    end if;
                when start_loading_program =>
                    assert done = '0' report "Cannot be done while loading the program" severity failure;
                    assert program_full = '0' report "Program cannot be initially full" severity failure;
                    assert ack_instruction = '0' report "Cannot acknowledge an instruction I haven't given yet" severity failure;
                    assert memory_byte_ready = '0' report "Cannot have memory ready when I haven't asked for anything yet" severity failure;
                    instruction_octet <= to_std_logic_vector(program(1));
                    load_instructions <= '1';
                    tb_state <= loading_program;
                    program_load_counter := 2;
                when loading_program =>
                    if program_load_counter <= program'length then
                        if ack_instruction = '1' then
                            instruction_octet <= to_std_logic_vector(program(program_load_counter));
                            program_load_counter := program_load_counter + 1;
                        end if;
                    else
                        load_instructions <= '0';
                        tb_state <= running_program;
                    end if;
                when running_program =>
                    if should_be_done = '1' then
                        assert done = '1' report "Timeout!" severity failure;
                    end if;
                    if done = '1' then 
                        tb_state <= success;
                    end if;
                when success =>
                    end_of_simulation <= '1';
                when others => null;
                end case;
            end if;
        end process;    
    end behavior;

[/aside]
And this is what it looked like in ModelSim:

{% include image.html url="/assets/2014/09/wave-300x125.png" caption="Waveform for the BrainF interpreter interpreting 'Hello world!'" %}

One thing you can see clearly in the waveform is that there's room for optimization: there's a large amount of time where the interterpreter's `ptr` register doesn't move, but the interpreter seems pretty busy. This is when it's executing these instructions: `[-]` -- that is: setting the current memory cell value to 0. Doing a bit more look-ahead to detect `[-]` and replacing it with an instruction setting the current cell to 0 as a one-shot deal would probably save quite a bit of time running the "Hello world" test case.

Another thing that takes the interpreter some time is finding out that it's done with the script: it currently fills its program memory with `dot` instructions and says it's done when it's reached the end of the program buffer. Filling it with `halt` instructions in stead would allow a program to halt anywhere (by inserting halt in the program), and would allow the interpreter to know it's done a lot quicker.

Other ideas are welcome. If there's any enthusiasm, I might invest a bit more time in this project...


* * *


I get comments about my coding style sometimes, both in C++ and in VHDL, so let's get some of them out of the way:




  1. I like to name things for what they do -- what their function is.  
That means there are very few abbreviations in my code: I say _reset_ rather than _rst_, etc. Exceptions occur when names clash: VHDL is case-insensitive (much to my chagrin) which means `Pointer` and `pointer` are the same thing. I still use `UpperCamelCase` for types, `lowerCamelCase` for functions, procedures and processes (with a `p_` prefix for processes) and `snake_style` for variables and signals, but that doesn't mean clashes don't occur, in which case abbreviations are the way to go.


  2. These two bits of code do the same thing:

    
    pipe(1) <= program(iptr - 3);
    iptr <= iptr - 3;



    
    iptr <= iptr - 3;
    pipe(1) <= program(iptr - 3);


but these two do not:

    
    memory_byte <= mem(rptr);
    rptr := rptr + 1;



    
    rptr := rptr + 1;
    memory_byte <= mem(rptr);


You'll usually see me prefer the first version over the second: it's more consistent and it's easier to read for someone who doesn't remember signal assignments aren't immediate.


  3. I hardly ever use prefixes or suffixes for anything: in C++, I use them to denote scope; in VHDL, I sometimes suffix inputs with `I`, outputs with `O` I/Os with `IO`; but always things that have negative logic with `N`. Processes tend to get a name, and tend to have a `p_` prefix so as not to confuse them with functions. The suffixes convey _important_ information which would otherwise not be available in the name alone -- so the in, out and inout suffixes are only there if there could possibly be any confusion (although I'm tending towards using them more).


  4. Reset signals always use negative logic, all other signals use positive logic.


  5. I try not to duplicate code unless the alternative is unreadable. For example: the current version of 
    
                        if stalled = '0' then
                            pipe(0) <= pipe(1);
                        elsif stalled = '1' and nest_count = 0 and pipe(0) = begin_loop and pipe(1) = end_loop then
                            -- we're done skipping over the loop!
                            pipe(0) <= pipe(1);
                        elsif stalled = '1' and nest_count = 0 and pipe(0) = end_loop and pipe(1) = begin_loop and should_back_up_on_stall = '0' then
                            -- we are done backing up!
                            pipe(0) <= pipe(1);
                            iptr <= iptr + 2;
                            done_skipping := True;

is an exception (the assignment from `pipe(1)` to `pipe(0)` is repeated) only because the alternative was a five-line-long condition (not stalled or stalled but not nested and either beginning or ending a loop but if ending a loop then we should also be backing up otherwise we're not really ending it...)


  6. I like encapsulating things in functions. Functions should be pure. Often, synthesis can get rid of them altogether because they just end up wiring things from one bit to another -- but they make the code a lot easier to read.


  7. The same is true for enumerations: while my seven opcodes all have a name, they can be represented with just three bits, but `dot` is easier to read than `"000"`


  8. My punctuation may seem a bit strange to some, but punctuation _is_ a bit strange: some lists are comma-separated while others are semicolon-separated and compilers tend to be finicky about where you put your commas and semicolons, so a comma-separated list that looks like `foo(a, b, c)` on a single line will expand to the following when put on multiple lines:
    
    foo(
          a
        , b
        , c
        )

This mostly began as a way to make diffs clearer: it's a lot less common to add things to the start of a list than it is to add things anywhere else. Inserting in a list that's formatted like this results in a single-line diff (just a line for what's been added) -- the existing lines remain untouched.

It took some getting used to, but now I find it easier to read this way as well.


