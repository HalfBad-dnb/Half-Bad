package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.services.PaymentInfoService;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.models.ErrorResponse;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
            PaymentInfo processedPayment = paymentInfoService.processPayment(request);
            return ResponseEntity.ok()
                .body(Map.of(
                    "status", "success",
                    "message", "Payment processed successfully",
                    "paymentInfo", processedPayment
                ));
        } catch (PaymentDeclinedException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(new ErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid payment details: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentInfo(@PathVariable Long id) {
        try {
            return paymentInfoService.getPaymentInfo(id)
                    .map(paymentInfo -> ResponseEntity.ok().body(Map.of(
                            "status", "success",
                            "paymentInfo", paymentInfo
                    )))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of(
                                "status", "error",
                                "message", "Payment not found"
                            )));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "message", "An unexpected error occurred: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentInfoByOrderId(@PathVariable Long orderId) {
        try {
            List<PaymentInfo> payments = paymentInfoService.getPaymentInfoByOrderId(orderId);
            if (payments.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("No payments found for order ID: " + orderId));
            }
            return ResponseEntity.ok()
                    .body(Map.of(
                        "status", "success",
                        "payments", payments
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentInfo(@PathVariable Long id) {
        try {
            if (!paymentInfoService.getPaymentInfo(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Payment not found"));
            }
            paymentInfoService.deletePaymentInfo(id);
            return ResponseEntity.ok()
                    .body(Map.of(
                        "status", "success",
                        "message", "Payment info deleted successfully"
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to delete payment info: " + e.getMessage()));
        }
    }
}
