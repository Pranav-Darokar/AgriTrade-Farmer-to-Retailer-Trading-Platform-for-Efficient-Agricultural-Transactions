package com.farmtrade.backend.dto;

import java.math.BigDecimal;

public class PaymentDetails {
    private String orderId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String key;

    public PaymentDetails() {}

    public PaymentDetails(String orderId, String razorpayOrderId, BigDecimal amount, String currency, String key) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
}
