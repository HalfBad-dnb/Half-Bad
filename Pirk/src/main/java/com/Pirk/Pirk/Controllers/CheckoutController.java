package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.models.ErrorResponse;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.models.ShippingInfo;
import com.Pirk.Pirk.services.CheckoutService;
import com.Pirk.Pirk.services.OrderService;
import com.Pirk.Pirk.services.PaymentInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final PaymentInfoService paymentInfoService;
    private final OrderService orderService;

    public CheckoutController(CheckoutService checkoutService, 
                            PaymentInfoService paymentInfoService,
                            OrderService orderService) {
        this.checkoutService = checkoutService;
        this.paymentInfoService = paymentInfoService;
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Checkout> createCheckout(@RequestBody Checkout checkout) {
        return ResponseEntity.ok(checkoutService.createCheckout(checkout));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkout> getCheckout(@PathVariable Long id) {
        return ResponseEntity.ok(checkoutService.getCheckoutById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Checkout> updateCheckoutStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(checkoutService.updateCheckoutStatus(id, status));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<?> processPayment(
            @PathVariable Long id,
            @RequestBody PaymentRequest request) {
        try {
            // Get the checkout
            Checkout checkout = checkoutService.getCheckoutById(id);
            if (checkout == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Checkout not found"));
            }

            // Set the buyer ID in the payment request
            request.setBuyerId(checkout.getUser().getId());
            
            // Create order first
            Order order = new Order();
            order.setUsername(checkout.getUser().getUsername());
            order.setUserId(checkout.getUser().getId());
            
            // Set cart items
            if (checkout.getCart() != null && checkout.getCart().getCartItems() != null) {
                order.setCartItems(new ArrayList<>(checkout.getCart().getCartItems()));
            } else {
                throw new IllegalStateException("Cart or cart items cannot be null");
            }
            
            // Create shipping info from shipping address
            ShippingInfo shippingInfo = ShippingInfo.builder()
                .recipientName(checkout.getUser().getFirstName() + " " + checkout.getUser().getLastName())
                .streetAddress(checkout.getShippingAddress().getStreetAddress())
                .city(checkout.getShippingAddress().getCity())
                .state(checkout.getShippingAddress().getState())
                .postalCode(checkout.getShippingAddress().getPostalCode())
                .country(checkout.getShippingAddress().getCountry())
                .phoneNumber(checkout.getShippingAddress().getPhoneNumber())
                .build();
            order.setShippingInfo(shippingInfo);
            
            order.setTotalAmount(BigDecimal.valueOf(checkout.getTotalAmount()));
            
            // Save the order first
            Order savedOrder = orderService.createOrder(order);
            
            // Process the payment
            PaymentInfo processedPayment = paymentInfoService.processPayment(request);
            
            // Update order with payment info
            savedOrder.setPaymentInfo(processedPayment);
            orderService.updateOrder(savedOrder);
            
            // Update checkout status
            checkout.setPaymentStatus("PAID");
            checkoutService.updateCheckout(checkout);
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to process payment: " + e.getMessage()));
        }
    }
}
