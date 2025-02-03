package com.Pirk.Pirk.dto;

import com.Pirk.Pirk.models.User;

import java.math.BigDecimal;

public class CartItemDTO {

    private User user; // The user object, assuming you're passing the user
    private Long productId; // ID of the product being added
    private int quantity; // Quantity of the product
    private BigDecimal price; // Price of the product (could be fetched from the product itself)

    // Constructor
    public CartItemDTO(User user, Long productId, int quantity, BigDecimal price) {
        this.user = user;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters and setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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
}
