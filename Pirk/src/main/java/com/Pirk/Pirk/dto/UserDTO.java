package com.Pirk.Pirk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String username;
    private String email;
    private String role; // You can modify this if you need a more complex role system
    private String Address;
    private String phone_number;
}
