---
author: rlc
comments: true
date: 2009-08-14 14:39:55+00:00
layout: post
title: Hiding Complexity in C++
wordpress_id: 150
tags:
  - complexity
  - Posts that need to be re-tagged (WIP)
---

C++ is a programming language that, aside from staying as close to the machine as possible (but no closer) and as close to C as possible (but no closer), allows the programmer to express abstraction if a few very elegant constructs. That is probably the one thing I like best about C++.

<!--more-->

This morning, while coding on a product for Vlinder Software, I had a function to write that was to handle at least ten different scenarios, which first had to be identified, and had subtle and not-so-subtle consequences, including, but not limited to, four scenarios in which the function had to recurse up the directory tree. The calling code is ignorant to these scenarios - and should be, for it doesn't need to know about them. I didn't want to expose the existence of these scenarios any more than strictly necessary, but I did want readable code. I.e., at the calling point, I just wanted this:

    HANDLE handle(createFCNHandle(monitor));

This means createFCNHandle had to behave differently according to a set of flags in monitor, and the current state of the filesystem.

I could have written one huge function with a few loops in it, or broken it up into a few functions that would live in a separate namespace and call that from createFCNHandle. That would've been a respectable way of implementing it (the latter, not the former). That's not what I did, however: I decided to use two facilities that C++ offers that are underestimated most of the time, IMHO: the fact that you can construct an object in-place by calling its constructor, and the fact that you can overload the cast operator.

Here's what the code looks like:

    /* this is a pseudo-function: it's an object that gets created by invoking its
     * constructor and is then automatically cast to the intended return type. The
     * naming convention suggests its a function for this purpose. The intent is to
     * be able to split the function's logic into parts without creating a whole
     * bunch of separate functions and thus putting things like enumerations in the
     * surrounding namespace. */
    struct createFCNHandle
    {
    	/* When we're constructed, we may be in any one of the following situations:
    	 * * the monitor was asked to monitor a file that already exists
    	 *   in that case, we need to create a FCN handle for the file or,
    	 *   if the self_remove_and_subseq_create__ flag is set, for the
    	 *   directory above it;
    	 * * the monitor was asked to monitor a directory that already exists
    	 *   more or less the same case as above - the only difference being
    	 *   that we now need to pass the FILE_NOTIFY_CHANGE_DIR_NAME flag in
    	 *   stead of the FILE_NOTIFY_CHANGE_FILE_NAME flag to
    	 *   FindFirstChangeNotification, but if we always pass both, there should
    	 *   be no problem
    	 * * the monitor was asked to monitor a file or directory that does not exist, in a
    	 *   directory that does exist
    	 *   in that case, we monitor the parent directory
    	 * * the monitor was asked to monitor a file or directory in a directory that does not exist
    	 *   in that case, we climb up the tree until we either hit the root, which may
    	 *   or may not exist (might be a non-existant drive in Windows) or we hit a
    	 *   directory that does exist, and monitor it. */
    	enum Scenario {
    		monitor_existing_file_no_recurse__,
    		monitor_existing_file_with_recurse__,
    		monitor_existing_file_full_recurse__,
    		monitor_existing_dir_no_recurse__,
    		monitor_existing_dir_with_recurse__,
    		monitor_existing_dir_full_recurse__,
    		monitor_non_existant_file_in_existing_dir__,
    		monitor_non_existant_file_in_non_existant_dir__,
    	};

    	createFCNHandle(Monitor & monitor)
    		: monitor_(monitor)
    	{
    		scenario_ = determineScenario(monitor.getPath());
    		file_to_monitor_ = findFileToMonitor(scenario_, monitor.getPath());
    		handle_ = FindFirstChangeNotification(/* ... */);
    	}

    	~createFCNHandle()
    	{
    		if (handle_ != NULL)
    			FindCloseChangeNotification(handle_);
    		else
    		{ /* no-op */ }
    	}

    	operator HANDLE() const
    	{
    		HANDLE retval(handle_);
    		handle_ = NULL;
    		return retval;
    	}

    	Scenario determineScenario(const boost::filesystem::path & path)
    	{
    		/* ... */
    	}

    	boost::filesystem::path findFileToMonitor(Scenario scenario, const boost::filesystem::path & path)
    	{
    		using namespace boost::filesystem;
    		switch (scenario)
    		{
    		case monitor_existing_file_no_recurse__ :
    		case monitor_existing_dir_no_recurse__ :
    			return path;
    		case monitor_existing_file_with_recurse__ :
    		case monitor_existing_dir_with_recurse__ :
    		case monitor_non_existant_file_in_existing_dir__ :
    			return path.branch_path();
    		case monitor_existing_file_full_recurse__ :
    		case monitor_existing_dir_full_recurse__ :
    			return path.root_path();
    		case monitor_non_existant_file_in_non_existant_dir__ :
    			return findFileToMonitor(determineScenario(path.branch_path()), path.branch_path());
    		default :
    			throw std::logic_error("Un-treated case!");
    		}
    	}

    	bool recursive() const
    	{
    		return (scenario_ != monitor_existing_file_no_recurse__ &&
    			scenario_ != monitor_existing_dir_no_recurse__);
    	}

    	Monitor & monitor_;
    	Scenario scenario_;
    	mutable HANDLE handle_;
    	boost::filesystem::path file_to_monitor_;
    };

Though unimportant details have been removed from the code above, I think it's pretty self-explaining: the pseudo-function first tries to find out in what scenario it is, then it finds the file it should attach the OS's monitor to attaches the monitor and is finished constructing. Where the pseudo-function is invoked, the object is constructed after which the cast operator is invoked, which will emulate returning the value. Should the return value be ignored for some reason (and thus the cast operator not be invoked), the destructor will close the handle.
