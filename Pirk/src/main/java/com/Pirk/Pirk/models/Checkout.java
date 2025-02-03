package com.Pirk.Pirk.models;

import jakarta.persistence.*;

@Entity
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Unique identifier for the checkout

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user who is making the checkout

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;  // The cart being checked out

    private double totalAmount;  // The total amount for the checkout
    private String paymentMethod;  // E.g., "Credit Card", "PayPal"
    private String shippingAddress;  // Shipping address for the order
    private String orderStatus;  // Order status (e.g., "Pending", "Completed")
    private String paymentStatus;  // Payment status (e.g., "Paid", "Pending")

    // Default constructor
    public Checkout() {
    }

    // Getter and Setter for id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Getter and Setter for cart
    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    // Getter and Setter for totalAmount
    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    // Getter and Setter for paymentMethod
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Getter and Setter for shippingAddress
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    // Getter and Setter for orderStatus
    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    // Getter and Setter for paymentStatus
    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
