package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.CartItem;
import com.Pirk.Pirk.services.CartService;
import com.Pirk.Pirk.services.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;

    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartItem> addItemToCart(
            @PathVariable Long userId,
            @RequestBody CartItem cartItem) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItemService.addItemToCart(cart.getId(), cartItem));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody CartItem cartItem) {
        return ResponseEntity.ok(cartItemService.updateCartItem(itemId, cartItem));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long itemId) {
        cartItemService.removeCartItem(itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cartId}/cart_items")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartItemService.getCartItems(cartId));
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.ok().build();
    }
}
