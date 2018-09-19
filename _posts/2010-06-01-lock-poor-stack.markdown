---
author: rlc
comments: true
date: 2010-06-01 23:26:58+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/06/lock-poor-stack/
slug: lock-poor-stack
title: Lock-Poor Stack
wordpress_id: 713
categories:
- C &amp; C++
tags:
- lock-poor
- Posts that need to be re-tagged (WIP)
---

[donate]

The following is the complete code of a lock-poor stack in C/C++: it's mostly C but it uses Relacy for testing, so the atomics are implemented in C++. With a little work, you can turn this into a complete C implementation without depending on relacy. I wrote in while writing an article that will soon appear on this blog.

The stack is not completely lock-free because it needs a lock to make sure it doesn't need any memory management solution for its reference to the top node during popping or reading the top node.
<!--more-->
The code is covered by the [GNU General Public License, version 3](http://www.gnu.org/licenses/gpl-3.0.txt)

    
    #define RL_MSVC_OUTPUT
    #include "relacy/relacy_std.hpp"
    
    enum StackResult {
    	STACK_RESULT_OK,
    	STACK_RESULT_E_BAD_ALLOC,	// allocation failed
    	STACK_RESULT_E_PRECOND,		// pre-condition failed
    	STACK_RESULT_E_EMPTY,
    };
    
    typedef unsigned int uint32_t;
    
    unsigned const thread_count__ = 3;
    
    struct StackNode_struct
    {
    	struct StackNode_struct * next_;
    	void * value_;
    };
    
    #define StackNode_setABACounter(p, a)					\
    	((StackNode*)((((uint32_t)(p)) & 0xFFFFFFF0) | ((a) & 0x0000000F)))
    #define StackNode_getABACounter(p) (((uint32_t)(p)) & 0x0000000F)
    #define StackNode_getPointer(p) ((StackNode*)(((uint32_t)(p) & 0xFFFFFFF0)))
    
    static StackNode * StackNode_new()
    {
    	// when we allocate a node, we actually allocate enough space for the node to
    	// be aligned at a 16-byte boundary and in the four bytes before the node, we
    	// have a pointer with the value of the original pointer, which we can call
    	// free(3) with.
    	uint32_t buffer = (uint32_t)calloc(1, 20 + sizeof(struct StackNode_struct));
    	char * retval = (char*)((buffer + 15) & 0xFFFFFFF0);
    	if ((((uint32_t)retval) - buffer) < 4) retval += 16;
    	void ** p = (void**)(retval - 4);
    	*p = (void*)buffer;
    
    	return (StackNode*)retval;
    }
    
    static void StackNode_delete(StackNode * node)
    {
    	void ** p = (void**)(((char*)StackNode_getPointer(node)) - 4);
    	free(*p);
    }
    
    struct Stack_struct
    {
    	Stack_struct()
    		: top_(0)
    	{
    		if (pthread_mutex_init(&lock;_, 0) != 0)
    			throw std::bad_alloc();
    	}
    
    	~Stack_struct()
    	{
    		StackNode * node = StackNode_getPointer(top_($).load());
    		StackNode * next;
    		while (node)
    		{
    			next = StackNode_getPointer(node->next_);
    			StackNode_delete(node);
    			node = next;
    		}
    		pthread_mutex_destroy(&lock;_);
    	}
    
    	std::atomic< StackNode * > top_;
    	pthread_mutex_t lock_;
    };
    
    Stack * Stack_new()
    {
    	Stack * stack = 0;
    
    	try
    	{
    		stack = new Stack_struct;
    	}
    	catch (const std::bad_alloc &)
    	{
    		stack = 0;
    	}
    
    	return stack;
    }
    
    void Stack_delete(Stack * stack)
    {
    	delete stack;
    }
    
    int Stack_push(Stack * stack, void * value)
    {
    	int retval = STACK_RESULT_OK;
    
    	if (stack)
    	{
    		StackNode * node = StackNode_new();
    		if (node)
    		{
    			StackNode * old_top = stack->top_($).load();
    			do
    			{
    				node->value_ = value;
    				node->next_ = old_top;
    			} while (!stack->top_($).compare_exchange_strong(old_top, StackNode_setABACounter(node, StackNode_getABACounter(old_top) + 1)));
    		}
    		else retval = STACK_RESULT_E_BAD_ALLOC;
    	}
    	else retval = STACK_RESULT_E_PRECOND;
    
    	return retval;
    }
    
    int Stack_top(Stack * stack, void ** value)
    {
    	int retval = STACK_RESULT_OK;
    
    	if (stack && value)
    	{
    		StackNode top;
    
    		pthread_mutex_lock(&stack-;>lock_);
    		if (stack->top_($))
    		{
    			memcpy(&top;, StackNode_getPointer(stack->top_($).load()), sizeof(top));
    			*value = top.value_;
    		}
    		else retval = STACK_RESULT_E_EMPTY;
    		pthread_mutex_unlock(&stack-;>lock_);
    	}
    	else
    		retval = STACK_RESULT_E_PRECOND;
    
    	return retval;
    }
    
    int Stack_pop(Stack * stack, void ** value)
    {
    	int retval = STACK_RESULT_OK;
    
    	if (stack && value)
    	{
    		StackNode top;
    		StackNode * top_ptr = 0;
    		int done = 0;
    
    		do
    		{
    			pthread_mutex_lock(&stack-;>lock_);
    			top_ptr = stack->top_($);
    			if (stack->top_($))
    			{
    				memcpy(&top;, StackNode_getPointer(stack->top_($).load()), sizeof(top));
    				pthread_mutex_unlock(&stack-;>lock_);
    				done = stack->top_($).compare_exchange_strong(top_ptr, StackNode_setABACounter(top.next_, StackNode_getABACounter(top_ptr) + 1));
    			}
    			else
    			{
    				pthread_mutex_unlock(&stack-;>lock_);
    				retval = STACK_RESULT_E_EMPTY;
    				top_ptr = 0;
    				done = 1;
    			}
    		} while (!done);
    		StackNode_delete(top_ptr);
    		*value = top.value_;
    	}
    	else
    		retval = STACK_RESULT_E_PRECOND;
    
    	return retval;
    }
    
    int Stack_empty(Stack * stack)
    {
    	return (stack && (StackNode_getPointer(stack->top_($).load()) == 0));
    }
    
    struct StackTest : rl::test_suite< StackTest, thread_count__ >
    {
    	void before()
    	{
            for (int i(0); i < 16; ++i)
            {
                push_counts_[i]($) = 0;
                top_counts_[i]($) = 0;
                pop_counts_[i]($) = 0;
            }
    		stack_ = Stack_new();
    	}
    
    	void thread(unsigned index)
    	{
    		int numbers[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
    		std::random_shuffle(numbers, numbers + 16);
    		for (unsigned int i(0); i < 16; ++i)
    		{
    			RL_ASSERT(Stack_push(stack_, (void*)numbers[i]) == 0);
    			++push_counts_[i]($);
    			void * p;
    			RL_ASSERT(Stack_top(stack_, &p;) == 0);
    			++top_counts_[(int)p]($);
    			RL_ASSERT(Stack_pop(stack_, &p;) == 0);
    			++pop_counts_[(int)p]($);
    		}
    	}
    
    	void after()
    	{
    		RL_ASSERT(Stack_empty(stack_));
    		Stack_delete(stack_);
            for (int i(0); i < 16; ++i)
            {
                RL_ASSERT(push_counts_[i]($) == 3);
                RL_ASSERT(pop_counts_[i]($) == 3);
            }
    	}
    
    	Stack * stack_;
    	std::atomic< int > push_counts_[16];
    	std::atomic< int > top_counts_[16];
    	std::atomic< int > pop_counts_[16];
    };
    
    int main()
    {
    	rl::test_params p;
    //	p.iteration_count = 100000;
    	p.search_type = rl::fair_full_search_scheduler_type;
    	rl::simulate< StackTest >(p);
    }
