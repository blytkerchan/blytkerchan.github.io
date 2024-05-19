When writing firmware and device drivers, it is useful, sometimes, to have human-readable integer values - i.e. integer values that, when you read them in a debugger, mean something distinctive.<!--more--> This is different from using integers that have a distinctive bit pattern so you can read them on a scope (ex. 0xABABABAB, which is 10101011 repeated four times). So, when generating a new magic number, I usually use od, like this

    $ echo -n {FOUR-LETTER-WORD} | od -t x1
    0000000 50 4f 4e 59
    0000004

which would render the magic number 0x504f4e59UL.

Writing this in a piece of documentation often has the effect that the programmer who reads the documentation find his imagination taking off: how many four-letter words does he know? What does 0x504f4e59UL mean? Is it R-rated or X-rated?

Actually, it's G-rated, as all magic numbers, and all technical documentation, should be. Try it to figure it out, you'll see.

If you can't figure it out, leave a comment and I'll tell you.