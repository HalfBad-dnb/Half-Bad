package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    public Cart() {
        this.cartItems = new ArrayList<>();
        this.totalPrice = BigDecimal.ZERO;
    }

    // Add product to the cart
    public void addItem(Product product, int quantity, BigDecimal price) {
        CartItem existingItem = findCartItem(product.getId());

        if (existingItem != null) {
            // Update quantity if the product already exists in the cart
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Otherwise, create a new CartItem
            CartItem newItem = new CartItem(product, quantity, price, this);
            cartItems.add(newItem);
        }
        updateTotalPrice(price.multiply(BigDecimal.valueOf(quantity)));
    }

    // Remove product from the cart
    public void removeItem(Long productId, int quantity, BigDecimal price) {
        CartItem itemToRemove = findCartItem(productId);

        if (itemToRemove != null) {
            int currentQuantity = itemToRemove.getQuantity();
            if (currentQuantity <= quantity) {
                cartItems.remove(itemToRemove);  // Remove the item completely
            } else {
                itemToRemove.setQuantity(currentQuantity - quantity);  // Decrease the quantity
            }
            updateTotalPrice(price.multiply(BigDecimal.valueOf(quantity)).negate());
        }
    }

    // Update total price of the cart
    private void updateTotalPrice(BigDecimal amount) {
        totalPrice = totalPrice.add(amount);
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
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    // Setter for totalPrice
    public void setTotalPrice(BigDecimal totalPrice) {
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

    // Clear cart
    public void clearCart() {
        cartItems.clear();
        totalPrice = BigDecimal.ZERO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}