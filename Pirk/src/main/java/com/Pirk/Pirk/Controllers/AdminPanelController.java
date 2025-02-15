package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.services.AdminService;
import com.Pirk.Pirk.models.AdminPanel;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class AdminPanelController {

    @Autowired
    private AdminService adminService;

    // Display the Admin Panel Dashboard
    @GetMapping("/api/admin")
    public ResponseEntity<AdminPanel> getAdminPanel() {
        List<User> users = adminService.getAllUsers();
        List<Product> products = adminService.getAllProducts();
        List<Order> orders = adminService.getAllOrders();
        AdminPanel adminPanel = new AdminPanel(users, products, orders);
        return ResponseEntity.ok(adminPanel);
    }
    

    // Other methods for user, product, or order management can be added as needed
}
