package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentInfoServiceTest {

    @Mock
    private PaymentInfoRepository paymentInfoRepository;

    @InjectMocks
    private PaymentInfoService paymentInfoService;

    private PaymentInfo paymentInfo1;
    private PaymentInfo paymentInfo2;
    private Long orderId;

    @BeforeEach
    void setUp() {
        orderId = 1L;
        paymentInfo1 = new PaymentInfo();
        Order order1 = new Order();
        order1.setId(orderId);
        paymentInfo1.setOrder(order1);

        paymentInfo2 = new PaymentInfo();
        Order order2 = new Order();
        order2.setId(orderId);
        paymentInfo2.setOrder(order2);
    }

    @Test
    void testGetPaymentInfoByOrderId() {
        // Arrange
        when(paymentInfoRepository.findByOrderId(orderId)).thenReturn(List.of(paymentInfo1, paymentInfo2));

        // Act
        List<PaymentInfo> result = paymentInfoService.getPaymentInfoByOrderId(orderId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(orderId, result.get(0).getOrder().getId());
        assertEquals(orderId, result.get(1).getOrder().getId());
    }

    @Test
    void testGetPaymentInfoById() {
        // Arrange
        when(paymentInfoRepository.findById(orderId)).thenReturn(Optional.of(paymentInfo1));

        // Act
        Optional<PaymentInfo> result = paymentInfoService.getPaymentInfo(orderId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(paymentInfo1, result.get());
    }

    @Test
    void testProcessPayment_Declined() {
        // Arrange
        PaymentRequest paymentRequest = new PaymentRequest("John Doe", "4111111111111111", "12/25", "123", orderId);
        
        // Act & Assert
        PaymentDeclinedException exception = assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(paymentRequest);
        });

        assertEquals("Payment was declined. Please check your card details and try again.", exception.getMessage());
        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void testProcessPayment_Approved() {
        // Arrange
        PaymentRequest paymentRequest = new PaymentRequest("John Doe", "4111111111111112", "12/25", "123", orderId);
        PaymentInfo savedPaymentInfo = new PaymentInfo();
        savedPaymentInfo.setPaymentStatus("COMPLETED");
        
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(savedPaymentInfo);

        // Act
        PaymentInfo result = paymentInfoService.processPayment(paymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals("COMPLETED", result.getPaymentStatus());
        verify(paymentInfoRepository).save(any(PaymentInfo.class));
    }
}