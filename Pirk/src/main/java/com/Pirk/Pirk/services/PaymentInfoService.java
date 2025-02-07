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

    // Changed visibility to protected for testing purposes
    protected boolean simulatePaymentProcessing(String cardNumber) {
        // Simulated logic for payment processing
        return cardNumber.endsWith("2"); // Example logic: Payment approved if card ends in "2"
    }

    // Method to process the payment
    public PaymentInfo processPayment(PaymentRequest paymentRequest) {
        boolean paymentSuccess = simulatePaymentProcessing(paymentRequest.getCardNumber());
        if (!paymentSuccess) {
            throw new PaymentDeclinedException("Payment was declined. Please check your card details and try again.");
        }

        // Create PaymentInfo and set all necessary fields
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setPaymentStatus("COMPLETED");
        paymentInfo.setCardholderName(paymentRequest.getCardHolderName());
        paymentInfo.setLastFourDigits(paymentRequest.getCardNumber().substring(paymentRequest.getCardNumber().length() - 4));
        paymentInfo.setOrderId(paymentRequest.getOrderId());
        return paymentInfoRepository.save(paymentInfo);
    }

    // Get payment info by order ID
    public List<PaymentInfo> getPaymentInfoByOrderId(Long orderId) {
        return paymentInfoRepository.findByOrderId(orderId);
    }

    // Get payment info by ID
    public Optional<PaymentInfo> getPaymentInfo(Long id) {
        return paymentInfoRepository.findById(id);
    }

    // Delete payment info
    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}