package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.models.ErrorResponse;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.ShippingInfo;
import com.Pirk.Pirk.services.CheckoutService;
import com.Pirk.Pirk.services.OrderService;
import com.Pirk.Pirk.services.PaymentInfoService;
import com.Pirk.Pirk.models.PaymentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

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
            
            // Set the order ID in the payment request
            request.setOrderId(id);
            
            // Process the payment
            PaymentInfo processedPayment = paymentInfoService.processPayment(request);
            
            // Update checkout with payment info
            checkout.setPaymentInfo(processedPayment);
            checkout.setPaymentStatus("PAID");
            checkout = checkoutService.updateCheckout(checkout);
            
            // Create order from checkout
            Order order = new Order();
            order.setUsername(checkout.getUser().getUsername());
            order.setUserId(checkout.getUser().getId());
            
            // Set cart items with proper copying
            if (checkout.getCart() != null && checkout.getCart().getCartItems() != null) {
                order.setCartItems(new ArrayList<>(checkout.getCart().getCartItems()));
            } else {
                throw new IllegalStateException("Cart or cart items cannot be null");
            }
            
            // Create ShippingInfo object from shipping address
            ShippingInfo shippingInfo = new ShippingInfo();
            shippingInfo.setAddress(checkout.getShippingAddress());
            order.setShippingInfo(shippingInfo);
            
            order.setPaymentInfo(checkout.getPaymentInfo());
            order.setTotalAmount(checkout.getTotalAmount());
            
            // Save the order
            Order savedOrder = orderService.createOrder(order);
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to process payment: " + e.getMessage()));
        }
    }
}
