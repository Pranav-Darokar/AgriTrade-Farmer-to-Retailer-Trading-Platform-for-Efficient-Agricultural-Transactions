package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.OrderReview;
import com.farmtrade.backend.service.OrderReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/order-reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderReviewController {

    @Autowired
    private OrderReviewService orderReviewService;

    @PostMapping("/{orderId}")
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<?> submitReview(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {

        try {
            Integer rating = (Integer) payload.get("rating");
            String comment = (String) payload.get("comment");
            String email = authentication.getName();

            OrderReview review = orderReviewService.submitReview(orderId, email, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(orderReviewService.getAllReviews());
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<?> getFarmerReviews(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderReviewService.getReviewsForFarmer(email));
    }

    @GetMapping("/public/farmer/{farmerId}")
    public ResponseEntity<?> getPublicFarmerReviews(@PathVariable Long farmerId) {
        return ResponseEntity.ok(orderReviewService.getReviewsForFarmerById(farmerId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getReview(@PathVariable Long orderId) {
        return orderReviewService.getReviewByOrder(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
