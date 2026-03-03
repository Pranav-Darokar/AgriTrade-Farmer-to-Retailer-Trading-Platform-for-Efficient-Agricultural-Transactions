package com.farmtrade.backend.service;

import com.farmtrade.backend.dto.PaymentDetails;
import com.farmtrade.backend.dto.PaymentVerificationRequest;
import com.farmtrade.backend.model.Order;
import com.farmtrade.backend.model.PaymentStatus;
import com.farmtrade.backend.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    public PaymentDetails createRazorpayOrder(Order order) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        // Razorpay expects amount in paise (1 INR = 100 paise)
        orderRequest.put("amount", order.getTotalAmount().multiply(new java.math.BigDecimal(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcptid_" + order.getId());

        com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);

        order.setRazorpayOrderId(razorpayOrder.get("id"));
        order.setPaymentStatus(PaymentStatus.PENDING);
        orderRepository.save(order);

        return new PaymentDetails(
                order.getId().toString(),
                razorpayOrder.get("id"),
                order.getTotalAmount(),
                "INR",
                razorpayKeyId);
    }

    @Transactional
    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", verificationRequest.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", verificationRequest.getRazorpayPaymentId());
            attributes.put("razorpay_signature", verificationRequest.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (isValid) {
                Order order = orderRepository.findByRazorpayOrderId(verificationRequest.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Order not found with Razorpay Order ID"));

                order.setRazorpayPaymentId(verificationRequest.getRazorpayPaymentId());
                order.setRazorpaySignature(verificationRequest.getRazorpaySignature());
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                orderRepository.save(order);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
