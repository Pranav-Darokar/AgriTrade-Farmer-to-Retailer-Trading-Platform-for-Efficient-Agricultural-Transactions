package com.farmtrade.backend.repository;

import com.farmtrade.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    java.util.List<Feedback> findAllByOrderByCreatedAtDesc();
}
