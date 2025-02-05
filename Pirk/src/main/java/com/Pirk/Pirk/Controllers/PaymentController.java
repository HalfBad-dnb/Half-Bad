package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.services.PaymentInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentInfoService paymentInfoService;

    public PaymentController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    @PostMapping
    public ResponseEntity<PaymentInfo> processPayment(@RequestBody PaymentInfo paymentInfo) {
        return ResponseEntity.ok(paymentInfoService.processPayment(paymentInfo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentInfo> getPaymentInfo(@PathVariable Long id) {
        return paymentInfoService.getPaymentInfo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentInfo> updatePaymentInfo(
            @PathVariable Long id,
            @RequestBody PaymentInfo paymentInfo) {
        return ResponseEntity.ok(paymentInfoService.updatePaymentInfo(id, paymentInfo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentInfo(@PathVariable Long id) {
        paymentInfoService.deletePaymentInfo(id);
        return ResponseEntity.ok().build();
    }
}
