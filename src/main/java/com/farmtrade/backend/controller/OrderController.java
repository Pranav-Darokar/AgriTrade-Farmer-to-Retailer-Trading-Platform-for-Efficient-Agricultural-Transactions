package com.farmtrade.backend.controller;

import com.farmtrade.backend.dto.OrderRequest;
import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.placeOrder(orderRequest, auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('RETAILER')")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return orderService.getOrdersByRetailer(auth.getName());
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasAuthority('FARMER')")
    public List<Order> getMyOrdersFarmer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return orderService.getOrdersByFarmer(auth.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
