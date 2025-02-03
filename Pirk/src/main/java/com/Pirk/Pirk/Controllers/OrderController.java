package com.Pirk.Pirk.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.OrderConfirmation;
import com.Pirk.Pirk.models.OrderRequest;
import com.Pirk.Pirk.repositories.OrderRepository;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/submit")
    public ResponseEntity<OrderConfirmation> submitOrder(@RequestBody OrderRequest orderRequest) {
        // Validate required fields
        if (orderRequest.getShippingInfo() == null || orderRequest.getPaymentInfo() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Create an Order object
        Order order = new Order();
        order.setUsername(username);
        order.setOrderNumber(orderRequest.getOrderNumber());
        order.setOrderDate(new Date());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setShippingInfo(orderRequest.getShippingInfo());
        order.setPaymentInfo(orderRequest.getPaymentInfo());

        // Save order to the database
        orderRepository.save(order);

        // Return confirmation
        OrderConfirmation confirmation = new OrderConfirmation();
        confirmation.setShippingInfo(order.getShippingInfo().toString());
        confirmation.setPaymentInfo(order.getPaymentInfo().toString());

        return ResponseEntity.ok(confirmation);
    }

    @GetMapping("/user-orders")
    public ResponseEntity<List<Order>> getUserOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<Order> userOrders = orderRepository.findByUsername(username);
        return ResponseEntity.ok(userOrders);
    }
}
