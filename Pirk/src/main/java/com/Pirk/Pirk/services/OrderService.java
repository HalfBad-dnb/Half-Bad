package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.OrderRepository;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    @Transactional
    public void submitOrder(Order order) {
        // Validate order (optional but recommended)
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        // Retrieve payment info from the order
        PaymentInfo paymentInfo = order.getPaymentInfo();
        
        if (paymentInfo != null) {
            // Save the PaymentInfo object
            logger.info("Saving payment information...");
            paymentInfoRepository.save(paymentInfo);
            
            // Associate the saved PaymentInfo object with the Order
            order.setPaymentInfo(paymentInfo);
        }

        // Save the Order object
        logger.info("Saving order...");
        orderRepository.save(order);

        logger.info("Order submission completed successfully.");
    }

    @Transactional
    public Order createOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}
