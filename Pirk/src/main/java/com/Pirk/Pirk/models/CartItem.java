package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    private BigDecimal price;  // Changed to BigDecimal for accurate pricing

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Default constructor
    public CartItem() {}

    // Constructor with all fields, updated to use BigDecimal for price
    public CartItem(Product product, int quantity, BigDecimal price, Cart cart, User user) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.cart = cart;
        this.user = user;
    }

    // Constructor matching the parameters (Product, int, double, Cart)
    public CartItem(Product product, int quantity, double price, Cart cart) {
        this.product = product;
        this.quantity = quantity;
        this.price = BigDecimal.valueOf(price);  // Convert double to BigDecimal
        this.cart = cart;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
