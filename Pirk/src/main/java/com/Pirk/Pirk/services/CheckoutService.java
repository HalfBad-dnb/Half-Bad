package com.Pirk.Pirk.services;


import com.Pirk.Pirk.models.Checkout;

import com.Pirk.Pirk.repositories.CheckoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {

    private final CheckoutRepository checkoutRepository;

    @Autowired
    public CheckoutService(CheckoutRepository checkoutRepository) {
        this.checkoutRepository = checkoutRepository;
    }

    public Checkout createCheckout(Checkout checkout) {
        // Validate checkout object
        if (checkout == null) {
            throw new IllegalArgumentException("Checkout cannot be null");
        }
        
        // Set any default values if needed
        if (checkout.getOrderStatus() == null) {
            checkout.setOrderStatus("Pending");
        }
        if (checkout.getPaymentStatus() == null) {
            checkout.setPaymentStatus("Pending");
        }
        
        return checkoutRepository.save(checkout);
    }

    public Checkout getCheckoutById(Long id) {
        return checkoutRepository.findById(id).orElse(null);
    }

    public Checkout updateCheckoutStatus(Long id, String status) {
        Checkout checkout = getCheckoutById(id);
        if (checkout == null) {
            return null;
        }
        
        checkout.setOrderStatus(status);
        return checkoutRepository.save(checkout);
    }
}
