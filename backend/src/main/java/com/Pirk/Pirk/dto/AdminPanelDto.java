package com.Pirk.Pirk.dto;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.models.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminPanelDto {
    private List<User> users;
    private List<Product> products;
    private String adminName; // Optional: to display the admin's name if necessary
}
