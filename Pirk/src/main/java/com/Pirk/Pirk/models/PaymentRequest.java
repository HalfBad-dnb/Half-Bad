package com.Pirk.Pirk.models;

import java.math.BigDecimal;

public class PaymentRequest {
    private String cardHolderName;
    private String cardNumber;
    private String expirationDate;
    private String cvv;
    private Long orderId;
    private Long buyerId;
    private BigDecimal amount;

    // Default constructor
    public PaymentRequest() {
    }

    public PaymentRequest(String cardHolderName, String cardNumber, String expirationDate, String cvv, Long orderId, BigDecimal amount) {
        this.cardHolderName = cardHolderName;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
        this.orderId = orderId;
        this.amount = amount;
    }

    // Getters and setters for each field
    public String getCardHolderName() {
        return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}