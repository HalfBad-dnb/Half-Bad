package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
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

    @BeforeEach
    void setUp() {
        testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setId(1L);
        testPaymentInfo.setCardNumber("4111111111111111");
        testPaymentInfo.setExpirationDate("12/25");
        testPaymentInfo.setCvv("123");
    }

    @Test
    void whenGetPaymentInfoWithValidId_thenReturnPaymentInfo() {
        // Given
        when(paymentInfoRepository.findById(1L)).thenReturn(Optional.of(testPaymentInfo));

        // When
        Optional<PaymentInfo> result = paymentInfoService.getPaymentInfo(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testPaymentInfo.getCardNumber(), result.get().getCardNumber());
        assertEquals(testPaymentInfo.getExpirationDate(), result.get().getExpirationDate());
        assertEquals(testPaymentInfo.getCvv(), result.get().getCvv());
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
        secondPaymentInfo.setCardNumber("5555555555554444");
        secondPaymentInfo.setExpirationDate("01/26");
        secondPaymentInfo.setCvv("456");

        List<PaymentInfo> expectedList = Arrays.asList(testPaymentInfo, secondPaymentInfo);
        when(paymentInfoRepository.findAll()).thenReturn(expectedList);

        // When
        List<PaymentInfo> result = paymentInfoService.getAllPaymentInfo();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testPaymentInfo.getCardNumber(), result.get(0).getCardNumber());
        assertEquals(secondPaymentInfo.getCardNumber(), result.get(1).getCardNumber());
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
}
