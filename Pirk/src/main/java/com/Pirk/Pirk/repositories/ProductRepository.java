package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // No need for findByNameContainingIgnoreCase method if you're only using findById
}
