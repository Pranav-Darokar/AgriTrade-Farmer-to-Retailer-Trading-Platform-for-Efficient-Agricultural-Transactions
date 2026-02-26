package com.farmtrade.backend.controller;

import com.farmtrade.backend.dto.OrderRequest;
import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.model.Role;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.repository.OrderRepository;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.UserRepository;
import com.farmtrade.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.placeOrder(orderRequest, auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('RETAILER')")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return orderService.getOrdersByRetailer(auth.getName());
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasAuthority('FARMER')")
    public List<Order> getMyOrdersFarmer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return orderService.getOrdersByFarmer(auth.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('RETAILER')")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.cancelOrder(id, auth.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, auth.getName()));
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAuthority('FARMER') or hasAuthority('RETAILER')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();

        if (currentUser.getRole() == Role.FARMER) {
            long orderCount = orderRepository.countDistinctByItemsProductFarmer(currentUser);
            BigDecimal totalRevenue = orderRepository.sumTotalAmountByFarmer(currentUser);
            long activeListings = productRepository.findByFarmer(currentUser).size();
            List<Order> recentOrders = orderRepository
                    .findDistinctByItemsProductFarmerOrderByOrderDateDesc(currentUser);
            // Limit to 5 most recent
            if (recentOrders.size() > 5) {
                recentOrders = recentOrders.subList(0, 5);
            }

            stats.put("orderCount", orderCount);
            stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            stats.put("activeListings", activeListings);
            stats.put("recentOrders", recentOrders);
        } else if (currentUser.getRole() == Role.RETAILER) {
            long orderCount = orderRepository.countByRetailer(currentUser);
            BigDecimal totalSpent = orderRepository.sumTotalAmountByRetailer(currentUser);
            List<Order> recentOrders = orderRepository
                    .findByRetailerOrderByOrderDateDesc(currentUser);
            if (recentOrders.size() > 5) {
                recentOrders = recentOrders.subList(0, 5);
            }

            stats.put("orderCount", orderCount);
            stats.put("totalSpent", totalSpent != null ? totalSpent : BigDecimal.ZERO);
            stats.put("recentOrders", recentOrders);
        }

        return ResponseEntity.ok(stats);
    }
}
