package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Newsletter;
import com.Pirk.Pirk.repositories.NewsletterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterRepository newsletterRepository;

    public NewsletterController(NewsletterRepository newsletterRepository) {
        this.newsletterRepository = newsletterRepository;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Newsletter> subscribe(@RequestBody Newsletter newsletter) {
        if (newsletterRepository.findByEmail(newsletter.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(newsletterRepository.save(newsletter));
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestParam String email) {
        newsletterRepository.findByEmail(email).ifPresent(newsletterRepository::delete);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> checkSubscriptionStatus(@RequestParam String email) {
        return ResponseEntity.ok(newsletterRepository.findByEmail(email).isPresent());
    }
}
