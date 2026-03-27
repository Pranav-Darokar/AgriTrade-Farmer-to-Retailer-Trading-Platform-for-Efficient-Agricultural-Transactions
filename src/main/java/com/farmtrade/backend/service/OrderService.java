package com.farmtrade.backend.service;

import com.farmtrade.backend.dto.OrderItemRequest;
import com.farmtrade.backend.dto.OrderRequest;
import com.farmtrade.backend.model.*;
import com.farmtrade.backend.repository.OrderRepository;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest, String email) {
        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (retailer.getRole() != Role.RETAILER) {
            throw new RuntimeException("Only retailers can place orders");
        }

        Order order = new Order();
        order.setRetailer(retailer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // PERISHABILITY CHECK: Calculate distance between Farmer and Retailer
            if (product.getPerishable() != null && product.getPerishable()) {
                User farmer = product.getFarmer();
                if (farmer.getLatitude() != null && farmer.getLongitude() != null &&
                        retailer.getLatitude() != null && retailer.getLongitude() != null) {

                    double distance = calculateDistance(
                            farmer.getLatitude(), farmer.getLongitude(),
                            retailer.getLatitude(), retailer.getLongitude());

                    // Threshold: 150km for standard perishable delivery
                    // If distance is > 200km, it's very likely to spoil without cold chain
                    if (distance > 150.0) {
                        throw new RuntimeException("Product " + product.getName()
                                + " is highly perishable and cannot be delivered to your location (Distance: "
                                + String.format("%.2f", distance)
                                + " km). Maximum delivery distance for this item is 150km.");
                    }
                }
            }

            // Decrement stock
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPricePerUnit(product.getPrice());

            order.getItems().add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Notify Farmers
        savedOrder.getItems().stream()
                .map(item -> item.getProduct().getFarmer())
                .distinct()
                .forEach(farmer -> {
                    notificationService.createNotification(
                            farmer,
                            "New Order Received!",
                            "You have a new order (#" + savedOrder.getId() + ") from " + retailer.getFullName(),
                            "ORDER_NEW");
                });

        // Notify Retailer
        notificationService.createNotification(
                retailer,
                "Order Placed Successfully",
                "Your order #" + savedOrder.getId() + " has been placed and is waiting for farmer confirmation.",
                "ORDER_CONFIRMED");

        return savedOrder;
    }

    /**
     * Haversine formula to calculate distance between two points
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Order> getOrdersByRetailer(String email) {
        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByRetailer(retailer);
    }

    public List<Order> getOrdersByFarmer(String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findDistinctByItemsProductFarmer(farmer);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order cancelOrder(Long orderId, String email) {
        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Only the retailer who placed the order can cancel it
        if (!order.getRetailer().getId().equals(retailer.getId())) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        // Only PENDING orders can be cancelled
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only PENDING orders can be cancelled");
        }

        // Restore stock for each item
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        // Notify Farmers about cancellation
        savedOrder.getItems().stream()
                .map(item -> item.getProduct().getFarmer())
                .distinct()
                .forEach(farmer -> {
                    notificationService.createNotification(
                            farmer,
                            "Order Cancelled",
                            "Order #" + savedOrder.getId() + " has been cancelled by the retailer ("
                                    + retailer.getFullName() + ")",
                            "ORDER_CANCELLED");
                });

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus, String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Verify the farmer has at least one product in this order
        boolean isFarmerOrder = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(farmer.getId()));
        if (!isFarmerOrder) {
            throw new RuntimeException("You are not authorized to update this order");
        }

        try {
            OrderStatus status = OrderStatus.valueOf(newStatus);
            order.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + newStatus);
        }

        Order savedOrder = orderRepository.save(order);

        // Notify Retailer about status update
        notificationService.createNotification(
                order.getRetailer(),
                "Order Status Updated",
                "Your order #" + order.getId() + " is now " + newStatus,
                "ORDER_STATUS_UPDATE");

        return savedOrder;
    }
}
