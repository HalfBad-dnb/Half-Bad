package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.services.PaymentInfoService;
import com.Pirk.Pirk.models.PaymentRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Pirk.Pirk.exceptions.CardProcessingException;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentInfoService paymentInfoService;

    public PaymentController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        try {
            // Process the payment using the PaymentRequest
            PaymentInfo processedPayment = paymentInfoService.processPayment(request);
            
            // Check payment status and return appropriate response
            if ("COMPLETED".equals(processedPayment.getPaymentStatus())) {
                return ResponseEntity.ok()
                    .body(Map.of(
                        "status", "success",
                        "message", "Payment processed successfully",
                        "paymentInfo", processedPayment
                    ));
            } else {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body(Map.of(
                        "status", "failed",
                        "message", "Payment processing failed. Please check your payment details.",
                        "paymentInfo", processedPayment
                    ));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "status", "error",
                    "message", "Invalid payment details: " + e.getMessage()
                ));
        } catch (CardProcessingException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(Map.of(
                    "status", "error",
                    "message", "Card processing error: " + e.getMessage()
                ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "An unexpected error occurred while processing the payment: " + e.getMessage()
                ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentInfo(@PathVariable Long id) {
        return paymentInfoService.getPaymentInfo(id)
                .map(paymentInfo -> ResponseEntity.ok().body(Map.of(
                        "status", "success",
                        "paymentInfo", paymentInfo
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "Payment info not found"
                        )));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePaymentInfo(@PathVariable Long id) {
        try {
            paymentInfoService.deletePaymentInfo(id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment info deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "Failed to delete payment info: " + e.getMessage()
                    ));
        }
    }
}
