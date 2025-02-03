package com.Pirk.Pirk.exceptions;

import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticationException extends AuthenticationException {

    private static final long serialVersionUID = 1L;

	// Constructor for custom message
    public CustomAuthenticationException(String msg) {
        super(msg);
    }

    // Constructor for custom message and cause
    public CustomAuthenticationException(String msg, Throwable t) {
        super(msg, t);
    }
}
