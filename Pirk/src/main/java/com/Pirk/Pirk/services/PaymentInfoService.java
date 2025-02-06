package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public Optional<PaymentInfo> getPaymentInfo(Long id) {
        return paymentInfoRepository.findById(id);
    }

    public List<PaymentInfo> getAllPaymentInfo() {
        return paymentInfoRepository.findAll();
    }

    public PaymentInfo processPayment(PaymentInfo paymentInfo) {
        // Validate payment information
        validatePaymentInfo(paymentInfo);

        try {
            // Simulate payment processing
            boolean paymentSuccessful = processPaymentWithGateway(paymentInfo);
            
            if (paymentSuccessful) {
                paymentInfo.setPaymentStatus("COMPLETED");
            } else {
                paymentInfo.setPaymentStatus("FAILED");
                throw new RuntimeException("Payment processing failed");
            }

            return paymentInfoRepository.save(paymentInfo);
        } catch (Exception e) {
            paymentInfo.setPaymentStatus("FAILED");
            paymentInfoRepository.save(paymentInfo);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }

    private void validatePaymentInfo(PaymentInfo paymentInfo) {
        if (paymentInfo.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (paymentInfo.getCardNumber() == null || !paymentInfo.getCardNumber().matches("\\d{16}")) {
            throw new IllegalArgumentException("Invalid card number");
        }
        if (paymentInfo.getCvv() == null || !paymentInfo.getCvv().matches("\\d{3,4}")) {
            throw new IllegalArgumentException("Invalid CVV");
        }
        if (paymentInfo.getExpirationDate() == null || !isExpirationDateValid(paymentInfo.getExpirationDate())) {
            throw new IllegalArgumentException("Invalid expiration date");
        }
    }

    private boolean isExpirationDateValid(String expDate) {
        if (!expDate.matches("^(0[1-9]|1[0-2])/\\d{2}$")) {
            return false;
        }

        String[] parts = expDate.split("/");
        int month = Integer.parseInt(parts[0]);
        int year = Integer.parseInt(parts[1]) + 2000;

        java.time.YearMonth expiry = java.time.YearMonth.of(year, month);
        java.time.YearMonth now = java.time.YearMonth.now();

        return !expiry.isBefore(now);
    }

    private boolean processPaymentWithGateway(PaymentInfo paymentInfo) {
        // TODO: Integrate with a real payment gateway
        // For now, simulate payment processing with a 90% success rate
        return Math.random() < 0.9;
    }

    public PaymentInfo updatePaymentInfo(Long id, PaymentInfo paymentInfo) {
        PaymentInfo existingPaymentInfo = getPaymentInfo(id)
            .orElseThrow(() -> new RuntimeException("Payment info not found"));
        
        // Update the fields
        existingPaymentInfo.setCardNumber(paymentInfo.getCardNumber());
        existingPaymentInfo.setExpirationDate(paymentInfo.getExpirationDate());
        existingPaymentInfo.setCvv(paymentInfo.getCvv());
        
        return paymentInfoRepository.save(existingPaymentInfo);
    }

    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}
