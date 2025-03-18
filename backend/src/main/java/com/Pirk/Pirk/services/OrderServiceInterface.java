package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import java.util.List;

public interface OrderServiceInterface {
    Order createOrder(Order order);
    Order getOrderById(Long id);
    List<Order> getOrdersByUserId(Long userId);
    Order updateOrderStatus(Long id, String status);
    void cancelOrder(Long id);
}
