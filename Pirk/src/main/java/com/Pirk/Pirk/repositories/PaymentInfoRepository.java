package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
    List<PaymentInfo> findByOrderId(Long orderId);
    // Custom queries can be added here if necessary
}