package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.AdminPanel;
import com.Pirk.Pirk.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPanelController {

    @Autowired
    private AdminService adminService;

    // Display the Admin Panel Dashboard
    @GetMapping
    public ResponseEntity<AdminPanel> getAdminPanel() {
        List<User> users = adminService.getAllUsers();
        List<Product> products = adminService.getAllProducts();
        List<Order> orders = adminService.getAllOrders();
        AdminPanel adminPanel = new AdminPanel(users, products, orders);
        return ResponseEntity.ok(adminPanel);
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Delete a user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        boolean deleted = adminService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
