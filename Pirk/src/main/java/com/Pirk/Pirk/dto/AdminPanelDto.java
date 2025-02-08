package com.Pirk.Pirk.dto;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;

import java.util.List;

public class AdminPanelDto {

    private List<User> users;
    private List<Product> products;
    private String adminName; // Optional: to display the admin's name if necessary

    // Constructor
    public AdminPanelDto(List<User> users, List<Product> products, String adminName) {
        this.users = users;
        this.products = products;
        this.adminName = adminName;
    }

    // Getters and Setters
    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
}
