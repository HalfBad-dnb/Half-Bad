package com.Pirk.Pirk.dto;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.ShippingInfo;

public class OrderDTO {
    private ShippingInfo shippingInfo;
    private PaymentInfo paymentInfo;

    // Getters and setters
    public ShippingInfo getShippingInfo() {
        return shippingInfo;
    }

    public void setShippingInfo(ShippingInfo shippingInfo) {
        this.shippingInfo = shippingInfo;
    }

    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
}
