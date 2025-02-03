package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.CheckoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CheckoutService {

    @Autowired
    private CheckoutRepository checkoutRepository;

    /**
     * Create a new Checkout for a user with cart details, payment method, and shipping address.
     *
     * @param user            the user making the checkout
     * @param cart            the cart details for the checkout
     * @param paymentMethod   the payment method chosen
     * @param shippingAddress the shipping address for the checkout
     * @return the created Checkout object saved in the database
     */
    public Checkout createCheckout(User user, Cart cart, String paymentMethod, String shippingAddress) {
        // Calculate total amount from cart (assuming getTotalPrice() returns a double or float)
        BigDecimal totalAmount = BigDecimal.valueOf(cart.getTotalPrice());

        // Create a new Checkout object and set its details
        Checkout checkout = new Checkout();
        checkout.setUser(user);
        checkout.setCart(cart);
        checkout.setTotalAmount(totalAmount.doubleValue());  // Ensure it's stored as a double if needed
        checkout.setPaymentMethod(paymentMethod);
        checkout.setShippingAddress(shippingAddress);
        checkout.setOrderStatus("Pending");  // Customize this as needed
        checkout.setPaymentStatus("Pending");

        // Save the checkout object to the database using the repository
        return checkoutRepository.save(checkout);
    }

    /**
     * Get Checkout by its ID.
     *
     * @param checkoutId the ID of the checkout to retrieve
     * @return the Checkout object if found, otherwise null
     */
    public Checkout getCheckoutById(Long checkoutId) {
        Optional<Checkout> checkout = checkoutRepository.findById(checkoutId);
        return checkout.orElse(null); // Return the Checkout if found, otherwise null
    }

    /**
     * Update the checkout status based on the provided checkoutId.
     *
     * @param checkoutId the ID of the checkout to update
     * @param status     the new status to update
     * @return the updated Checkout object
     */
    public Checkout updateCheckoutStatus(Long checkoutId, String status) {
        Checkout checkout = getCheckoutById(checkoutId);
        if (checkout != null) {
            checkout.setOrderStatus(status);
            return checkoutRepository.save(checkout);  // Save the updated checkout
        }
        return null; // Return null if checkout is not found
    }
}
