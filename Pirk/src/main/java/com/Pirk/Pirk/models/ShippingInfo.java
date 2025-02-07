package com.Pirk.Pirk.models;

import jakarta.persistence.*;

@Entity
@Table(name = "shipping_info")
public class ShippingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;
    
    @Column(name = "street_address", nullable = false)
    private String streetAddress;

    @Column(nullable = false)
    private String city;

    private String state;
    
    @Column(name = "postal_code", nullable = false)
    private String postalCode;
    
    @Column(nullable = false)
    private String country;

    @Column(name = "phone_number")
    private String phoneNumber;

    // Default constructor
    public ShippingInfo() {}

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // Get full address as a concatenated string
    public String getAddress() {
        return String.format("%s, %s, %s, %s %s, %s", 
            streetAddress, city, 
            state != null ? state + ", " : "", 
            postalCode, country);
    }

    // Set full address with a single string (you may want to split it accordingly in real cases)
    public void setAddress(String address) {
        // For simplicity, assuming the address string contains all necessary info
        String[] parts = address.split(", ");
        if (parts.length >= 5) {
            this.streetAddress = parts[0];
            this.city = parts[1];
            this.state = parts[2];
            this.postalCode = parts[3];
            this.country = parts[4];
        }
    }

    // Override toString for a formatted output
    @Override
    public String toString() {
        return getAddress();
    }
}