package com.farmtrade.backend.controller;

import com.farmtrade.backend.dto.OrderRequest;
import com.farmtrade.backend.dto.PaymentDetails;
import com.farmtrade.backend.dto.PaymentVerificationRequest;
import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.service.OrderService;
import com.farmtrade.backend.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    @PreAuthorize("hasAuthority('RETAILER')")
    @org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            Order order = orderService.placeOrder(orderRequest, authentication.getName());
            PaymentDetails paymentDetails = paymentService.createRazorpayOrder(order);
            return ResponseEntity.ok(paymentDetails);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Failed to create Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        boolean isValid = paymentService.verifyPayment(verificationRequest);
        if (isValid) {
            return ResponseEntity.ok("Payment verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid payment signature");
        }
    }
}
