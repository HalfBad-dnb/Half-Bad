package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.User;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface CartRepository extends CrudRepository<Cart, Long> {

    // Find a cart by the user's ID
    Optional<Cart> findByUserId(Long userId);

    // Find a cart by user
    Optional<Cart> findByUser(User user);

    // You can also define other custom queries if needed, such as finding by Cart's user and status, etc.
}
