package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payment_info")
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cardholderName;

    @Column(length = 4)
    private String lastFourDigits;  // Only store last 4 digits

    private Long orderId;
    @Column(nullable = false)
    private String paymentStatus;
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate;
    @Column(nullable = false)
    private Long buyerId;

    @PrePersist
    protected void onCreate() {
        paymentDate = new Date();
    }

    public PaymentInfo() {
        this.paymentStatus = "PENDING";
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public String getLastFourDigits() {
        return lastFourDigits;
    }

    public void setLastFourDigits(String lastFourDigits) {
        this.lastFourDigits = lastFourDigits;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    @Override
    public String toString() {
        return String.format("Payment for order %d by %s (card ending in %s) - Status: %s", 
            orderId,
            cardholderName,
            lastFourDigits != null ? lastFourDigits : "****",
            paymentStatus);
    }
}
