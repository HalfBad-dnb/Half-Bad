package com.Pirk.Pirk.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.PrintWriter;
import java.io.StringWriter;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle UserNotFoundException specifically
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        // Log the error (Optional)
        // logger.error("User not found: {}", ex.getMessage(), ex);
        
        // Create error response
        ErrorResponse errorResponse = new ErrorResponse("USER_NOT_FOUND", ex.getMessage(), getStackTrace(ex));
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Handle any other general exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        // Log the error (Optional)
        // logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        
        // Create error response
        ErrorResponse errorResponse = new ErrorResponse("INTERNAL_SERVER_ERROR", "Something went wrong!", getStackTrace(ex));
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Utility method to capture the stack trace of the exception
    private String getStackTrace(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        return sw.toString();
    }

    // Define an ErrorResponse class to structure the error data
    public static class ErrorResponse {
        private String errorCode;
        private String message;
        private String stackTrace;

        public ErrorResponse(String errorCode, String message, String stackTrace) {
            this.errorCode = errorCode;
            this.message = message;
            this.stackTrace = stackTrace;
        }

        // Getters and setters
        public String getErrorCode() {
            return errorCode;
        }

        public void setErrorCode(String errorCode) {
            this.errorCode = errorCode;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getStackTrace() {
            return stackTrace;
        }

        public void setStackTrace(String stackTrace) {
            this.stackTrace = stackTrace;
        }
    }
}
