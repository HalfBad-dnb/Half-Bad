package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AdminPanelController {

    @Autowired
    private AdminService adminService;

    // Display the Admin Panel Dashboard
    @GetMapping("/admin")
    public String AdminPanel(Model model) {
        List<User> users = adminService.getAllUsers();  // Fetch all users
        List<Product> products = adminService.getAllProducts();  // Fetch all products
        List<Order> orders = adminService.getAllOrders();  // Fetch all orders

        model.addAttribute("users", users);
        model.addAttribute("products", products);
        model.addAttribute("orders", orders);
        
        return "AdminPanel";  // Admin dashboard template
    }

    

    // Other methods for user, product, or order management can be added as needed
}
