package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.CartItem;
import com.Pirk.Pirk.repositories.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    @Autowired
    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
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

    // Other methods like removeCartItem, updateCartItemQuantity etc.
}
