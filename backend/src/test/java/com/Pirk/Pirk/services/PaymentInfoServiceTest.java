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

import java.math.BigDecimal;
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
    private static final BigDecimal ORDER_AMOUNT = BigDecimal.valueOf(100.00);

    @BeforeEach
    void setUp() {
        // Create a valid payment request
        String expDate = YearMonth.now().plusMonths(1).format(DateTimeFormatter.ofPattern("MM/yy"));
        validPaymentRequest = PaymentRequest.builder()
            
            .cardNumber("4532015112830366") // Valid card number that passes Luhn algorithm
            .expirationDate(expDate)
            .cvv("123")
            .orderId(ORDER_ID)
            .amount(ORDER_AMOUNT)
            .build();
        validPaymentRequest.setBuyerId(BUYER_ID);

        // Set up test order
        testOrder = new Order();
        testOrder.setId(ORDER_ID);
        testOrder.setTotalAmount(ORDER_AMOUNT);

        // Set up test payment info
        testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setPaymentStatus("COMPLETED");
        testPaymentInfo.setOrder(testOrder);
        testPaymentInfo.setBuyerId(BUYER_ID);
        testPaymentInfo.setAmount(ORDER_AMOUNT);
        testPaymentInfo.setPaymentMethod("CREDIT_CARD");
    }

    @Test
    void whenProcessPaymentWithValidCard_thenSuccess() {
        // Arrange
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(testOrder));
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(testPaymentInfo);
        when(paymentInfoRepository.findByOrderId(ORDER_ID)).thenReturn(List.of());

        // Act
        PaymentInfo result = paymentInfoService.processPayment(validPaymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals("COMPLETED", result.getPaymentStatus());
        assertEquals(ORDER_AMOUNT, result.getAmount());
        assertEquals("CREDIT_CARD", result.getPaymentMethod());
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
    void whenProcessPaymentWithInvalidAmount_thenThrowException() {
        // Arrange
        validPaymentRequest.setAmount(BigDecimal.valueOf(200.00)); // Different from order amount
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(testOrder));

        // Act & Assert
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }

    @Test
    void whenProcessPaymentWithExistingPayment_thenThrowException() {
        // Arrange
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(testOrder));
        when(paymentInfoRepository.findByOrderId(ORDER_ID)).thenReturn(List.of(testPaymentInfo));

        // Act & Assert
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(validPaymentRequest);
        });

        verify(paymentInfoRepository, never()).save(any(PaymentInfo.class));
    }
}
