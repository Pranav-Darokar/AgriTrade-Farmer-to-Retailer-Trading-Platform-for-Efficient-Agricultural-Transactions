package com.farmtrade.backend.service;

import com.farmtrade.backend.model.Product;
import com.farmtrade.backend.model.Review;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.ReviewRepository;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReview(Long productId, String email, Review review) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        review.setProduct(product);
        review.setUser(user);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public void populateProductRatings(Product product) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
        product.setReviewCount(reviews.size());
        if (reviews.isEmpty()) {
            product.setAverageRating(0.0);
        } else {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            product.setAverageRating(Math.round(avg * 10.0) / 10.0);
        }
    }

    public List<Review> getReviewsByFarmer(String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return reviewRepository.findByProductFarmerOrderByCreatedAtDesc(farmer);
    }

    public List<Review> getReviewsByFarmerId(Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return reviewRepository.findByProductFarmerOrderByCreatedAtDesc(farmer);
    }
}
