package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class PaymentInfoServiceTest {

    @Mock
    private PaymentInfoRepository paymentInfoRepository;

    @InjectMocks
    private PaymentInfoService paymentInfoService;

    private PaymentInfo testPaymentInfo;
    private PaymentRequest testPaymentRequest;

    @BeforeEach
    void setUp() {
        testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setId(1L);
        testPaymentInfo.setCardholderName("John Doe");
        testPaymentInfo.setLastFourDigits("1111");
        testPaymentInfo.setOrderId(1L);
        testPaymentInfo.setPaymentStatus("COMPLETED");

        testPaymentRequest = new PaymentRequest();
        testPaymentRequest.setCardNumber("4111111111111111");
        testPaymentRequest.setExpirationDate("12/25");
        testPaymentRequest.setCvv("123");
        testPaymentRequest.setCardholderName("John Doe");
        testPaymentRequest.setOrderId(1L);
        testPaymentRequest.setBuyerId(1L);
    }

    @Test
    void whenGetPaymentInfoWithValidId_thenReturnPaymentInfo() {
        // Given
        when(paymentInfoRepository.findById(1L)).thenReturn(Optional.of(testPaymentInfo));

        // When
        Optional<PaymentInfo> result = paymentInfoService.getPaymentInfo(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testPaymentInfo.getCardholderName(), result.get().getCardholderName());
        assertEquals(testPaymentInfo.getLastFourDigits(), result.get().getLastFourDigits());
        assertEquals(testPaymentInfo.getOrderId(), result.get().getOrderId());
        verify(paymentInfoRepository).findById(1L);
    }

    @Test
    void whenGetPaymentInfoWithInvalidId_thenReturnEmpty() {
        // Given
        when(paymentInfoRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<PaymentInfo> result = paymentInfoService.getPaymentInfo(999L);

        // Then
        assertFalse(result.isPresent());
        verify(paymentInfoRepository).findById(999L);
    }

    @Test
    void whenGetAllPaymentInfo_thenReturnList() {
        // Given
        PaymentInfo secondPaymentInfo = new PaymentInfo();
        secondPaymentInfo.setId(2L);
        secondPaymentInfo.setCardholderName("Jane Doe");
        secondPaymentInfo.setLastFourDigits("4444");
        secondPaymentInfo.setOrderId(2L);
        secondPaymentInfo.setPaymentStatus("COMPLETED");

        List<PaymentInfo> expectedList = Arrays.asList(testPaymentInfo, secondPaymentInfo);
        when(paymentInfoRepository.findAll()).thenReturn(expectedList);

        // When
        List<PaymentInfo> result = paymentInfoService.getAllPaymentInfo();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testPaymentInfo.getCardholderName(), result.get(0).getCardholderName());
        assertEquals(secondPaymentInfo.getCardholderName(), result.get(1).getCardholderName());
        verify(paymentInfoRepository).findAll();
    }

    @Test
    void whenGetAllPaymentInfo_thenReturnEmptyList() {
        // Given
        when(paymentInfoRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<PaymentInfo> result = paymentInfoService.getAllPaymentInfo();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(paymentInfoRepository).findAll();
    }

    @Test
    void whenProcessPayment_withTestCard_thenReturnSuccessfulPayment() {
        // Given
        PaymentInfo successPayment = new PaymentInfo();
        successPayment.setCardholderName("John Doe");
        successPayment.setLastFourDigits("1111");
        successPayment.setOrderId(1L);
        successPayment.setPaymentStatus("COMPLETED");
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(successPayment);

        // When
        PaymentInfo result = paymentInfoService.processPayment(testPaymentRequest);

        // Then
        assertNotNull(result);
        assertEquals("COMPLETED", result.getPaymentStatus());
        assertEquals("1111", result.getLastFourDigits());
        assertEquals("John Doe", result.getCardholderName());
        verify(paymentInfoRepository).save(any(PaymentInfo.class));
    }

    @Test
    void whenProcessPayment_withDeclinedCard_thenThrowException() {
        // Given
        testPaymentRequest.setCardNumber("4111111111111112"); // Card that will be declined
        PaymentInfo failedPayment = new PaymentInfo();
        failedPayment.setCardholderName("John Doe");
        failedPayment.setLastFourDigits("1112");
        failedPayment.setOrderId(1L);
        failedPayment.setPaymentStatus("FAILED");
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(failedPayment);

        // When & Then
        Exception exception = assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(testPaymentRequest);
        });
        
        assertEquals("Payment declined by gateway", exception.getMessage());
        verify(paymentInfoRepository).save(any(PaymentInfo.class));
    }
}
