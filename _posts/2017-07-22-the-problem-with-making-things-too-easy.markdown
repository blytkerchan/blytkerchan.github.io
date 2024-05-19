<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The thing with making things easier is that it makes mediocre people seem competent and incompetent people seem mediocre...</p>&mdash; Ronald (@blytkerchan) <a href="https://twitter.com/blytkerchan/status/888378949683773440?ref_src=twsrc%5Etfw">July 21, 2017</a></blockquote>

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<!--more-->

A few years ago, we hired an "interior decorator" to help us with a few things in our kitchen. It was a disaster: her incompetence was as staggering as her lack of self-awareness. The whole project took only a few weeks, but the mess she made took longer than that to clean up. She had, of course, lied about her credentials and her experience and, in retrospect, her references were more than a bit shaky, but hindsight is 20/20.

A project I worked on recently reminded me of that particular episode (and of the nail found in our son's diaper during that episode -- he's ten years old now and no longer wears diapers): the person I was working with had several years of experience designing and implementing software and the job we had for him was (I thought), fairly straight-forward. Turns out it wasn't.

Part of the problem here is the [Dunning-Kruger effect](https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect): a cognitive bias that makes less competent people think they're more competent than they are and, as an extension, competent people think they're less competent than they are. It basically means that when you find something easy, you underestimate the difficulty someone else might have with it; and if you find something hard, you overestimate the difficulty someone else might have. In this case, we underestimated the difficulty of the task at hand[^1].

[^1]: Note that the interior decorator had no such excuse.

Another part of the problem is that software development looks a lot like firmware development, but it's not the same thing. Knowing how to make a phone app does not make you a competent firmware developer. The tools used for both trades are mostly the same (text editors, compilers, debuggers) and integrated development environments make both jobs a lot easier, but the skills required for firmware development include things like knowing how to manage resources, avoid memory fragmentation, handle concurrency, etc. while the high-level languages and frameworks that are generally available to software programmers hide most of these details.

But these tools can also hide lack of competence: someone who would be able to develop software without fancy tools and frameworks will still be able to do so with them, but someone who would not be able to do the job without the help of the new tools is now _also_ able. This can be a good thing, but it is also pernicious.

For example: many compilers now perform static analysis on the code they compile and will tell the developer that "N bytes may be read from A, which is only M bytes in size". Bugs get caught like this that would otherwise have to be tested for specifically, which is good[^2]. What the compiler won't tell you, however, is that your shared state is shared state -- that your server will only be able to serve a single client at a time. An experienced and competent developer will take a look at your code and say "hmmm.. that looks odd" and, even if he can't put his finger on the bug right away, the code won't "smell" right. Compilers have no sense of smell -- and apparently neither do less-than-competent developers.

[^2]: However, that doesn't mean you shouldn't still test your corner cases!

In the code I'm thinking of, there were two f{r,l}agrant examples of unintentional shared state: one was in a server application that was, in deed, only able to serve a single client at a time (if two clients queried it simultaneously, it would mix up its responses); another was a static index variable in a function shared by **_eight_** threads[^3].

[^3]: Of course, part of the problem here was unnecessary multi-threading.

    <blockquote class="reddit-card" data-card-created="1537640697"><a href="https://www.reddit.com/r/ProgrammerHumor/comments/63kko1/unnecessary_multi_threading/">Unnecessary multi threading.</a> from <a href="http://www.reddit.com/r/ProgrammerHumor">r/ProgrammerHumor</a></blockquote><script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>

Embedded devices are getting better CPUs, more memory, hard disks, etc. They are being connected to the Internet and are being called "IoT devices". Everyone and their grandmother can develop apps for phones, connected devices, and any type of widget you can think of. This is fun, and fun is good. However, that also means that people who claim to have experience with embedded devices are becoming more common, and device failures will, _on average_ become less critical. A security breach in a router running Linux in a home somewhere will generally not be a huge problem. Stopping production in your local cookie factory can be a nuisance, but is hardly critical. Turning the lights off on an entire country is a different matter.

The skill-set required to develop for that home-based router is very close to the skill-set to develop for IEDs[^4] but sometimes, very close doesn't cut it.

[^4]: Intelligent Electronic Devices, not Improvised Explosive Devices.