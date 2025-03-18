package com.Pirk.Pirk.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import com.Pirk.Pirk.models.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByUserIdAndStatus(Long userId, String status);


    List<Order> findByUserId(Long userId);
}
