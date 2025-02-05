package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.CartItem;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.CartRepository;
import com.Pirk.Pirk.repositories.ProductRepository;
import com.Pirk.Pirk.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Get the cart items for a given user ID
    public Iterable<CartItem> getCartItems(Long userId) {
        // Fetch the cart for the given userId and throw exception if not found
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Return the cart items from the cart
        return cart.getCartItems();
    }

    // Add a product to the user's cart
    public void addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Check if the item already exists in the cart
        CartItem existingItem = findCartItem(cart, productId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Create a new CartItem if the product is not already in the cart
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(BigDecimal.valueOf(product.getPrice())); // Convert Double to BigDecimal
            cartItem.setUser(user);  // Set the user
            cartItem.setCart(cart);  // Set the cart
            cart.getCartItems().add(cartItem);
        }

        // Save the cart and update total price
        cartRepository.save(cart);
    }

    // Remove a product from the user's cart
    public void removeFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Remove the cart item
        cart.getCartItems().remove(cartItem);

        // Save the updated cart
        cartRepository.save(cart);
    }

    // Fetch user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get product price by product ID
    public BigDecimal getProductPrice(Long productId) {
        return productRepository.findById(productId)
                .map(product -> BigDecimal.valueOf(product.getPrice())) // Convert Double to BigDecimal
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Get cart by user ID
    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // Clear the cart
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // Helper method to find CartItem by product ID
    private CartItem findCartItem(Cart cart, Long productId) {
        return cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
    }
}
