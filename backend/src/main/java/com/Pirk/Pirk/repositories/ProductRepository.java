package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String query);

    // No need for findByNameContainingIgnoreCase method if you're only using findById
}
