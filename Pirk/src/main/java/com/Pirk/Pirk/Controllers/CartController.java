package com.Pirk.Pirk.Controllers;

import com.Pirk.Pirk.models.CartItem;
import com.Pirk.Pirk.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Endpoint to get cart items for a given userId
    @GetMapping("/getCartItems/{userId}")
    public Iterable<CartItem> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);  // Ensure userId is passed
    }

    // Endpoint to add a product to the user's cart
    @PostMapping("/addToCart")
    public void addToCart(@RequestParam Long userId, @RequestParam Long productId,
                          @RequestParam int quantity) {
        // Call addToCart without price as it's fetched from the Product
        cartService.addToCart(userId, productId, quantity);  
    }

    // Endpoint to remove a product from the user's cart
    @DeleteMapping("/removeFromCart/{userId}/{cartItemId}")
    public void removeFromCart(@PathVariable Long userId, @PathVariable Long cartItemId) {
        // Pass userId and cartItemId to the service method
        cartService.removeFromCart(userId, cartItemId);  
    }
}
