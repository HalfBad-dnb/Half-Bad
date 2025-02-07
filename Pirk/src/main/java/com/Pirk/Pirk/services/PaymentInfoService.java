package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;
    private final OrderServiceInterface orderService;
    private static final Logger logger = LoggerFactory.getLogger(PaymentInfoService.class);

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository, OrderServiceInterface orderService) {
        this.paymentInfoRepository = paymentInfoRepository;
        this.orderService = orderService;
    }

    public Optional<PaymentInfo> getPaymentInfo(Long id) {
        return paymentInfoRepository.findById(id);
    }

    public List<PaymentInfo> getAllPaymentInfo() {
        return paymentInfoRepository.findAll();
    }

    public Optional<PaymentInfo> getPaymentInfoById(Long id) {
        return paymentInfoRepository.findById(id);
    }

    public List<PaymentInfo> getPaymentInfoByOrderId(Long orderId) {
        return paymentInfoRepository.findAll().stream()
                .filter(payment -> payment.getOrder().getId().equals(orderId))
                .collect(Collectors.toList());
    }

    public PaymentInfo processPayment(PaymentRequest request) {
        // Validate payment information
        validatePaymentRequest(request);

        // Get the order
        Order order = orderService.getOrderById(request.getOrderId());
        if (order == null) {
            throw new RuntimeException("Order not found: " + request.getOrderId());
        }

        // Create PaymentInfo with only non-sensitive data
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setCardholderName(request.getCardholderName());
        paymentInfo.setLastFourDigits(getLastFourDigits(request.getCardNumber()));
        paymentInfo.setOrder(order);
        paymentInfo.setBuyerId(request.getBuyerId());

        try {
            // Process payment with external payment gateway (simulated)
            boolean paymentSuccessful = processPaymentWithGateway(request);
            
            if (paymentSuccessful) {
                paymentInfo.setPaymentStatus("COMPLETED");
                // Update order status to PAID after successful payment
                orderService.updateOrderStatus(request.getOrderId(), "PAID");
            } else {
                paymentInfo.setPaymentStatus("FAILED");
                throw new PaymentDeclinedException("Payment was declined");
            }

            return paymentInfoRepository.save(paymentInfo);
        } catch (Exception e) {
            paymentInfo.setPaymentStatus("FAILED");
            paymentInfoRepository.save(paymentInfo);
            throw e;
        }
    }

    private void validatePaymentRequest(PaymentRequest request) {
        if (request.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (request.getCardNumber() == null || request.getCardNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Card number is required");
        }
        if (request.getExpirationDate() == null || request.getExpirationDate().trim().isEmpty()) {
            throw new IllegalArgumentException("Expiration date is required");
        }
        if (request.getCvv() == null || request.getCvv().trim().isEmpty()) {
            throw new IllegalArgumentException("CVV is required");
        }
        if (request.getCardholderName() == null || request.getCardholderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Cardholder name is required");
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
    }

    private String getLastFourDigits(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return null;
        }
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
        // Simulate payment processing with a payment gateway
        // In a real application, this would integrate with a payment processor
        
        // For testing purposes:
        // - Cards ending in even numbers are approved
        // - Cards ending in odd numbers are declined
        String lastDigit = request.getCardNumber().substring(request.getCardNumber().length() - 1);
        int digit = Integer.parseInt(lastDigit);
        
        // Log payment attempt
        logger.info("Processing payment for card ending in {}", lastDigit);
        boolean isApproved = digit % 2 == 0;
        logger.info("Payment {} for card ending in {}", isApproved ? "approved" : "declined", lastDigit);
        
        return isApproved;
    }

    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}
