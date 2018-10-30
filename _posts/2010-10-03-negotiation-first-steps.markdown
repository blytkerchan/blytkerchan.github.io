---
author: rlc
comments: true
date: 2010-10-03 03:46:00+00:00
layout: post
permalink: /blog/2010/10/negotiation-first-steps/
slug: negotiation-first-steps
title: 'Negotiation: first steps'
wordpress_id: 970
categories:
- C++ for the self-taught
tags:
- Posts that need to be re-tagged (WIP)
---

[donate]

As discussed [last month](/blog/2010/09/opacity-encapsulation-at-its-best-and-worst), the requirement for encapsulation pushes us towards allowing the user to know that there's a negotiation between the two peers, and does not alleviate the requirement that the user understand the errors. So in this installment, we will start using the new implementation of exceptions we worked out in the previous installment, and start on the negotiation mechanism from two installments ago.
<!--more-->
The new `Negotiation` class will have to carry everything needed during a negotiation - such as the context handle, a buffer to store the token data in, etc. and will have to be passed to the `Mechanism` to be worked on. That means that anything that may need to be passed to the `InitializeSecurityContext` SSPI function will need to be in there. The class itself doesn't really matter much, then, as long as it takes care of the resources of anything it carries around. The code of the new class can, of course, be found in the Git repository

