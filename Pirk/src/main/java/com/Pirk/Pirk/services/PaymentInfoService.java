package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;

    @Autowired
    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public Optional<PaymentInfo> getPaymentInfo(Long id) {
        return paymentInfoRepository.findById(id);
    }

    public List<PaymentInfo> getAllPaymentInfo() {
        return paymentInfoRepository.findAll();
    }

    public PaymentInfo processPayment(PaymentInfo paymentInfo) {
        // Here you would typically integrate with a payment gateway
        // For now, we'll just save the payment info
        return paymentInfoRepository.save(paymentInfo);
    }

    public PaymentInfo updatePaymentInfo(Long id, PaymentInfo paymentInfo) {
        PaymentInfo existingPaymentInfo = getPaymentInfo(id)
            .orElseThrow(() -> new RuntimeException("Payment info not found"));
        
        // Update the fields
        existingPaymentInfo.setCardNumber(paymentInfo.getCardNumber());
        existingPaymentInfo.setExpirationDate(paymentInfo.getExpirationDate());
        existingPaymentInfo.setCvv(paymentInfo.getCvv());
        
        return paymentInfoRepository.save(existingPaymentInfo);
    }

    public void deletePaymentInfo(Long id) {
        paymentInfoRepository.deleteById(id);
    }
}
