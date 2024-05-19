In the latest installment of my podcast, I asserted that "all software productivity problems are project management problems". In this post, I will explain why I believe that to be the case and how I think those problems can be resolved.

<!--more-->

Increasing productivity means reducing waste. Lack of productivity means there is too much waste. Productivity and waste and each others antinomes. In software development, waste can be measured - measuring productivity itself is a lot harder.

The one thing we spend in software development is time: there's really not much else we use that we wouldn't use anyway (e.g. electricity, heating, etc.). That means that is also the one thing we can waste.

## Materials

In order to avoid wasting time, programmers should spend as little time as possible doing nothing (e.g. waiting for their computers to finish the work), which really accounts for a remarkably large part of the time a developer spends behind his/her computer. This means that the programmer should be equipped with the proper tools to do his job: a recent computer, an ergonomically correct work station, the right software tools for the job. A developer should spend as little time as possible adjusting his work environment to his needs - but should _definitely_ be allowed to do so: constraining a developer in a working environment can only have two possible effects: sub-standard productivity, or the developer leaving.

In some cases, this may mean that you need to allocate resources (time & money) to develop the necessary tools. For example: if you have a large project, you may need some system to allow your developers to synchronize with each other or to facilitate peer reviews.

## Methods

They should also spend as much time as possible doing productive work: designing implementing new features, improving or completing existing features. As little time as possible should be spent hunting down and fixing bugs, and no bug should be declared "fixed" unless

1. the root cause of the bug was understood,
2. (if the cause was external to the application) application input is (now) sufficiently filtered for the bug not to recur,
3. regression tests are in place
4. it is possible to reproduce the bug with those regression tests (in the original code), it is _the same_ bug that is reproduced by those regression tests and the regression tests no longer trigger the bug (in the fixed code).
   While it may be tedious to write regression tests (or unit tests, or functional tests, or any kind of tests) and while you might be tempted to delegate such tasks to an intern if you happen to have one handy, testing your code while it's still fresh in your mind(and reviewing it once it's no longer fresh in your mind - or, better yet, having it reviewed by a colleague) will increase developer productivity in the long run, as less time will ultimately be spent hunting down bugs.

I could bore you with many, many anecdotes of hunting bugs and killing them once I found them, but I won't. I'll only bore you with two anecdotes.

### Unit testing

Recently, I wrote a class that had, as its sole purpose, the purpose of replacing a bunch of copies of similar, but subtly different, pieces of code. This was a fairly simple class with only a few accessors designed for convenience and optimized for its use of memory and for speed. It's the "optimized for its use of memory and for speed" part that should get your bells ringing: that means there were parts of the class that were more complex than would have been absolutely necessary if those optimizations weren't there - which is often a cause for bugs.

Writing the class took be 40 minutes or so - like I said: it was a pretty simple class to begin with. Writing the tests took me a bit longer than that because I made a point of testing all the corner cases as well as the "normal" use cases. I found three bugs in the process, all three of which could have caused subtle bugs in the behavior of the code that used the class, but none of which were obvious enough for the class to be blamed for those bugs. The class was a container with iterators to give access to its contents. One of the bugs was that when the container was cleared, an internal table that was used by the `find` accessor wasn't reset properly, so `find` returned told old (now invalid) contents. In the calling code, this would not have caused any obvious problems right away - but it broke the unit test and was fixed before it ever reached the code the class was to be integrated with.

I don't know how much time was saved by killing this particular bug within a short while of its inception, but I'll take a wild guess and say it was more than the time it took me to write the unit tests, run them, fix the bugs it found (all three of them) and check the code coverage of the unit tests.

### Code review

Fairly recently, I was called upon to help debug a piece of code that I was not familiar with. At first glance, the code looked perfectly normal but there were three lines that irked me. They explained the bug they were looking for to me, but I was still irked by those three lines and, frankly, I get a bit aloof when that happens. So, I decided to fix the three lines that irked me first, before investigating the problem. Lo and behold, the code that irked me _was_ the problem.

This wasn't a systematic code review: this was a request for help finding a subtle bug that was fixed by an ad-hoc code review (which I did just to know what I was working with). Systematic code reviews are better but they work in much the same way: experienced programmers will intuitively find (some types of) bugs just because the code will not _feel_ right to them. Although this means their time needs to be invested in code reviews, this investment will almost certainly pay off both in terms of productivity (especially for the novice programmers, who now "automatically" get feed-back from the more experienced programmers) and in quality (lack of quality will result in lack of productivity in the long run, so you could see them as the same thing up to a point).

