package com.farmtrade.backend.repository;

import com.farmtrade.backend.model.OrderReview;
import com.farmtrade.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderReviewRepository extends JpaRepository<OrderReview, Long> {
    Optional<OrderReview> findByOrderId(Long orderId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r FROM OrderReview r JOIN r.order o JOIN o.items i JOIN i.product p WHERE p.farmer = :farmer ORDER BY r.createdAt DESC")
    java.util.List<OrderReview> findByFarmer(com.farmtrade.backend.model.User farmer);
}
