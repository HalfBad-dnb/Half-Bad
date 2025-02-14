package com.Pirk.Pirk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.Pirk.Pirk.models.User;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private User user; // The user object, assuming you're passing the user
    private Long productId; // ID of the product being added
    private int quantity; // Quantity of the product
    private BigDecimal price; // Price of the product (could be fetched from the product itself)
}
