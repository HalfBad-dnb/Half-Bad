package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.services.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
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
}
