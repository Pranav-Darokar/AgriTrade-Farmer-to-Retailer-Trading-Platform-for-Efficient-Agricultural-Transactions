package com.farmtrade.backend.repository;

import com.farmtrade.backend.model.Review;
import com.farmtrade.backend.model.OrderReview;
import com.farmtrade.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<Review> findByProductFarmerOrderByCreatedAtDesc(User farmer);
}
