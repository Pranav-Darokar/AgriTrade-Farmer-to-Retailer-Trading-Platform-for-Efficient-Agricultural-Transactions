package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.Notification;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.UserRepository;
import com.farmtrade.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<Notification>> getAllNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}
