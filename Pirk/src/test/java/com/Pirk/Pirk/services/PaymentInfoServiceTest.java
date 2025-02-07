package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.PaymentInfo;
import com.Pirk.Pirk.models.PaymentRequest;
import com.Pirk.Pirk.models.Order;
import com.Pirk.Pirk.repositories.PaymentInfoRepository;
import com.Pirk.Pirk.exceptions.PaymentDeclinedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentInfoServiceTest {

    @Mock
    private PaymentInfoRepository paymentInfoRepository;

    @Mock
    private OrderServiceInterface orderService;

    @InjectMocks
    private PaymentInfoService paymentInfoService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGetAllPaymentInfo() {
        // Create test data
        Order testOrder = new Order();
        testOrder.setId(1L);

        PaymentInfo testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setId(1L);
        testPaymentInfo.setOrder(testOrder);
        testPaymentInfo.setBuyerId(1L);
        testPaymentInfo.setCardholderName("John Doe");
        testPaymentInfo.setPaymentStatus("COMPLETED");

        List<PaymentInfo> expectedPayments = new ArrayList<>();
        expectedPayments.add(testPaymentInfo);

        // Mock repository behavior
        when(paymentInfoRepository.findAll()).thenReturn(expectedPayments);

        // Test the service method
        List<PaymentInfo> actualPayments = paymentInfoService.getAllPaymentInfo();

        // Verify the results
        assertEquals(expectedPayments.size(), actualPayments.size());
        assertEquals(expectedPayments.get(0).getId(), actualPayments.get(0).getId());
        verify(paymentInfoRepository, times(1)).findAll();
    }

    @Test
    void testGetPaymentInfoById() {
        // Create test data
        Order testOrder = new Order();
        testOrder.setId(1L);

        PaymentInfo testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setId(1L);
        testPaymentInfo.setOrder(testOrder);
        testPaymentInfo.setBuyerId(1L);
        testPaymentInfo.setCardholderName("John Doe");
        testPaymentInfo.setPaymentStatus("COMPLETED");

        // Mock repository behavior
        when(paymentInfoRepository.findById(1L)).thenReturn(Optional.of(testPaymentInfo));

        // Test the service method
        Optional<PaymentInfo> actualPayment = paymentInfoService.getPaymentInfoById(1L);

        // Verify the results
        assertTrue(actualPayment.isPresent());
        assertEquals(testPaymentInfo.getId(), actualPayment.get().getId());
        verify(paymentInfoRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPaymentInfoByOrderId() {
        // Create test data
        Order testOrder = new Order();
        testOrder.setId(1L);

        PaymentInfo testPaymentInfo = new PaymentInfo();
        testPaymentInfo.setId(1L);
        testPaymentInfo.setOrder(testOrder);
        testPaymentInfo.setBuyerId(1L);
        testPaymentInfo.setCardholderName("John Doe");
        testPaymentInfo.setPaymentStatus("COMPLETED");

        Order secondOrder = new Order();
        secondOrder.setId(2L);

        PaymentInfo secondPaymentInfo = new PaymentInfo();
        secondPaymentInfo.setId(2L);
        secondPaymentInfo.setOrder(secondOrder);
        secondPaymentInfo.setBuyerId(2L);
        secondPaymentInfo.setCardholderName("Jane Doe");
        secondPaymentInfo.setPaymentStatus("COMPLETED");

        List<PaymentInfo> allPayments = new ArrayList<>();
        allPayments.add(testPaymentInfo);
        allPayments.add(secondPaymentInfo);

        // Mock repository behavior
        when(paymentInfoRepository.findAll()).thenReturn(allPayments);

        // Test the service method
        List<PaymentInfo> actualPayments = paymentInfoService.getPaymentInfoByOrderId(1L);

        // Verify the results
        assertEquals(1, actualPayments.size());
        assertEquals(testPaymentInfo.getId(), actualPayments.get(0).getId());
        verify(paymentInfoRepository, times(1)).findAll();
    }

    @Test
    void testProcessPayment_Success() {
        // Create test data
        Order testOrder = new Order();
        testOrder.setId(1L);

        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setBuyerId(1L);
        request.setCardholderName("John Doe");
        request.setCardNumber("4111111111111112"); // Card ending in even number (2) for approval
        request.setExpirationDate("12/25"); // Valid future date
        request.setCvv("123");

        PaymentInfo successPayment = new PaymentInfo();
        successPayment.setId(1L);
        successPayment.setOrder(testOrder);
        successPayment.setBuyerId(1L);
        successPayment.setCardholderName("John Doe");
        successPayment.setPaymentStatus("COMPLETED");

        // Mock service and repository behavior
        when(orderService.getOrderById(1L)).thenReturn(testOrder);
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(successPayment);

        // Test the service method
        PaymentInfo result = paymentInfoService.processPayment(request);

        // Verify the results
        assertNotNull(result);
        assertEquals("COMPLETED", result.getPaymentStatus());
        verify(paymentInfoRepository, times(1)).save(any(PaymentInfo.class));
    }

    @Test
    void testProcessPayment_Failure() {
        // Create test data
        Order testOrder = new Order();
        testOrder.setId(1L);

        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setBuyerId(1L);
        request.setCardholderName("John Doe");
        request.setCardNumber("4111111111111113"); // Card ending in odd number (3) for decline
        request.setExpirationDate("12/25"); // Valid future date
        request.setCvv("123");

        PaymentInfo failedPayment = new PaymentInfo();
        failedPayment.setId(1L);
        failedPayment.setOrder(testOrder);
        failedPayment.setBuyerId(1L);
        failedPayment.setCardholderName("John Doe");
        failedPayment.setPaymentStatus("FAILED");

        // Mock service and repository behavior
        when(orderService.getOrderById(1L)).thenReturn(testOrder);
        when(paymentInfoRepository.save(any(PaymentInfo.class))).thenReturn(failedPayment);
        
        // Test the service method and expect an exception
        assertThrows(PaymentDeclinedException.class, () -> {
            paymentInfoService.processPayment(request);
        });

        // Verify that save was called with a failed payment
        verify(paymentInfoRepository, times(1)).save(any(PaymentInfo.class));
    }
}
