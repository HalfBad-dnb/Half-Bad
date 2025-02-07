package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.CartRepository;
import com.Pirk.Pirk.repositories.ProductRepository;
import com.Pirk.Pirk.repositories.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Get the cart for a specific user
    public Cart getCartByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // If no cart exists, create a new one
                    Cart newCart = new Cart();
                    newCart.setUser(user.get());
                    return cartRepository.save(newCart);
                });
    }

    // Add item to the cart
    public void addItemToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.addItem(product, quantity, product.getPrice().doubleValue());
        cartRepository.save(cart);
    }

    // Remove item from the cart
    public void removeItemFromCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.removeItem(productId, quantity, product.getPrice().doubleValue());
        cartRepository.save(cart);
    }

    // Clear the cart
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.clearCart();
        cartRepository.save(cart);
    }
}