package com.Pirk.Pirk.models;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_info")
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumber;
    private String expirationDate;
    private String cvv;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    @Override
    public String toString() {
        String lastFourDigits = cardNumber != null && cardNumber.length() >= 4 
            ? cardNumber.substring(cardNumber.length() - 4) 
            : "****";
        return String.format("Card ending in %s, expires %s", 
            lastFourDigits,
            expirationDate != null ? expirationDate : "N/A");
    }
}
