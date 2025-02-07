package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shipping_info")
public class ShippingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String username;
    
    @Column(name = "address", nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String state;
    
    @Column(name = "postal_code", nullable = false)
    private String postalCode;
    
    @Column(nullable = false)
    private String country;

    @Column(name = "phone_number")
    private String phoneNumber;

    // Get full address as a concatenated string
    public String getAddress() {
        return String.format("%s, %s, %s, %s %s, %s",
            username, // ✅ Fix: Changed `userName` to `username`
            address,
            city,
            state != null ? state + "," : "",
            postalCode,
            country);
    }

    // Override toString for a formatted output
    @Override
    public String toString() {
        return getAddress();
    }
}
