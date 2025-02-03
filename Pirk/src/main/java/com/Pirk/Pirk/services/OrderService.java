package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.OrderRepository;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    @Transactional
    public void submitOrder(Order order) {
        // Validate order (optional but recommended)
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        // Retrieve payment info from the order
        PaymentInfo paymentInfo = order.getPaymentInfo();
        
        if (paymentInfo != null) {
            // Save the PaymentInfo object
            logger.info("Saving payment information...");
            paymentInfoRepository.save(paymentInfo);
            
            // Associate the saved PaymentInfo object with the Order
            order.setPaymentInfo(paymentInfo);
        }

        // Save the Order object
        logger.info("Saving order...");
        orderRepository.save(order);

        logger.info("Order submission completed successfully.");
    }
}
