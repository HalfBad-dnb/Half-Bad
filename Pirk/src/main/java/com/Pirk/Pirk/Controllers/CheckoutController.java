package com.Pirk.Pirk.Controllers;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.services.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    // Create a checkout (POST request)
    @PostMapping("/create")
    public Checkout createCheckout(@RequestParam Long userId,
                                   @RequestParam Long cartId,
                                   @RequestParam String paymentMethod,
                                   @RequestParam String shippingAddress) {

        User user = new User();  // You would retrieve the user from the database based on userId
        user.setId(userId);

        Cart cart = new Cart();  // You would retrieve the cart from the database based on cartId
        cart.setId(cartId);

        return checkoutService.createCheckout(user, cart, paymentMethod, shippingAddress);
    }
}
