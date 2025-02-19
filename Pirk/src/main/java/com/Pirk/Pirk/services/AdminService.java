package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.repositories.ProductRepository;
import com.Pirk.Pirk.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
        return Optional.ofNullable(userRepository.findAll()).orElse(Collections.emptyList());
    }

    // Method to get all products
    public List<Product> getAllProducts() {
        return Optional.ofNullable(productRepository.findAll()).orElse(Collections.emptyList());
    }

    // Method to get all orders
    public List<Order> getAllOrders() {
        return Optional.ofNullable(orderRepository.findAll()).orElse(Collections.emptyList());
    }

    // Method to get a product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // Method to create a new product
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Method to delete a product by ID
    @Transactional
    public boolean deleteProductById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Method to get a user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Method to promote a user to Admin
    @Transactional
    public void promoteToAdmin(Long id) {
        User user = getUserById(id);
        if (!"ADMIN".equalsIgnoreCase(user.getRole().toString())) {
            user.setRole(User.Role.ADMIN);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User is already an admin or does not exist");
        }
    }

    // Method to delete a user
    @Transactional
    public boolean deleteUserById(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
