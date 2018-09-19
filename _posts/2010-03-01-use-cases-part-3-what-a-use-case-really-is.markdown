---
author: rlc
comments: true
date: 2010-03-01 21:41:25+00:00
layout: post
link: http://rlc.vlinder.ca/blog/2010/03/use-cases-part-3-what-a-use-case-really-is/
slug: use-cases-part-3-what-a-use-case-really-is
title: 'Use-Cases Part 3: What A Use-Case Really Is & Writing Use-Cases'
wordpress_id: 391
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
- use-cases
---

[donate]

Before we start using use-cases in the description of the functional requirements we want to meet in our project, we need to understand what a use-case really is and how to go about writing one. In this installment I will attempt to answer both those questions. However, this series is called "C++ for the self-taught" for a reason: I will include references for all of the material I have cited in this installment, and I hope you will take it upon yourself to go out and look a bit yourself as well.
<!-- more -->


## what use-cases are(n't)


In the [June 2002](http://www.ibm.com/developerworks/rational/library/content/RationalEdge/jun02/MisuseUseCasesJun02.pdf) and [July 2002](http://www.ibm.com/developerworks/rational/library/content/RationalEdge/jul02/TopTenWaysJul02.pdf) issues of the Rational Edge, there is a rather succinct description of how use-cases are abused on a daily basis. They are perhaps the most popular way to capture user requirements - and they are very good at that - but they are not the be-all and end-all of requirements specifications. I'll quote Ellen Gottesdiener in explaining why: "From the point of view of a person or system interacting with your software, a use case nicely describes an aspect of its behavior. But no single user requirements model can fully express all of the software's functional requirements: its behavior, structure, dynamics, and control mechanisms."

Another definitions of use-cases goes like this: "A use case defines a goal-oriented set of interactions between external actors and the system under consideration. Actors are parties outside the system that interact with the system <del>(UML 1999, pp. 2.113- 2.123)</del>_(UML version 2.2 Superstructure, section 16.3.1)_. An actor may be a class of users, roles users can play, or other systems. Cockburn (1997) distinguishes between primary and secondary actors. A primary actor is one having a goal requiring the assistance of the system. A secondary actor is one from which the system needs assistance" [Bredemeyer Consulting, edited for references].

Note that use-case actors are _not_ necessarily human. However, in use-case diagrams actors are drawn in a more-or-less human shape (what has two arms, two legs, a body and a head, and stands upright?) which leads many untrained readers (i.e. customers) to believe that they are humans.

This is not the only confusion about use-cases: in his article ["Use cases considered harmful", A.J.H. Simons](http://doi.ieeecomputersociety.org/10.1109/TOOLS.1999.779012) makes the case that there have been important disagreements about some of the fundamental parts of the definitions of use-case, their understanding and their interpretation from the outset. Although this article is more than a decade old and we've come some way from UML 1.3 (we're at version 2.2 at the moment), the core critique of the article still stands: as in UML 1.3, use-cases still have "extension points" ("An extension point identifies a point in the behavior of a use case where that behavior can be extended by the behavior of some other (extending) use case, as specified by an extend relationship." - UML 2.2 Superstructure, sect. 16.3.4), which were introduced in UML 1.1.

Then there is the case of error handling. The UML 2.2 Superstructure standard says this in section 16.3.6: "A UseCase is a kind of behaviored classifier that represents a declaration of an offered behavior. Each use case specifies some behavior, possibly including variants, that the subject can perform in collaboration with one or more actors. Use cases define the offered behavior of the subject without reference to its internal structure. These behaviors, involving interactions between the actor and the subject, may result in changes to the state of the subject and communications with its environment. A use case can include possible variations of its basic behavior, including exceptional behavior and error handling." However, as noted by mr Simons: "When an exception is raised, control never returns to the point of call, but may return to the end of the failed transaction after the exception has been processed, or not at all."

Similarly, use-cases do nor support "alternate endings", at least not in their current form. However, they can return a value, as stated by the current UML standard: "The including use case may only depend on the result (value) of the included use case. This value is obtained as a result of the execution of the included use case". So, if we take the UML standard as a guideline and look a bit at the (somewhat contentious) history of use-cases, we come to the conclusion that use-cases are types (UML classifiers) of which instances are executed and render a result value. Are they functors?

We will leave this question open for the moment, and see how the prose that describes the use-cases is best written.



## How to write effective use-cases


Actors have goals, stakeholders have interests. Use-cases talk about actors, not about stakeholders. If you start by establishing what the goals of your actors are (that is before you start thinking about how they might achieve those goals) and listing those goals, you've taken your first steps. Make sure you are sufficiently, but not overly, precise when defining your goals. I'll quote Ellen Gottesdiener again:


<blockquote>

> 
> 

>   * Name your [goals] using this format: verb + [qualified] object.
> 

>   * Use active (not passive) verbs.
> 

>   * Avoid vague verbs such as do or process.
> 

>   * Avoid low-level, database-oriented verbs such as create, read,
update, delete [...], get, or
insert.
> 

>   * The "object" part of the use-case name can be a noun (such as
inventory) or a qualified noun (such as in-stock inventory).
> 

>   * Make sure that the project Glossary defines each object in the usecase
name.
> 

>   * Add each object to the domain model (as a class, entity, or
attribute).
> 

</blockquote>



Ellen Gottesdiener also provides a nice list of verbs that can be used to effectively identify use-cases (goals):


<blockquote>
<table >

Example Verbs to Use in Use-Case Names

<tbody >
<tr >Informative Use CasesPerformative Use Cases
<tr >

> <td >
Analyze  

Discover  

Find  

Identify  

Inform  

Monitor  

Notify  

Query  

Request  

Search  

Select  

State  

View
> </td>
> <td >Achieve  

Allow  

Arrange  

Change  

Classify  

Define  

Deliver  

Design  

Ensure  

Establish  

Evaluate  

Issue  

Make  

Perform  

Provide  

Replenish  

Request  

Set up  

Specify
> </td></tr></tbody></table>
</blockquote>



Once you've done that, you'll have to decide which of those goals you will actually want the actors to reach. That's where the stakeholder's interests come in and that's also when you can start thinking about which actors should be able to reach which goals. Remember that there may be goals that no-one should be able to reach. For example: an actor may want to access your bank account to withdraw all of your money without leaving a trace (other than your money being gone). That is something you might not want that actor to be able to do.

As use-cases describe the acts and intentions of external actors of the system, there may be conditions in which the use-case can, or cannot, be executed. Once the goals and the actors have been established, it is time to take a look at the state of the system and its environment. We are, at this point, moving out of the domain of capturing requirements into the domain of design, but we will have to go back and forth between these two domains from time to time to elucidate two things: what is required to support out use-cases? And what restrictions on such support is acceptable? Of course, this means that requirements engineering, which is our subject matter here, cannot be a stand-alone activity: some interaction with the stakeholders (who are the ones that ultimately defined the requirements) and the analysts/developers is necessary.

As mentioned earlier, error handling is an issue when defining use-cases. But before you can even conceive of error handling, you must first define what an error is. In contract theory, an error is an inability (either due to logic or due to run-time constraints) to establish a post-condition. In use-cases, these post-conditions are usually called guarantees, so before examining what to do when an error occurs, you have to examine what guarantees the execution of your use-case should give (what post-conditions the execution of your use-case should establish). These guarantees depend on the interests of the stakeholder and may be contrary to the goals of the actor. For example, if Evil Eve wants to break into an account, the Login use-case should deny her access, guaranteeing that access is only granted if the user presents both a valid username and a valid password, in a valid combination of the two. Though contrary to the goal of Eve, who would like to enter, say, Alice's account without knowing her password, the guarantee that the system needs to give is that she can't get into the account without knowing Alice's password. If the system is presented with a faulty set of credentials, it should be clear, from the captured requirements, what the user should be presented with. For example, Eve should probably not be presented with the correct password if she entered a faulty one (e.g.: "wrong password: 'my secret' - expected 'another secret'" is probably not the best kind of error message).

Your first iterations will give you what is commonly called the "main success scenario". Alternate endings, alternate routes to the same (or different) endings, conditional sub-use-cases, etc. will appear in subsequent iterations of the same process, in which the use-cases and the captured requirements will tend to become more complex. To counter this tendency, complex use-cases can be split (in which case a "super" use-case can include the sub-use-cases) and small use-cases can often be merged. Note, though, that use-cases are still intended only for capturing requirements: although, as stated above, there has been (and still is) some debate as to what a use-case is, use-cases are "neither forward nor backward engineerable" - i.e. you can't derive (or generate) code from a use-case, and you can't derive use-cases from code.



## Conclusion


You'll have noted that I have left the question of what a use-case really is a bit open. Personally, I conceive of use-cases as a succinct way to capture functional requirements, and user stories as a way to put those requirements into prose. Use-cases and user-stories should be relatively easy to read and understand - whether they be presented in the form of a diagram or in the form of text. What should or should not go into a use-case, how they should be modeled and what the semantics of those models ought to be is open for debate. Let us stick, therefore, to the greatest common denominator when it comes to defining use-cases and let's try to make the as concise and understandable as possible, all the while remaining convinced that they cannot be the only way to document the requirements and design of our project.
