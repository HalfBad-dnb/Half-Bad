package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
}
