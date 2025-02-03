package com.Pirk.Pirk.exceptions;

public class UserNotFoundException extends RuntimeException {

    // Declare a static final serialVersionUID
    private static final long serialVersionUID = 1L;

    public UserNotFoundException(String message) {
        super(message);
    }
}
