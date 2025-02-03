package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class PaymentInfoService {

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    // Method to retrieve a PaymentInfo by ID
    public Optional<PaymentInfo> getPaymentInfo(Long id) {
        return paymentInfoRepository.findById(id);
    }

    // Method to retrieve all PaymentInfo entries
    public List<PaymentInfo> getAllPaymentInfo() {
        return paymentInfoRepository.findAll();
    }

    // You can add more methods as needed
}
