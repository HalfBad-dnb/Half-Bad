package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class OrderService implements OrderServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public Order createOrder(Order order) {
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
            order.setStatus("PENDING");
            order.calculateTotalAmount();

            if (order.getPaymentInfo() != null) {
                order.getPaymentInfo().setOrder(order);
            }

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
        logger.info("Fetching orders for user ID: {}", userId);
        try {
            List<Order> orders = orderRepository.findByUserId(userId);
            logger.info("Retrieved {} orders for user ID: {}", orders.size(), userId);
            return orders;
        } catch (Exception e) {
            logger.error("Error fetching orders: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch orders: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        logger.info("Updated order {} status to {}", id, status);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Order order) {
        if (order == null || order.getId() == null) {
            throw new IllegalArgumentException("Invalid order update request");
        }

        try {
            order.calculateTotalAmount();
            logger.info("Updating order with ID: {}", order.getId());
            return orderRepository.save(order);
        } catch (Exception e) {
            logger.error("Error updating order: {}", e.getMessage());
            throw new RuntimeException("Failed to update order: " + e.getMessage());
        }
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("CANCELLED");
        orderRepository.save(order);
        logger.info("Cancelled order {}", id);
    }
}
