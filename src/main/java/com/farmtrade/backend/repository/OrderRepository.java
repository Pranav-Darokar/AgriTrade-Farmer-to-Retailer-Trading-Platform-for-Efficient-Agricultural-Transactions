package com.farmtrade.backend.repository;

import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRetailer(User retailer);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    List<Order> findDistinctByItemsProductFarmer(User farmer);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    BigDecimal sumTotalRevenue();

    // Retailer stats
    long countByRetailer(User retailer);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.retailer = :retailer")
    BigDecimal sumTotalAmountByRetailer(User retailer);

    List<Order> findByRetailerOrderByOrderDateDesc(User retailer);

    // Farmer stats
    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.items i WHERE i.product.farmer = :farmer")
    long countDistinctByItemsProductFarmer(User farmer);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o JOIN o.items i WHERE i.product.farmer = :farmer")
    BigDecimal sumTotalAmountByFarmer(User farmer);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o JOIN o.items i WHERE i.product.farmer = :farmer AND o.paymentStatus = com.farmtrade.backend.model.PaymentStatus.COMPLETED")
    BigDecimal sumCompletedAmountByFarmer(User farmer);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.farmer = :farmer ORDER BY o.orderDate DESC")
    List<Order> findDistinctByItemsProductFarmerOrderByOrderDateDesc(User farmer);
}
