package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.repositories.OrderRepository;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentInfoServiceTest {

    @Mock
    private PaymentInfoRepository paymentInfoRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private PaymentInfoService paymentInfoService;

    private PaymentRequest validPaymentRequest;
    private Order testOrder;
    private PaymentInfo testPaymentInfo;
    private static final Long ORDER_ID = 1L;
    private static final Long BUYER_ID = 1L;

    @BeforeEach
    void setUp() {
        // Create a valid payment request
        String expDate = YearMonth.now().plusMonths(1).format(DateTimeFormatter.ofPattern("MM/yy"));
        validPaymentRequest = new PaymentRequest(
            "John Doe",
            "4532015112830366", // Valid card number that passes Luhn algorithm
            expDate,
            "123",
            ORDER_ID
        );
        validPaymentRequest.setBuyerId(BUYER_ID);

        // Set up test order
        testOrder = new Order();
        testOrder.setId(ORDER_ID);

        // Set up test payment info
        testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setPaymentStatus("COMPLETED");
        testPaymentInfo.setOrder(testOrder);
        testPaymentInfo.setBuyerId(BUYER_ID);
    }

    @Test
    void whenProcessPaymentWithValidCard_thenSuccess() {
        // Arrange
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(testOrder));
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(testPaymentInfo);

        // Act
        PaymentInfo result = paymentInfoService.processPayment(validPaymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals("COMPLETED", result.getPaymentStatus());
        verify(paymentInfoRepository).save(any(PaymentInfo.class));
        verify(orderRepository).findById(ORDER_ID);
    }

    @Test
    void whenProcessPaymentWithInvalidCard_thenThrowException() {
        // Arrange
        validPaymentRequest.setCardNumber("1234567890123"); // Invalid card number

        // Act & Assert
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void whenProcessPaymentWithExpiredCard_thenThrowException() {
        // Arrange
        validPaymentRequest.setExpirationDate("01/20"); // Expired date

        // Act & Assert
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void whenProcessPaymentWithInvalidCVV_thenThrowException() {
        // Arrange
        validPaymentRequest.setCvv("12"); // Invalid CVV (too short)

        // Act & Assert
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void whenOrderNotFound_thenThrowException() {
        // Arrange
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void whenGetPaymentInfoByOrderId_thenSuccess() {
        // Arrange
        List<PaymentInfo> expectedPayments = List.of(testPaymentInfo);
        when(paymentInfoRepository.findByOrderId(ORDER_ID)).thenReturn(expectedPayments);

        // Act
        List<PaymentInfo> result = paymentInfoService.getPaymentInfoByOrderId(ORDER_ID);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testPaymentInfo, result.get(0));
    }

    @Test
    void whenGetPaymentInfoById_thenSuccess() {
        // Arrange
        when(paymentInfoRepository.findById(1L)).thenReturn(Optional.of(testPaymentInfo));

        // Act
        Optional<PaymentInfo> result = paymentInfoService.getPaymentInfo(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testPaymentInfo, result.get());
    }
}