package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.CartItem;
import com.Pirk.Pirk.models.Product;
import com.Pirk.Pirk.repositories.CartItemRepository;
import com.Pirk.Pirk.repositories.CartRepository;
import com.Pirk.Pirk.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartItemService(CartItemRepository cartItemRepository, CartRepository cartRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // Add a new cart item or update it if it already exists
    public CartItem addOrUpdateCartItem(Long cartId, CartItem cartItem) {
        // Use the custom query to find by Cart ID and Product ID
        Optional<CartItem> existingCartItem = cartItemRepository.findByCart_IdAndProduct_Id(cartId, cartItem.getProduct().getId());
        
        if (existingCartItem.isPresent()) {
            // If the item already exists in the cart, update the quantity
            CartItem updatedCartItem = existingCartItem.get();
            updatedCartItem.setQuantity(updatedCartItem.getQuantity() + cartItem.getQuantity());
            return cartItemRepository.save(updatedCartItem);
        } else {
            // If the item does not exist, save the new item
            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem addItemToCart(Long cartId, CartItem cartItem) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        // Get the product from the database
        Product product = productRepository.findById(cartItem.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Create a new cart item with the product
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setQuantity(cartItem.getQuantity());
        newCartItem.setPrice(product.getPrice());
        newCartItem.setCart(cart);
        
        // Update cart's total price
        cart.setTotalPrice(cart.getTotalPrice() + (product.getPrice().doubleValue() * cartItem.getQuantity()));
        cartRepository.save(cart);
        
        return cartItemRepository.save(newCartItem);
    }

    public CartItem updateCartItem(Long itemId, CartItem updatedItem) {
        CartItem existingItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        existingItem.setQuantity(updatedItem.getQuantity());
        // Update other properties as needed
        
        return cartItemRepository.save(existingItem);
    }

    public void removeCartItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public List<CartItem> getCartItems(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }
}
