In my [previous post](/blog/2012/12/how-to-design-a-struct-for-storage-or-networking/) on the subject, I talked about using magic numbers and versions, alignment, and later added a note about endianness after a suggestion from Michel Fortin. This time, I'll talk about padding, how the sizeof operator can be misleading and how to debug padding and alignment errors.

<!--more-->

A few days ago we were debugging the interface between some application code and one of my drivers. The driver implemented an I/O control which, before doing anything with the buffer passed to it, checked the sizes and output a trace if they didn't match the expected size:

    bool validateBufferSize(size_t expected_size, size_t actual_size, char const *fmt, ...)
    {
        if (expected_size != actual_size)
        { ... Output a message ... }
        return expected_size == actual_size;
    }

    ...

    if (validateBufferSize(sizeof(OutputType), output_buffer_size))
    { ... Do stuff ... }
    else
    { ... Return with error ...}

    ...

There is a problem with this approach: while everything inside my structure was properly aligned, the largest field in the structure was a 64-bit integer, which requires an alignment on 8 bytes. The structure, however, came to a total size of 444 bytes.

444 is not divisible by 8 (444 / 8 = 55.5) so when the compiler creates an array of instances of my structure, it adds 4 bytes of padding at the end of each instance, unless it is told not to. Unbeknownst to me, it was told not to, but rather to "pack" objects as chunks of four bytes. While this didn't screw up my alignment, it did screw up my `validateBufferSize` function in that it systematically returned an error.

If we don't learn from experience, we will make the same mistakes over and over ...

Hence, from now on, I intend to check that if my structures require _n_-byte alignment, they'll be a multiple of _n_ bytes in size. If you want to learn from _my_ experience, I suggest you do the same...