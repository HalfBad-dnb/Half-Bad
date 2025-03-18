package com.Pirk.Pirk.models;

import java.util.List;

public class AdminPanel {

    private List<User> users;
    private List<Product> products;
    private List<Order> orders;  // Optional: if you're managing orders in the admin panel
    private int totalUsers;  // Total number of users
    private int totalProducts;  // Total number of products
    private int totalOrders;  // Total number of orders

    // Constructor
    public AdminPanel(List<User> users, List<Product> products, List<Order> orders) {
        this.users = users;
        this.products = products;
        this.orders = orders;
        this.totalUsers = users != null ? users.size() : 0;
        this.totalProducts = products != null ? products.size() : 0;
        this.totalOrders = orders != null ? orders.size() : 0;
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

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }
}
