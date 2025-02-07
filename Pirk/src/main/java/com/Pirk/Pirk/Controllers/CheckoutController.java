package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.*;
import com.Pirk.Pirk.services.CheckoutService;
import com.Pirk.Pirk.services.OrderService;
import com.Pirk.Pirk.services.PaymentInfoService;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.Map;

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
    public ResponseEntity<?> createCheckout(@RequestBody Checkout checkout) {
        try {
            Checkout createdCheckout = checkoutService.createCheckout(checkout);
            return ResponseEntity.ok()
                .body(Map.of(
                    "status", "success",
                    "message", "Checkout created successfully",
                    "checkout", createdCheckout
                ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid checkout data: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to create checkout: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCheckout(@PathVariable Long id) {
        try {
            Checkout checkout = checkoutService.getCheckoutById(id);
            if (checkout == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Checkout not found with ID: " + id));
            }
            return ResponseEntity.ok()
                .body(Map.of(
                    "status", "success",
                    "checkout", checkout
                ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to retrieve checkout: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCheckoutStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Checkout checkout = checkoutService.getCheckoutById(id);
            if (checkout == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Checkout not found with ID: " + id));
            }
            Checkout updatedCheckout = checkoutService.updateCheckoutStatus(id, status);
            return ResponseEntity.ok()
                .body(Map.of(
                    "status", "success",
                    "message", "Checkout status updated successfully",
                    "checkout", updatedCheckout
                ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid status: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to update checkout status: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<?> processPayment(
            @PathVariable Long id,
            @RequestBody PaymentRequest request) {
        try {
            // Get the checkout
            Checkout checkout = checkoutService.getCheckoutById(id);
            if (checkout == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Checkout not found with ID: " + id));
            }

            // Validate checkout state
            if (checkout.getCart() == null || checkout.getCart().getCartItems() == null || checkout.getCart().getCartItems().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Cart is empty"));
            }

            // Set the buyer ID in the payment request
            request.setBuyerId(checkout.getUser().getId());
            request.setOrderId(id); // Set checkout ID as order ID
            request.setAmount(checkout.getTotalAmount()); // Set amount from checkout
            
            // Create order
            Order order = new Order();
            order.setUsername(checkout.getUser().getUsername());
            order.setUserId(checkout.getUser().getId());
            order.setCartItems(new ArrayList<>(checkout.getCart().getCartItems()));
            
            // Create shipping info
            ShippingInfo shippingInfo = ShippingInfo.builder()
                .username(checkout.getUser().getFirstName() + " " + checkout.getUser().getLastName())
                .address(checkout.getShippingAddress().getStreetAddress())
                .city(checkout.getShippingAddress().getCity())
                .state(checkout.getShippingAddress().getState())
                .postalCode(checkout.getShippingAddress().getPostalCode())
                .country(checkout.getShippingAddress().getCountry())
                .phoneNumber(checkout.getShippingAddress().getPhoneNumber())
                .build();
            order.setShippingInfo(shippingInfo);
            order.setTotalAmount(checkout.getTotalAmount());
            
            // Save order
            Order savedOrder = orderService.createOrder(order);
            
            // Process payment
            PaymentInfo processedPayment = paymentInfoService.processPayment(request);
            
            // Update order with payment info
            savedOrder.setPaymentInfo(processedPayment);
            orderService.updateOrder(savedOrder);
            
            // Update checkout status
            checkout.setPaymentStatus("PAID");
            checkoutService.updateCheckout(checkout);
            
            return ResponseEntity.ok()
                .body(Map.of(
                    "status", "success",
                    "message", "Payment processed and order created successfully",
                    "order", savedOrder
                ));
        } catch (PaymentDeclinedException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(new ErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid payment details: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to process payment: " + e.getMessage()));
        }
    }
}
