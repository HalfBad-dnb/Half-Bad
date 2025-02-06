package com.Pirk.Pirk.exceptions;

public class CardProcessingException extends RuntimeException {

    public CardProcessingException(String message) {
        super(message);
    }

    public CardProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}
