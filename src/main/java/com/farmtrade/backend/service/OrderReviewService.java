package com.farmtrade.backend.service;

import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.model.OrderReview;
import com.farmtrade.backend.model.OrderStatus;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.OrderRepository;
import com.farmtrade.backend.repository.OrderReviewRepository;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OrderReviewService {

    @Autowired
    private OrderReviewRepository orderReviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public OrderReview submitReview(Long orderId, String email, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getRetailer().getId().equals(user.getId())) {
            throw new RuntimeException("Only the retailer who placed the order can submit a review");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Review can only be submitted for delivered orders");
        }

        if (orderReviewRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("Review already submitted for this order");
        }

        OrderReview review = new OrderReview();
        review.setOrder(order);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        return orderReviewRepository.save(review);
    }

    public Optional<OrderReview> getReviewByOrder(Long orderId) {
        return orderReviewRepository.findByOrderId(orderId);
    }

    public java.util.List<OrderReview> getAllReviews() {
        return orderReviewRepository.findAll();
    }

    public java.util.List<OrderReview> getReviewsForFarmer(String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return orderReviewRepository.findByFarmer(farmer);
    }

    public java.util.List<OrderReview> getReviewsForFarmerById(Long id) {
        User farmer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return orderReviewRepository.findByFarmer(farmer);
    }
}
