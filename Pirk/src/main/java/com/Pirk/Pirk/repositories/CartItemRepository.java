package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Custom query to find a CartItem by Cart ID and Product ID
    Optional<CartItem> findByCart_IdAndProduct_Id(Long cartId, Long productId);
}
