
package com.farmtrade.backend.controller;

import com.farmtrade.backend.model.User;
import com.farmtrade.backend.model.UserStatus;
import com.farmtrade.backend.repository.OrderRepository;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderRepository orderRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        long userCount = userRepository.count();
        long productCount = productRepository.count();
        long orderCount = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        // 1. Get Real Revenue Data for Graphs (Grouped by Date)
        List<com.farmtrade.backend.model.Order> allOrders = orderRepository.findAll();
        Map<String, BigDecimal> dailyRevenue = new HashMap<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("EEE");

        // Initialize last 7 days with zero revenue
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            dailyRevenue.put(now.minusDays(i).format(formatter), BigDecimal.ZERO);
        }

        // Fill with actual data
        for (com.farmtrade.backend.model.Order order : allOrders) {
            if (order.getOrderDate() != null) {
                String day = order.getOrderDate().format(formatter);
                if (dailyRevenue.containsKey(day)) {
                    dailyRevenue.put(day, dailyRevenue.get(day)
                            .add(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO));
                }
            }
        }

        List<Map<String, Object>> revenueTrend = new java.util.ArrayList<>();
        // Maintain order of days
        for (int i = 6; i >= 0; i--) {
            String day = now.minusDays(i).format(formatter);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("name", day);
            dayData.put("revenue", dailyRevenue.get(day));
            revenueTrend.add(dayData);
        }

        // 2. Real Recent Activity
        List<Map<String, Object>> recentActivity = new java.util.ArrayList<>();

        // Latest Users
        List<User> latestUsers = userRepository.findAll(); // Simple, assuming ID order reflects recency
        latestUsers.stream()
                .sorted((u1, u2) -> u2.getId().compareTo(u1.getId()))
                .limit(3)
                .forEach(u -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("user", u.getFullName() != null ? u.getFullName() : u.getEmail());
                    act.put("action", "Joined the Platform");
                    act.put("time", "Recent");
                    act.put("type", u.getRole() != null ? u.getRole().toString() : "FARMER");
                    recentActivity.add(act);
                });

        // Latest Orders
        allOrders.stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .limit(2)
                .forEach(o -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("user",
                            o.getRetailer() != null
                                    ? (o.getRetailer().getFullName() != null ? o.getRetailer().getFullName()
                                            : o.getRetailer().getEmail())
                                    : "Unknown");
                    act.put("action", "Placed Order #" + o.getId());
                    act.put("time", "Order Sync");
                    act.put("type", "RETAILER");
                    recentActivity.add(act);
                });

        Map<String, Object> stats = new HashMap<>();
        stats.put("users", userCount);
        stats.put("products", productCount);
        stats.put("orders", orderCount);
        stats.put("revenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.put("revenueTrend", revenueTrend);
        stats.put("recentActivity", recentActivity);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Autowired
    private com.farmtrade.backend.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // 1. Delete Password Reset Tokens
            passwordResetTokenRepository.deleteByUser(user);

            // 2. Delete Products (if Farmer)
            if (user.getRole() == com.farmtrade.backend.model.Role.FARMER) {
                List<com.farmtrade.backend.model.Product> products = productRepository.findByFarmer(user);
                productRepository.deleteAll(products);
                productRepository.flush(); // Force delete to DB
            }

            // 3. Delete Orders (if Retailer)
            if (user.getRole() == com.farmtrade.backend.model.Role.RETAILER) {
                List<com.farmtrade.backend.model.Order> orders = orderRepository.findByRetailer(user);
                orderRepository.deleteAll(orders);
                orderRepository.flush(); // Force delete to DB
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log stack trace
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        String statusStr = request.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        try {
            com.farmtrade.backend.model.UserStatus status = com.farmtrade.backend.model.UserStatus
                    .valueOf(statusStr.toUpperCase());
            user.setStatus(status);
            userRepository.save(user);
            return ResponseEntity.ok("User status updated to " + status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
    }
}
