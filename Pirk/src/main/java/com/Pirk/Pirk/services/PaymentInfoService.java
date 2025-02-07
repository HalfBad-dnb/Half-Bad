package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.repositories.OrderRepository;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository, OrderRepository orderRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
        this.orderRepository = orderRepository;
    }

    private boolean validateCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove any spaces or dashes
        cardNumber = cardNumber.replaceAll("[ -]", "");
        
        // Check if the card number contains only digits and has valid length (13-19 digits)
        if (!cardNumber.matches("\\d{13,19}")) {
            return false;
        }
        
        // Luhn algorithm for card number validation
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }

    private boolean validateExpirationDate(String expirationDate) {
        try {
            // Parse the expiration date (format: MM/YY)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
            YearMonth expiry = YearMonth.parse(expirationDate, formatter);
            YearMonth now = YearMonth.now();
            
            // Check if the card has not expired
            return !expiry.isBefore(now);
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    private boolean validateCVV(String cvv) {
        // CVV should be 3 or 4 digits
        return cvv != null && cvv.matches("\\d{3,4}");
    }

    @Transactional
    public PaymentInfo processPayment(PaymentRequest paymentRequest) {
        // Validate card number
        if (!validateCardNumber(paymentRequest.getCardNumber())) {
            throw new PaymentDeclinedException("Invalid card number");
        }

        // Validate expiration date
        if (!validateExpirationDate(paymentRequest.getExpirationDate())) {
            throw new PaymentDeclinedException("Card has expired or invalid expiration date format (MM/YY)");
        }

        // Validate CVV
        if (!validateCVV(paymentRequest.getCvv())) {
            throw new PaymentDeclinedException("Invalid CVV");
        }

        // Get the order
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate payment amount
        if (paymentRequest.getAmount() == null || !paymentRequest.getAmount().equals(order.getTotalAmount())) {
            throw new PaymentDeclinedException("Payment amount does not match order total");
        }

        // Check for existing completed payment
        List<PaymentInfo> existingPayments = paymentInfoRepository.findByOrderId(paymentRequest.getOrderId());
        if (existingPayments.stream().anyMatch(p -> "COMPLETED".equals(p.getPaymentStatus()))) {
            throw new PaymentDeclinedException("Payment already processed for this order");
        }

        // Create PaymentInfo and set all necessary fields
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setPaymentStatus("COMPLETED");
        paymentInfo.setStatus("COMPLETED");
        paymentInfo.setCardholderName(paymentRequest.getCardHolderName());
        paymentInfo.setLastFourDigits(paymentRequest.getCardNumber().substring(paymentRequest.getCardNumber().length() - 4));
        paymentInfo.setOrder(order);
        paymentInfo.setBuyerId(paymentRequest.getBuyerId());
        paymentInfo.setPaymentMethod("CREDIT_CARD");
        paymentInfo.setAmount(paymentRequest.getAmount());

        // Save and return the payment info
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