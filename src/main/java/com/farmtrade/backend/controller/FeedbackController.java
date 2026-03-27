package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.Feedback;
import com.farmtrade.backend.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/public/feedback")
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.saveFeedback(feedback));
    }

    @GetMapping("/admin/feedback")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedbacks();
    }
}
