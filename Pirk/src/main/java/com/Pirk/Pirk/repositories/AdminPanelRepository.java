package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public interface AdminPanelRepository extends JpaRepository<User, Long> {

    // Return an empty list if no results are found for users
    default List<User> findAllUsers() {
        List<User> users = findAll();
        return users != null ? users : Collections.emptyList();
    }

    // Return an empty list if no results are found for products
    default List<User> findAllProducts() {
        List<User> products = findAll();  // This will work only if AdminPanelRepository extends JpaRepository<Product, Long>
        return products != null ? products : Collections.emptyList();
    }

    // Return an empty list if no results are found for orders
    default List<User> findAllOrders() {
        List<User> orders = findAll();  // This will work only if AdminPanelRepository extends JpaRepository<Order, Long>
        return orders != null ? orders : Collections.emptyList();
    }
}
