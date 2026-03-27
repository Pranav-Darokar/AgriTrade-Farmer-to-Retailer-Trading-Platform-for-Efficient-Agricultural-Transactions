package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.Review;
import com.farmtrade.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/retailer/products/{productId}/reviews")
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody Review review) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(reviewService.addReview(productId, email, review));
    }

    @GetMapping("/public/products/{productId}/reviews")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @GetMapping("/farmer/reviews")
    @PreAuthorize("hasAuthority('FARMER')")
    public List<Review> getFarmerReviews() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return reviewService.getReviewsByFarmer(email);
    }

    @GetMapping("/public/farmers/{farmerId}/reviews")
    public List<Review> getFarmerPublicReviews(@PathVariable Long farmerId) {
        return reviewService.getReviewsByFarmerId(farmerId);
    }
}
