package com.Pirk.Pirk.models;

public class OrderConfirmation {

    private String shippingInfo;
    private String paymentInfo;

    // No-argument constructor
    public OrderConfirmation() {
    }

    // Constructor with parameters
    public OrderConfirmation(String shippingInfo, String paymentInfo) {
        this.shippingInfo = shippingInfo;
        this.paymentInfo = paymentInfo;
    }

    // Getters and setters
    public String getShippingInfo() {
        return shippingInfo;
    }

    public void setShippingInfo(String shippingInfo) {
        this.shippingInfo = shippingInfo;
    }

    public String getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(String paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
}
