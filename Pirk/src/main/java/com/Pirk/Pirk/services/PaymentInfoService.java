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

        // Create new payment info
        PaymentInfo paymentInfo = new PaymentInfo();
        
        // Set payment details
        paymentInfo.setCardholderName(request.getCardholderName());
        paymentInfo.setLastFourDigits(request.getCardNumber().substring(request.getCardNumber().length() - 4));
        paymentInfo.setBuyerId(request.getBuyerId());
        paymentInfo.setPaymentStatus("PENDING");
        
        // Simulate payment processing
        boolean isApproved = simulatePaymentProcessing(request.getCardNumber());
        
        if (!isApproved) {
            logger.info("Payment declined for card ending in {}", request.getCardNumber().substring(request.getCardNumber().length() - 4));
            paymentInfo.setPaymentStatus("DECLINED");
            paymentInfoRepository.save(paymentInfo);
            throw new PaymentDeclinedException("Payment was declined. Please check your card details and try again.");
        }

        logger.info("Payment approved for card ending in {}", request.getCardNumber().substring(request.getCardNumber().length() - 4));
        paymentInfo.setPaymentStatus("COMPLETED");
        
        // Save and return the payment info
        return paymentInfoRepository.save(paymentInfo);
    }

    private void validatePaymentRequest(PaymentRequest request) {
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
        if (request.getBuyerId() == null) {
            throw new IllegalArgumentException("Buyer ID is required");
        }
    }

    private boolean simulatePaymentProcessing(String cardNumber) {
        // For testing: approve all cards except those ending in "0000"
        return !cardNumber.endsWith("0000");
    }

    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}
