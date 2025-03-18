package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.CartItem;
import org.springframework.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends CrudRepository<CartItem, Long> {
    Optional<CartItem> findByCart_IdAndProduct_Id(Long cartId, Long productId);
    List<CartItem> findByCartId(Long cartId);
}
