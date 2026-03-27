package com.farmtrade.backend.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;

    // Getters and Setters
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
