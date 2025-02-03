package com.Pirk.Pirk.Controllers;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.services.PaymentInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class PaymentInfoController {

    @Autowired
    private PaymentInfoService paymentInfoService;

    @GetMapping("/paymentInfo/{id}")
    public Optional<PaymentInfo> getPaymentInfo(@PathVariable Long id) {
        return paymentInfoService.getPaymentInfo(id);
    }
}
