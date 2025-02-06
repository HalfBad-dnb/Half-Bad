package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

import com.Pirk.Pirk.repositories.OrderRepository;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public Order createOrder(Order order) {
        // Validate order
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        if (order.getShippingInfo() == null) {
            throw new IllegalArgumentException("Shipping information is required");
        }
        if (order.getCartItems() == null || order.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        try {
            // Set initial order status
            order.setStatus("PENDING");
            
            // Save the Order
            logger.info("Creating new order...");
            Order savedOrder = orderRepository.save(order);
            logger.info("Order created successfully with ID: {}", savedOrder.getId());
            
            return savedOrder;
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage());
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("Order not found with id: {}", id);
                return new RuntimeException("Order not found with id: " + id);
            });
    }

    public List<Order> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        logger.info("Found {} orders for user {}", orders.size(), userId);
        return orders;
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        logger.info("Updated order {} status to {}", id, status);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("CANCELLED");
        orderRepository.save(order);
        logger.info("Cancelled order {}", id);
    }
}
