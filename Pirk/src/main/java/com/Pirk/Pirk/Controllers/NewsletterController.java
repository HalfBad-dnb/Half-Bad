package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Newsletter;
import com.Pirk.Pirk.dto.NewsletterDTO;
import com.Pirk.Pirk.services.NewsletterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;
    private static final Logger logger = LoggerFactory.getLogger(NewsletterController.class);

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    // Subscribe a user to the newsletter
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody @Valid NewsletterDTO newsletterDTO) {
        // Ensure that the email is valid and not already subscribed
        boolean isSubscribed = newsletterService.subscribeUser(newsletterDTO.getEmail());
    
        Map<String, String> response = new HashMap<>();
    
        if (isSubscribed) {
            response.put("message", "Subscription successful!");
            logger.info("User subscribed: " + newsletterDTO.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
        } else {
            response.put("message", "Email already subscribed.");
            logger.warn("Subscription attempt failed: " + newsletterDTO.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409 Conflict
        }
    }

    // Unsubscribe a user from the newsletter
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody NewsletterDTO newsletterDTO) {
        boolean isUnsubscribed = newsletterService.unsubscribeUser(newsletterDTO.getEmail());

        Map<String, String> response = new HashMap<>();

        if (isUnsubscribed) {
            response.put("message", "Unsubscription successful.");
            logger.info("User unsubscribed: " + newsletterDTO.getEmail());
            return ResponseEntity.ok(response); // Returning JSON response with status OK (200)
        } else {
            response.put("message", "Email not found.");
            logger.warn("Unsubscription attempt failed: " + newsletterDTO.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // Returning JSON response with status NOT_FOUND (404)
        }
    }

    // Check if a user is subscribed
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkSubscriptionStatus(@RequestParam String email) {
        Optional<Newsletter> subscription = newsletterService.getSubscription(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isSubscribed", subscription.isPresent());

        return ResponseEntity.ok(response);
    }

    // Global error handling for exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "An error occurred: " + ex.getMessage());
        logger.error("An error occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
