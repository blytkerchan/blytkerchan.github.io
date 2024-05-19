Though laudable, the quest for bug-free software is doomed to failure. This should be news to no-one as the argument for this is as old as I am.

<!--more-->

## Software Verification

The argument in question goes as follows: proving a mathematical theorem is a social process that can only succeed if the theorem in question is sufficiently general and simple (or interesting) to interest a large number of people. Any real software is inherently neither general (because it has to deal with real-world input) nor simple, so formal proof of the correctness of real software will be extremely complex and will not be able to interest a large enough number of people to be discussed in symposia or during lunch breaks where proofs can be scribbled on napkins. Therefore, the social process breaks down[^1].

[^1]: "Social Processes and Proofs of Theorems and Programs", Richard A. DeMillo, Richard J. Lipton and Alan J. Perlis; POPL '77 Proceedings of the 4th ACM SIGACT-SIGPLAN symposium on Principles of programming languages

This point is perhaps best illustrated with an anecdote offered by its original authors[^2]:

<blockquote>The fast pattern matching algorithm of Knuth, Morris and Pratt was first implemented and proved by Jim Morris as part of Berkeley's text editing system. Subsequently, a system programmer who did not understand the new algorithm, pulled it from the text editor and replaced it with a much slower pattern matching routine. Presumably the system programmer "understood" the new algorithm.</blockquote>

[^2]: _ibid._

They conclude, from this anecdote, that "give[n] a choice between a very good algorithm with a proof of correctness, but which may be hard to understand, and a straightforward, unproven algorithm which an implementor believes he understands, the complex algorithm invariably loses"[^3] and they are probably right.

[^3]: _ibid._

It is perhaps heartening to know that, back in the late seventies, they already knew that the perfect solution could not exist but, as noted by Bertrand Meyer, "practitioners and researchers have largely ignored those who said verification would never work, and instead patiently built verification methods and tools that are increasingly useful and scalable"[^4]. He is, of course, right: static verification tools are getting better but, as he points out, "proofs are great when they succeed; but they can fail (after all, we are dealing with undecidable theories), and they can only prove what has been explicitly specified. In practice we need both [proofs and tests]."[^5].

[^4]: "[Software Verification Turns Mainstream](http://cacm.acm.org/blogs/blog-cacm/105571-software-verification-turns-mainstream/fulltext)", Betrand Meyer
[^5]: _ibid._

However, even tests that cover 100% of the _code_ necessarily don't cover a 100% of possible _input_ and verify 100% of possible _output_. Tests can prove that a defect exists, but cannot prove that a defect does _not_ exist. Proofs, on the other hand, can prove that no defects exist but proofs can fail, even in the absence of programming errors, and even proofs can be "buggy" -- because they are created by human beings and the way they are eventually accepted isn't through a real formal process, but through a social one.

Although I must conclude from this that bugs must exist in any non-trivial software (due to the infeasibility to test all possible cases and the infeasibility to completely prove correctness), I must also add that