The interesting bits for this installment are in the following code: 
    
    /*virtual */std::auto_ptr< Security::Context > Mechanism::getContext(
    	Security::Details::Negotiation & _negotiation,
    	RFC1961::Token *& token,
    	Security::Credentials & credentials,
    	const std::string & resource_name)/* = 0*/
    {
    	std::auto_ptr< Security::Context > retval;
    	Details::Negotiation &negotiation;(dynamic_cast< Details::Negotiation& >(_negotiation));
    	Credentials & credentials_(dynamic_cast< Credentials& >(credentials)); // note: throws if the wrong type is given
    	SecBuffer in_security_buffer;
    	in_security_buffer.cbBuffer = token ? token->len_ : 0;
    	in_security_buffer.pvBuffer = token ? token->token_ : 0;
    	in_security_buffer.BufferType = SECBUFFER_TOKEN;
    	SecBufferDesc in_security_buffer_descriptor;
    	in_security_buffer_descriptor.ulVersion = SECBUFFER_VERSION;
    	in_security_buffer_descriptor.cBuffers = token ? 1 : 0;
    	in_security_buffer_descriptor.pBuffers = &in;_security_buffer;
    	SecBuffer out_security_buffer;
    	out_security_buffer.cbBuffer = negotiation.token_buffer_.size();
    	out_security_buffer.pvBuffer = &(negotiation.token_buffer_[0]);
    	out_security_buffer.BufferType = SECBUFFER_TOKEN;
    	SecBufferDesc out_security_buffer_descriptor;
    	out_security_buffer_descriptor.ulVersion = SECBUFFER_VERSION;
    	out_security_buffer_descriptor.cBuffers = 1;
    	out_security_buffer_descriptor.pBuffers = &out;_security_buffer;
    	SECURITY_STATUS status(InitializeSecurityContext(
    		credentials_.getHandle(),										// handle to the credentials. Should have at least OUTBOUND
    		negotiation.step_ == 0 ? 0 : &negotiation.context;_handle_,		// handle to the partial context - this is the first call, so we don't have one yet
    		const_cast< SEC_CHAR* >(resource_name.c_str()),					// resource (target) name we want the context for
    		ISC_REQ_CONFIDENTIALITY/*TODO: add other flags*/,				// flags
    		0,																// reserved
    		SECURITY_NETWORK_DREP /* zero */,								// some SSPs require zero, and network-drep is zero, so we'll take that in all cases
    		negotiation.step_ == 0 ? 0 : &in;_security_buffer_descriptor,	// server response - don't have one yet
    		0,																// reserved
    		&negotiation.context;_handle_,									// new context
    		&out;_security_buffer_descriptor,								// security token
    		&negotiation.context;_attributes_,								// new context attributes
    		&negotiation.expiry;_));											// context expiration
    	if (status == SEC_I_COMPLETE_AND_CONTINUE ||
    		status == SEC_I_COMPLETE_NEEDED)
    	{
    		negotiation.context_handle_valid_ = true;
    		// in both of these cases, we need to complete the token
    		SECURITY_STATUS complete_status = CompleteAuthToken(&negotiation.context;_handle_, &out;_security_buffer_descriptor);
    		if (!SUCCEEDED(complete_status))
    		{
    			//TODO have the complete_status ride along with the exception
    			throw AuthenticationError("Failed to complete authentication token");
    		}
    		else
    		{ /* all is well */ }
    	}
    	else
    	{ /* don't need to complete */ }
    	switch (status)
    	{
    	case SEC_I_INCOMPLETE_CREDENTIALS :
    		/* Use with Schannel. The server has requested client authentication,
    		 * and the supplied credentials either do not include a certificate
    		 * or the certificate was not issued by a certification authority
    		 * that is trusted by the server. */
    		// this is an error that the client code may or may not be able to
    		// recover from. In any case, it is not a "normal" situation in that
    		// the configuration is probably incomplete, so we make it an exception.
    		negotiation.context_handle_valid_ = true;
    		throw IncompleteCredentials("The server has requested client authentication, and the supplied credentials either do not include a certificate or the certificate was not issued by a certification authority that is trusted by the server.");
    	case SEC_I_COMPLETE_AND_CONTINUE :
    		/* The client must call CompleteAuthToken and then pass the output
    		 * to the server. The client then waits for a returned token and
    		 * passes it, in another call, to InitializeSecurityContext. */
    		// complete already done above - fall through
    	case SEC_I_CONTINUE_NEEDED :
    		/* The client must send the output token to the server and wait for
    		 * a return token. The returned token is then passed in another call
    		 * to InitializeSecurityContext (General). The output token can be
    		 * empty. */
    		++negotiation.step_;
    		// don't touch retval - we're not done yet
    
    		// if token pointed to anything, we will assume the resources of that
    		// thing will be handled by the owner. There is no way of knowing,
    		// otherwise, how to get rid of it ourselves. In any case, we now
    		// have a token to pass back to the user, so we replace the pointer
    		// (to which we have a reference) with a new one, of our own making.
    		negotiation.context_handle_valid_ = true;
    		token = makeToken(&out;_security_buffer_descriptor);
    		break;
    	case SEC_E_INCOMPLETE_MESSAGE :
    		/* Use with Schannel. Data for the whole message was not read from
    		 * the wire.
    		 *
    		 * When this value is returned, the pInput buffer contains a SecBuffer
    		 * structure with a BufferType member of SECBUFFER_MISSING. The cbBuffer
    		 * member of SecBuffer contains a value that indicates the number of
    		 * additional bytes that the function must read from the client before
    		 * this function succeeds. While this number is not always accurate,
    		 * using it can help improve performance by avoiding multiple calls to
    		 * this function. */
    		// note that we don't have any way to communicate the information provided
    		// to us in the input token to the user, so we will simply ignore it.
    		throw IncompleteMessage("SChannel: data should be available on the wire");
    	case SEC_I_COMPLETE_NEEDED :
    		/* The client must finish building the message and then call the
    		 * CompleteAuthToken function. */
    		// this will have been done above
    		// fall through
    	case SEC_E_OK :
    	{
    		/* The security context was successfully initialized. There is no need
    		 * for another InitializeSecurityContext (General) call. If the function
    		 * returns an output token, that is, if the SECBUFFER_TOKEN in pOutput
    		 * is of nonzero length, that token must be sent to the server. */
    		negotiation.context_handle_valid_ = true;
    		if (out_security_buffer_descriptor.cBuffers != 0)
    		{
    			token = makeToken(&out;_security_buffer_descriptor);
    		}
    		else
    		{ /* no token to make */ }
    		retval.reset(new Context(negotiation.context_handle_));
    		negotiation.context_handle_valid_ = false;
    	}
    	//////////////////////////////////////////////////////////////////////////
    	// errors start here
    	//////////////////////////////////////////////////////////////////////////
    	case SEC_E_INSUFFICIENT_MEMORY :
    		/* There is not enough memory available to complete the requested action. */
    		throw std::bad_alloc();
    	case SEC_E_INTERNAL_ERROR :
    		/* An error occurred that did not map to an SSPI error code. */
    	case SEC_E_INVALID_HANDLE :
    		/* The handle passed to the function is not valid. */
    	case SEC_E_INVALID_TOKEN :
    		/* The error is due to a malformed input token, such as a token corrupted
    		 * in transit, a token of incorrect size, or a token passed into the
    		 * wrong security package. Passing a token to the wrong package can
    		 * happen if the client and server did not negotiate the proper security
    		 * package. */
    	case SEC_E_LOGON_DENIED :
    		/* The logon failed. */
    	case SEC_E_NO_AUTHENTICATING_AUTHORITY :
    		/* No authority could be contacted for authentication. The domain name of
    		 * the authenticating party could be wrong, the domain could be unreachable,
    		 * or there might have been a trust relationship failure. */
    	case SEC_E_NO_CREDENTIALS :
    		/* No credentials are available in the security package. */
    	case SEC_E_TARGET_UNKNOWN :
    		/* The target was not recognized. */
    	case SEC_E_UNSUPPORTED_FUNCTION :
    		/* A context attribute flag that is not valid (ISC_REQ_DELEGATE or
    		 * ISC_REQ_PROMPT_FOR_CREDS) was specified in the fContextReq parameter. */
    	case SEC_E_WRONG_PRINCIPAL :
    		/* The principal that received the authentication request is not the same
    		 * as the one passed into the pszTargetName parameter. This indicates a
    		 * failure in mutual authentication. */
    break;
    	}
    	return retval;
    }
    

