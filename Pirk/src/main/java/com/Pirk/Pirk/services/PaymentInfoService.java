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

    @Transactional
    public PaymentInfo processPayment(PaymentRequest paymentRequest) {
        // Get the order
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new PaymentDeclinedException("Order not found"));

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
        
        paymentInfo.setLastFourDigits(paymentRequest.getLastFourDigits());  // Assuming this comes from the request
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
