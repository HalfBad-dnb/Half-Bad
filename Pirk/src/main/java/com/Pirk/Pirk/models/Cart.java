package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Automatically generates the id
    private Long id;  // Unique identifier for the cart
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Association with User
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;  // A list of cart items
    
    private double totalPrice;  // Keeping the original type

    public Cart() {
        this.cartItems = new ArrayList<>();
        this.totalPrice = 0.0;
    }

    // Add product to the cart
    public void addItem(Product product, int quantity, double price) {
        CartItem existingItem = findCartItem(product.getId());
        
        if (existingItem != null) {
            // Update quantity if the product already exists in the cart
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Otherwise, create a new CartItem
            CartItem newItem = new CartItem(product, quantity, price, this);
            cartItems.add(newItem);
        }
        // Update the total price
        updateTotalPrice(price * quantity);
    }

    // Remove product from the cart
    public void removeItem(Long productId, int quantity, double price) {
        CartItem itemToRemove = findCartItem(productId);

        if (itemToRemove != null) {
            int currentQuantity = itemToRemove.getQuantity();
            if (currentQuantity <= quantity) {
                cartItems.remove(itemToRemove);  // Remove the item completely
            } else {
                itemToRemove.setQuantity(currentQuantity - quantity);  // Decrease the quantity
            }
            updateTotalPrice(-price * quantity);  // Update total price
        }
    }

    // Update total price of the cart
    private void updateTotalPrice(double amount) {
        totalPrice += amount;
    }

    // Find CartItem by productId
    private CartItem findCartItem(Long productId) {
        for (CartItem cartItem : cartItems) {
            if (cartItem.getProduct().getId().equals(productId)) {
                return cartItem;
            }
        }
        return null;
    }

    // Getter for totalPrice
    public double getTotalPrice() {
        return totalPrice;
    }

    // Setter for totalPrice
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    // Getter for cartItems
    public List<CartItem> getCartItems() {
        return cartItems;
    }

    // Setters for other fields
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Clear cart (optional method)
    public void clearCart() {
        cartItems.clear();
        totalPrice = 0.0;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }
}
