There are a few misconceptions I hear about Git that I find should be cleared up a bit, so here goes:

<!--more-->

**"To use Git you need to use the command-line"**

Not necessarily: there are various graphical tools that come with Git, including git-citool, gitk and git-gui, all of which are based on Tk -- which turns out to make them both very light-weight and portable. Almost anything you might want to do in a daily basis can be done with these tools.

Aside from that, for our Windows-using friends, there is [Tortoise Git](https://code.google.com/p/tortoisegit/), which integrates Git right into Explorer.
A quick search on Google reveals a number of other graphical user interfaces for Git so no, you can do without the command-line if you feel more comfortable with a mouse.

**"There is no central repository"**

This is technically true, as Git is a distributed version control system so the repository you're using is on your hard disk. That doesn't mean, however, that you _cannot_ have a central repository: I would recommend having a "canonical" central repository with code that has been properly curated and into which only certain people can push, and one or more "experimental" repositories, which you might see as you'd see branches in a central repository.

Still, if you want a central repository into which everyone can push, that is fairly simple to set up with Git. It's not what Git was designed to do, but because it's so flexible, there's no reason why it wouldn't work.

**"You need SSH"**

No, you don't. You can push and pull over a Windows share (Samba) if you want to. SSH happens to be a great way of connecting to a server securely, using a pre-shared public key for authentication, and Git happens to come with something that pretends to be a shell but really isn't -- so users don't get shell access to your server, but you don't _have to_ use any of that. You can push/pull over https & webdav if you feel more comfortable with that and, due to the modular nature of Git and its extensibility, it's actually fairly easy to create a Git-over-potato-launcher extension (except for building a potato launcher that can effectively and efficiently talk to a server). Check the documentation for git-remote-helpers if you want more information about that.

**"Git doesn't integrate with my IDE"**

Really? What IDE are you using? There are Git plug-ins for Visual Studio, Eclipse, IntelliJ IDEA, NetBeans, ...

**"Git is difficult to understand"**

Under the hood, Git is a content-addressable filesystem.

If that doesn't tell you anything, then understand that Git is optimized for the general use-case (checkout, modify, stage, commit). The staging step puts your changes in an index, which means you get to prepare exactly what goes into your commit, and you even get to edit it if you want to, before you commit it (using the interactive git-add).

Basically, when you commit something to the repository, you're adding a single object to it that says "I started with this version and now I have this". It does not say "this is what I changed". Staging lets you prepare that commit object. That means that if you have two modifications in a single file but only want to commit one of them, you can.

Now, it's true that some things in Git can be a bit hard to catch if you're used to systems like CVS, SVN or TFS, but as soon as you start wrapping your head around the idea that Git history is basically a linked list of commits, each of which provides a complete description of the then-current version and its complete history (through the link with the previous commit), it becomes clearer.

**"Using Git you have to rebase a lot, losing history"**

I've been using Git pretty much since its inception and I have only rebased a branch three or four times so no, you don't have to do that.

Git is really good at merging -- it's why it's such a good versioning system (creating branches is easy, merging them is a much bigger challenge). I know some workflows prefer rebasing over merging, but I frankly think those are misguided.

Rebasing doesn't lose history, though: it re-writes it on top of a different version of the parent branch.

**"Git discourages continuous integration"**

No, it doesn't. While you certainly _can_ work in isolation, continuous integration is not a question of everybody hacking on the master/current/root/main branch and inflicting their code on everyone else: it's a question of integrating changes continuously, which pulling and good support for merging makes fairly easy.

Just give it a try, eh?