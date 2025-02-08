package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.repositories.ProductRepository;
import com.Pirk.Pirk.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Method to get all users
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users != null ? users : Collections.emptyList();
    }

    // Method to get all products
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products != null ? products : Collections.emptyList();
    }

    // Method to get all orders
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders != null ? orders : Collections.emptyList();
    }

    // Method to get a product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // Method to get a user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Method to promote a user to Admin
    public void promoteToAdmin(Long id) {
        User user = getUserById(id);  // Fetch user by ID
        if (user != null && !user.getRole().toString().equalsIgnoreCase("admin")) {
            user.setRole(User.Role.ADMIN);  // Set role to admin
            userRepository.save(user);  // Save the updated user
        } else {
            throw new RuntimeException("User is already an admin or does not exist");
        }
    }


    // Method to delete a user
    public void deleteUser(Long id) {
        User user = getUserById(id);  // Fetch user by ID
        userRepository.delete(user);  // Delete the user
    }
}

