package com.farmtrade.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {
    private String orderId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String key;
}