There's a few caveats you need to notice about this code. For one thing, notice the `dynamic_cast` on line 8. While many people will tell you not to use `dynamic_cast` in production code, because it is supposedly slow, it is only slow when it has a lot of work to do and, in this case, it only has a lot of work to do if it fails. Note that I cast to a reference, however, which means that `dynamic_cast` will throw an exception if it fails - which is exactly what I want: if the user didn't give me a proper `Negotiation` object, I don't want to carry on. Same thing for the credentials on line 9.

Lines 10 through 25 set up buffer descriptors are needed for the call to the SSPI API. Note that `out_security_buffer` points to a buffer in a vector in the `Negotiation` object. As this descriptor doesn't own the buffer (the `Negotiation` object does) and as it is copied into a new `Token` on lines 86 and 116, if need be, we can safely do this.

Another caveat to look for is when we throw exceptions: we find a draw-back in the implementation of our `Exception` class because it doesn't carry a payload. We'll have to fix that.

Everything that is thrown by this new code is declared as follows: 
    
    --- a/lib/security/Mechanism.h
    +++ b/lib/security/Mechanism.h
    @@ -5,6 +5,7 @@
     #include <memory>
     #include <string>
     #include "Details/Negotiation.h"
    +#include "../exceptions/Exception.h"
    
     namespace Vlinder { namespace Chausette { namespace RFC1961 { struct Token; }}}
     namespace Vlinder { namespace Chausette { namespace Security {
    @@ -13,6 +14,14 @@ namespace Vlinder { namespace Chausette { namespace Security {
            class VLINDER_CHAUSETTE_SECURITY_API Mechanism
            {
            public :
    +               enum Error {
    +                       authentication_error__,
    +                       incomplete_credentials__,
    +                       incomplete_message__,
    +               };
    +               typedef Vlinder::Exceptions::Exception< std::runtime_error, Error, authentication_error__ > AuthenticationError;
    +               typedef Vlinder::Exceptions::Exception< std::runtime_error, Error, incomplete_credentials__ > IncompleteCredentials;
    +               typedef Vlinder::Exceptions::Exception< std::runtime_error, Error, incomplete_message__ > IncompleteMessage;
                    virtual ~Mechanism() = 0;
    
                    virtual std::auto_ptr< Details::Negotiation > startNegotiation() = 0;



Finally, the `Negotiation` class looks like this: 
    
    namespace Vlinder { namespace Chausette { namespace SSPI { namespace Details {
    	struct Negotiation : Security::Details::Negotiation
    	{
    		Negotiation();
    		/*virtual */~Negotiation()/* = 0*/;
    
    		unsigned int step_;
    		CtxtHandle context_handle_;
    		bool context_handle_valid_;
    		std::vector< unsigned char > token_buffer_;
    		TimeStamp expiry_;
    		unsigned long context_attributes_;
    	};
    }}}}

which, as you can see, contains only things that need to be carried around. You should notice the `context_handle_valid_` flag, though, which tells the destructor whether or not it should destroy the context handle. In the `getContext` function, it is set on lines 42, 65, 85 and 113 - each time before an exception might be thrown - and cleared on line 121 - after which ownership is handed off to the `Context` class.



### In Conclusion


This installment has perhaps been a bit heavier on code than usual - and a bit lighter on the theoretical side - but if you comb through the code you will see that it applies a lot of what we've discussed before.

We'll get to sending data along with the exceptions in the next episode.
