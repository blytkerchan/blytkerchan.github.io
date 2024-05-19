Regular visitors of this blog will have noticed that something has changed.<!--more-->

<img src="/assets/2024/05/surprised-puppy.png" width="25%" align="right" />Obviously, the layout has changed quite a bit. I actually had a bit of time lately, so I decided to try my hand at React again. The last time I had done that was about a year ago, so I decided to dust off that particular little project and convert it into a blog.

The blog will load just as fast as it did before (it's not that hard to beat Wordpress, which was what I had before I had Jekyll, which preceded the current thing, which I'm calling Phoenix.ui) but will make better use of the real estate and will have a better look and feel on portable devices.

For the React developers out there, it actually has a few nice features:

1. I still write all of my posts in markdown, but the markdown rendering is now done in the browser rather than when I compile the blog.
2. I use webpack to create indexes at compile-time, which is loaded by the blog as it loads into your browser. This allows the blog to load the index into your browser and makes both the categories pages and the front page easy to load and render. The front page is also paginated now because of this.
3. Parts of the application that aren't needed to load the main page are _opportunistically_ lazy-loaded into the application, meaning they are loaded into the application when they are first needed _or_ when the application has fully rendered and the browser would otherwise be twiddling its thumbs.
4. The blog posts (and pages) themselves are lazy-loaded as well, but are kept around once loaded so we don't re-download the same thing more than once. At the same time, images aren't kept in memory in the browser, so they do hit the browser's cache as you navigate from page to page (but shouldn't re-download unless your device runs low on cache)..

I also used artificial intelligence to categorize the blog posts on the blog, making them easier to find. These categories will show up at the left-hand-side in a drop-down menu.

There's still a few things I'd like to do, like implement a dark mode, but those can wait.

The main driver for this, btw, wasn't just that I had some time to work on it: Jekyll is very nice, but working with Jekyll has turned out to be a bit of a pain: every time I wanted to add a new blog post and wanted to run it locally, I basically had to depend on my old setup, running on my Raspberry Pi, still working because updating Ruby and Jekyll's dependencies just never worked the way it was supposed to. I already know (in alphabetical order) three flavors of Assembly, C, C++, C#, Java, Javascript, Perl, Python, Typescript, VHDL, and Verilog, and I have a working knowledge of Go and Rust, but I couldn't bring myself to learn yet another programming language just to debug my blog (so no Ruby for me).
