package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
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

    public PaymentInfo processPayment(PaymentRequest request) {
        // Validate payment information
        validatePaymentRequest(request);

        // Create PaymentInfo with only non-sensitive data
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setCardholderName(request.getCardholderName());
        paymentInfo.setLastFourDigits(getLastFourDigits(request.getCardNumber()));
        paymentInfo.setOrderId(request.getOrderId());
        paymentInfo.setBuyerId(request.getBuyerId());

        try {
            // Process payment with external payment gateway (simulated)
            boolean paymentSuccessful = processPaymentWithGateway(request);
            
            if (paymentSuccessful) {
                paymentInfo.setPaymentStatus("COMPLETED");
                return paymentInfoRepository.save(paymentInfo);
            } else {
                paymentInfo.setPaymentStatus("FAILED");
                paymentInfoRepository.save(paymentInfo);
                throw new PaymentDeclinedException("Payment declined by gateway");
            }
        } catch (PaymentDeclinedException e) {
            // Re-throw payment declined exceptions
            throw e;
        } catch (Exception e) {
            // If we get here, it means there was an unexpected error, not a declined payment
            throw new RuntimeException("Error processing payment: " + e.getMessage());
        }
    }

    private void validatePaymentRequest(PaymentRequest request) {
        if (request.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (request.getCardNumber() == null || !request.getCardNumber().matches("\\d{16}")) {
            throw new IllegalArgumentException("Invalid card number");
        }
        if (request.getCvv() == null || !request.getCvv().matches("\\d{3,4}")) {
            throw new IllegalArgumentException("Invalid CVV");
        }
        if (request.getExpirationDate() == null || !isExpirationDateValid(request.getExpirationDate())) {
            throw new IllegalArgumentException("Invalid expiration date");
        }
        if (request.getCardholderName() == null || request.getCardholderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Cardholder name is required");
        }
    }

    private String getLastFourDigits(String cardNumber) {
        return cardNumber.substring(cardNumber.length() - 4);
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

    private boolean processPaymentWithGateway(PaymentRequest request) {
        // In a real application, this would integrate with a payment gateway
        // For testing purposes:
        // - Approve payments with test card number 4111111111111111
        // - Decline payments with test card number 4111111111111112
        // - For all other cards, approve the payment
        if (request.getCardNumber().equals("4111111111111111")) {
            return true;
        } else if (request.getCardNumber().equals("4111111111111112")) {
            return false;
        }
        return true;
    }

    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}
