package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Confirmation;
import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.repositories.ConfirmationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ConfirmationService {

    @Autowired
    private ConfirmationRepository confirmationRepository;

    // Generate a confirmation code for a checkout
    public Confirmation createConfirmation(Checkout checkout) {
        Confirmation confirmation = new Confirmation();
        confirmation.setCheckout(checkout);
        confirmation.setConfirmationCode(UUID.randomUUID().toString());  // Generate a unique confirmation code
        confirmation.setConfirmed(false);  // Initially, it's not confirmed
        confirmation.setConfirmationTime(LocalDateTime.now());  // Set the confirmation time

        return confirmationRepository.save(confirmation);
    }

    // Mark confirmation as confirmed
    public Confirmation confirmOrder(String confirmationCode) {
        Confirmation confirmation = confirmationRepository.findByConfirmationCode(confirmationCode);
        Optional<Confirmation> optionalConfirmation = Optional.ofNullable(confirmation);

        if (optionalConfirmation.isPresent()) {
            confirmation = optionalConfirmation.get();
            confirmation.setConfirmed(true);  // Mark the order as confirmed
            confirmation.setConfirmationTime(LocalDateTime.now());  // Update confirmation time
            return confirmationRepository.save(confirmation);
        }

        return null;  // If confirmation code not found, return null
    }

    // Fetch confirmation by confirmation code
    public Optional<Confirmation> getConfirmationByCode(String confirmationCode) {
        return Optional.ofNullable(confirmationRepository.findByConfirmationCode(confirmationCode));
    }
}
