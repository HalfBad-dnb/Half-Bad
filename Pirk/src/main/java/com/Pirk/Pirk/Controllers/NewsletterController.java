package com.Pirk.Pirk.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Pirk.Pirk.models.Newsletter;
import com.Pirk.Pirk.repositories.NewsletterRepository;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsletterController {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody Newsletter subscription) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Check if email already exists
            if (newsletterRepository.existsByEmail(subscription.getEmail())) {
                response.put("message", "This email is already subscribed!");
                return ResponseEntity.badRequest().body(response);
            }

            // Save new subscription
            newsletterRepository.save(subscription);
            response.put("message", "Successfully subscribed to the newsletter!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to subscribe: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