### Functional ("black box") tests

Sometimes, unit tests are not feasible: some code may interact directly with hardware that is difficult to simulate, unit tests for graphical user interfaces are notoriously difficult. This is where functional tests become important. They are arguably the most tedious and most costly type of tests - and automating them as musch as possibole is definitely a good idea. The point of this section is not, however, to tell you to avoid them, but rather to tell you how to reduce their negative impact on productivity and optimize their positive impact on that productivity.

#### Describing functional tests

When describing a bug, there's three things you need to know and a fourth you need to find out. The three things you need to know are

1. what you did to produce the unexpected behavior
2. what behavior you expected
3. what behavior you got.
   An easy-to-understand example is:
4. I flipped the switch
5. I expected there to be light
6. there was darkness.
   From this, a few questions arise (was there light before you flipped the switch?) which may lead the service personnel to a solution (flip the switch again, the light will come back).

Functional tests are similar, except that you already have the answer to a whole bunch of questions if you write them properly: you should start at a known state, control as many parameters as possible (and needed - most of the time you don't need to control the weather or the phase of the moon), and as you're testing something you presumably know, there's a good chance you already know what went wrong if it does go wrong. The thing, though, is that you are unlikely to know that when you perform the tests six months from now - so you had better write it down.

So, a description of a functional test should contain the initial configuration, the steps to go through the test, the expected behavior at each step and a description of what you are testing so the poor developer that ends up debugging it six months from now ... when you're on vacation and some poor oaf changed the code just before he left - you know that developer, you've been that developer! That poor developer needs all the help he can get so you should start helping him now, while he is still blissfully ignorant of the trouble he'll be in six months from now.

#### Prioritizing functional tests

Functional tests have a tendency to become time-consuming - especially if you can't automate them, so you should concentrate on the most obvious problems first: cases where you know there's a good change that it will fail spectecularly if at all. These are called "smoke tests". When those pass, you can go deeper and start looking for bugs. Then, if possible, test every conceivable possibility.

##### Smoke testing

Smoke tests are tests that are easy to run by a human (but not so easy to automate) and point out more-or-less obvious regressions and errors. The idea is to run those first to "fail fast". If they fail, it doesn't make much sense to do any further testing as you already know the code is broken.

A smoke test could look like "install the program on a clean system and run it". If that fails, something is either wrong in the installation procedure or in the program itself. Though this may seem obvious, programmers usually don't spend their time installing the program - they usually work with more-or-less adapter "live" versions. So smoke tests should be tests that are obvious enough to forget, easy to run and easy to diagnose.

##### Deep testing

While smoke tests should be easy to run, they don't usually cover what's necessary to know that the application is OK to ship - they'll just tell you that it's _not_ OK if they fail. "Deep testing" goes through the requirements of the application and checks that all requirements are met. As much of this as possible should evidently be automated, because it basically comes down to testing as many of the known use-cases as possible, which can be a very time-consuming thing to do.

Again, well-written test-cases will reduce the negative impact and optimize the positive impact on productivity here - even if it takes some time to write well-written test-cases, this usually pays off after a while. It also means you can delegate your testing to less expensive resources (such as interns).

Starting deep testing early in the development cycle increases confidence in the code-base and decreases the probability you'll be interrupted in your development by bugs popping up everywhere - which is also a great way to waste time (being interrupted, that is).

##### Exhaustive testing

I am not some-one who will advocate systementic _exhaustive_ testing - e.g. testing all possible permutations of a set of parameters to make sure the parameters are always taken into account correctly. Parts of the code-base that you don't trust _should_ be tested exhaustively (or as exhaustively as possible) before being incorporated in the product, though: it's never a good idea to wait for the worst before checking whether the worst will happen - and believe me: if you don't check, it _will_ happen!

## Conclusion

So, how are all these things project management problems? Well, usually, the quality of testing and the allocation of time for developers to write unit tests, regression tests and functional tests is up to management. Not allocating that time in the beginning of the project will usually bite you in the backside somewhere during the project (usually late in the project, when it hurts most).

Making sure developers have the proper tools is usually also something project managers can push for, if not simply obtain, as that usually (directly or not) comes out of the project budget. These are investments only (project) managers can make that have a huge impact on the productivity of the developers on the project.

On thing I haven't talked about is the choice of developers for the project, which can have a _huge_ impact on productivity for the whole team: I am all for hiring interns and just-out-of-school programmers, but their lack of experience and know-how should be balanced by hiring experienced programmers and analysts as well: you cannot expect an intern or newby to magically train himself.