1. that doesn't mean _reliable_ software is beyond our reach
2. nor does it mean that we should give up trying to create bug-free software (even if we can't prove our success in doing so), and
3. because proving correctness is inherently a social process, the "more eyes" mantra must work

## Towards Reliable Software

Current efforts toward reliable software, among "practitioners" are geared towards better programming languages; better static analysis (verification) tools and techniques; better development processes, tools and techniques; and better testing tools and methods (including context-driven testing). While, as noted by mr Meyer, the research community has focused mainly on verification, practitioners have turned the art of software creation, as it existed in the 1950s and 1960s into the discipline of software engineering as it exists today.

The development towards software engineering as a discipline has been a raucous affair, as exemplified by that development in military software. During the 1950s and 1960s, software development had grown into a crisis: while in the early years, programming had been clerical work done mostly by "girls"[^6] "over the course of the 1950s and 1960s (...) it became increasingly plain to programmers and their managers that software presented serious engineering difficulties of its own, comparable to those of hardware"[^7]. As of that point, US military institutions, starting with the Navy started imposing a normalization process focused on the way software is produced, rather than on the results of that process[^8].

[^6]: Marie Hicks,"Only the Clothes Changed: Women Operators in British Computing and Advertising, 1950-1970", IEEE Annals of the History of Computing, October-December 2010 (vol. 32 no. 4).
[^7]: Christopher McDonald, "From Art Form to Engineering Discipline? A History of US Military Software Development Standards, 1974–1998", IEEE Annals of the History of Computing, October-December 2010 (vol. 32 no. 4).
[^8]: _ibid._

### The Introduction of Agile

This process of normalization, which met with resistance from the very outset[^9] eventually led to a small revolt in the software engineering community, starting with the inception of Scrum in the late 1980s and early 1990s, when the existing process is described (as the "old" approach), as follows[^10]:

[^9]: _ibid._
[^10]: H. Takeuchi and I. Nonaka, "The New New Product Development Game," Harvard Business Review, 1986.

<blockquote>Under the old approach, a product development process moved like a relay race, with one group of functional specialists passing the baton to the next group. The project went sequentially from phase to phase: concept development, feasibility testing, product design, development process, pilot production, and final production. Under this method, functions were specialized and segmented: the marketing people examined customer needs and perceptions in developing product concepts; the R&D; engineers selected the appropriate design; the production engineers put it into shape; and other functional specialists carried the baton at different stages of the race.</blockquote>

The method described here is, of course, the "waterfall" approach first described by Boehm ten years earlier, in 1976.

<blockquote>Under the rugby approach, the product development process emerges from the constant interaction of a hand-picked, multidisciplinary team whose members work together from start to finish. Rather than moving in defined, highly structured stages, the process is born out of the team members’ interplay. A group of engineers, for example, may start to design the product before all the results of the feasibility tests are in. Or the team may be forced to reconsider a decision as a result of later information. The team does not stop then, but engages in iterative experimentation. This goes on in even the latest phases of the development process.</blockquote>

They summarize this approach as follows:

<blockquote>This holistic approach has six characteristics: built-in instability, self-organizing project teams, overlapping development phases, “multilearning,” subtle control, and organizational transfer of learning. The six pieces fit together like a jigsaw puzzle, forming a fast flexible process for new product development. Just as important, the new approach can act as a change agent: it is a vehicle for introducing creative, market-driven ideas and processes into an old, riged organization.</blockquote>

This 1986 article gave its name to the now most popular agile development framework: "Scrum"; and with this new idea came the next step in the evolution of the software engineering discipline.

### Quality in Agile

Unlike the previous approach, which was geared to reducing defects and the cost of defects through the application of a rigorous process, agile development focuses on cost reduction and speedy development of software by integrating key stakeholders in the development process, throughout the process, while giving the developers more latitude on the details of the development process. Worrisome to some, the agile movement focused on the reduced cost and increased customer involvement -- especially in the early days -- and left the quality issues aside. The purpose of the agile approach was to reduce the chance that a project went over budget, delivered too late and finally delivered something that was no longer useful when it was finished -- which was, and still is, a common occurence in software engineering practice.

Ming Huo _et al._ picked up this worry and analyzed QA practices in agile environments, comparing them with waterfall environments, for the 28th Annual International Computer Software and Applications Conference, in 2004 (COMPSAC'04). They noted that "In agile methods, there are some practices that have both development functionality as well as QA ability. This means that agile methods move some QA responsibilities and work to the developers."[^11]. While this partly shifts the burden of QA to the developers, that shift is not complete, and the shorter development cycle (iteration) also allows for better communication between the QA team and the developers: "In an agile methods phase a small amount of output is sent frequently to quality assurance practices and fast feedback is provided, i.e., the development practices and QA practices cooperate with each other tightly and exchange the results quickly in order to keep up the speed of the process. This means that the two-way communication speed in agile methods is faster than in a waterfall development."[^12].

[^11]: Ming Huo, June Verner, Liming Zhu and Muhammad Ali Babar, "Software Quality and Agile Methods", 28th Annual International Computer Software and Applications Conference (COMPSAC'04).
[^12]: _ibid._

Another popular practice in agile development is _Continuous integration_ which, by making the integration of software components happen more often, reduces the integration issues that had become common in the waterfall method, where integration is one of the last steps. Huo _et al._ called continuous integration "an example of a dynamic QA technique"[^13]. Together with _Test-Driven Development_ and extensive _Unit Testing_ agile processes have attempted to tackle quality and, in some cases, have succeeded in doing so. However, as agile processes leave a lot of latitute to the development team as to the development methods used, sometimes, at least some of the burden of validation and verification is shifted from the service provider (developers and their organization) to the customer who, while more involved in the development process, also has to do some of the testing[^14].

[^13]: _ibid._
[^14]: e.g. acceptance testing.

That is not always the case, though: as described in an anecdotal article by Michael Puleio, "How Not to do Agile Testing", the quality of the software resulting from the development process is heavily dependent on the professional attitutes of the participants on the project. He describes the tough process a team at Microsoft, on which he was a developer, went through as they developed a new platform for one of MSN's services. The team was made up of a project manager (who doubled as product owner), two software development engineers and two software testing engineers. Each of these team members apparently took their responsibilities very seriously but each initially had trouble understanding the jobs of the others (i.e. developers didn't understand project management and testing, testers didn't understand development and project management, and the project manager didn't understand development and testing). Communication was key to their success, as was testing[^15].

[^15]: Michael Puleio, "How Not to do Agile Testing", Proceedings of AGILE 2006 Conference (AGILE'06).

<blockquote>We found that if automation of acceptance testing will be part of a sprint definition and the “done” criteria, and test automation is beyond the skill of the testers, the team must develop a test strategy and automation in advance of development (or at least in parallel). This can keep the feedback loop in sync with development so that testing basic functionality takes almost no time. If the feedback loop is not in sync with development there could be confusion about whether or not a task is “done.”</blockquote>

Puleio further concludes that:

<blockquote>Automation is the key to agile testing. Even if all you do for your first sprint is implement one feature for the customer, but you create a test automation framework you can extend easily over time, you will have made an investment that will pay off later in the project. This framework and tools should be up to your quality standards for production code.</blockquote>

In fact, making the tests themselves deliverables, applying the same standards as to the production code itself and applying the same scrutiny to the quality of the tests as you would to the quality of the final product, tends to improve the end result of the final product.

## Conclusion

While we have known for more than three decades that bug-free software will forever remain a goal beyond our reach or, at least, that we cannot prove that it exists, it has remained the holy grail of software development and the quest for it has pushed software development from an art for mathematicians and a clerical job for "girls"[^16] to an engineering discipline for software development professionals -- men and women.

[^16]: This is by no means pegorative: computer programmers in the 1940s and 1950s were predominantly young women who were referred to as "girls" in contemporary literature and advertising.

Software engineering has gone from process normalization to normalization of the expected quality of the _result_ of the process; from a waterfall aiming to reduce the _cost_ of procrastination to the elimination of procrastination itself through agility.