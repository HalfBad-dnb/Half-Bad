package com.Pirk.Pirk.services;

import com.Pirk.Pirk.repositories.NewsletterRepository;
import com.Pirk.Pirk.models.Newsletter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;

    public boolean subscribeUser(String email) {
        if (newsletterRepository.existsByEmail(email)) {
            return false; // User already subscribed
        }
        // Create a new Newsletter instance using the constructor that accepts only email
        Newsletter newsletter = new Newsletter(email);
        newsletterRepository.save(newsletter);
        return true;
    }

    public Optional<Newsletter> getSubscription(String email) {
        return newsletterRepository.findByEmail(email);
    }

    public boolean unsubscribeUser(String email) {
        Optional<Newsletter> newsletter = newsletterRepository.findByEmail(email);
        if (newsletter.isPresent()) {
            newsletterRepository.delete(newsletter.get());
            return true; // Successfully unsubscribed
        }
        return false; // Email not found in the subscription list
    }
}
