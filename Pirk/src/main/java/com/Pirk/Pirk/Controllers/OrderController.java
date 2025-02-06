package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.services.OrderService;
import com.Pirk.Pirk.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private Long getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUserId();
        }
        throw new RuntimeException("User ID not found in authentication token");
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Long userId = getCurrentUserId();
            order.setUserId(userId);
            
            // Set initial order status
            order.setStatus("PENDING");
            
            // Log the incoming order
            logger.info("Creating order for user {}: {}", userId, order);
            
            Order savedOrder = orderService.createOrder(order);
            logger.info("Order created successfully: {}", savedOrder.getId());
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            logger.error("Failed to create order: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            Order order = orderService.getOrderById(id);
            
            // Ensure user can only access their own orders
            if (!order.getUserId().equals(userId)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "You can only view your own orders"));
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Failed to get order {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to get order: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders() {
        try {
            Long userId = getCurrentUserId();
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Failed to get user orders: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to get user orders: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }
}
