package com.farmtrade.backend.repository;

import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRetailer(User retailer);

    List<Order> findDistinctByItemsProductFarmer(User farmer);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o")
    java.math.BigDecimal sumTotalRevenue();
}
