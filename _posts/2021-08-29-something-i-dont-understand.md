Every time I look at VHDL code written by (sometimes veteran, sometimes not so much) firmware engineers, the code looks similar: a bunch of signals coming in with their direction encore in the name, and sometimes the polarity as well, but very little in the way of functionality: sometimes it’s just the datasheet pin name of the device the signal is from that made it all the way into the component I’m looking at (which, when I find that annoying, is not the top). 

This part I kinda get: it’s the same issue we’ve had in software for ages, dating back before the Hungarian warthogs of the 1990s. 
<!--more-->
The part I don’t get is that the values of the signals are almost never given a proper name. It seems to me that the first thing you want to do is to understand what the value actually means semantically, and write that down. VHDL has a very strong type system for just this purpose, so once you’re inside the component and can therefore use non-standard types as much as you want, I’d immediately reach for it and go: `type PotatoLauncherTargetingStatus is (idle, searching, acquiring, locked);`, put some code outside of any process to map the status bits (assuming I have two incoming status bits in this case) to the states and use the states from there on. 

```
 with status_I select potato_ launcher_targeting_status <= 
     searching when "01",
     acquiring when "11",
     locked when "10",
     idle when others;
```

The thing is, the compiler will get rid of this when compiling your code, so it doesn’t affect gate usage, timing, or anything else: it just makes the code more readable. I’ve often had firmware engineers tell me that my code looks like "a software guy’s code" at first glance, but I’ve rarely had anyone tell me they don’t understand what the code’s doing, so I don’t really care about that "hey your code is too easy to read" first remark. 

So why not? What’s the downside? A little extra typing to go from `status_I` to `potato_ launcher_targeting_status`? I mean, if you wanted to type less, why use VHDL?