package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Cart;
import com.Pirk.Pirk.models.Checkout;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.CheckoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class CheckoutServiceTest {

    @Mock
    private CheckoutRepository checkoutRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private User testUser;
    private Cart testCart;
    private Checkout testCheckout;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        // Setup test cart
        testCart = new Cart();
        testCart.setId(1L);
        testCart.setTotalPrice(100.0); // Set a test total price

        // Setup test checkout
        testCheckout = new Checkout();
        testCheckout.setId(1L);
        testCheckout.setUser(testUser);
        testCheckout.setCart(testCart);
        testCheckout.setTotalAmount(100.0);
        testCheckout.setPaymentMethod("Credit Card");
        testCheckout.setShippingAddress("123 Test St");
        testCheckout.setOrderStatus("Pending");
        testCheckout.setPaymentStatus("Pending");
    }

    @Test
    void whenCreateCheckout_thenSucceed() {
        // Given
        when(checkoutRepository.save(any(Checkout.class))).thenReturn(testCheckout);

        // Create a new Checkout object with the test data
        Checkout newCheckout = new Checkout();
        newCheckout.setUser(testUser);
        newCheckout.setCart(testCart);
        newCheckout.setPaymentMethod("Credit Card");
        newCheckout.setShippingAddress("123 Test St");

        // When
        Checkout result = checkoutService.createCheckout(newCheckout);

        // Then
        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertEquals(testCart, result.getCart());
        assertEquals(100.0, result.getTotalAmount());
        assertEquals("Credit Card", result.getPaymentMethod());
        assertEquals("123 Test St", result.getShippingAddress());
        assertEquals("Pending", result.getOrderStatus());
        assertEquals("Pending", result.getPaymentStatus());
        
        verify(checkoutRepository).save(any(Checkout.class));
    }

    @Test
    void whenGetCheckoutById_thenReturnCheckout() {
        // Given
        when(checkoutRepository.findById(1L)).thenReturn(Optional.of(testCheckout));

        // When
        Checkout result = checkoutService.getCheckoutById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testCheckout.getId(), result.getId());
        assertEquals(testCheckout.getUser(), result.getUser());
        assertEquals(testCheckout.getCart(), result.getCart());
        verify(checkoutRepository).findById(1L);
    }

    @Test
    void whenGetCheckoutByInvalidId_thenReturnNull() {
        // Given
        when(checkoutRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Checkout result = checkoutService.getCheckoutById(999L);

        // Then
        assertNull(result);
        verify(checkoutRepository).findById(999L);
    }

    @Test
    void whenUpdateCheckoutStatus_thenSucceed() {
        // Given
        String newStatus = "Completed";
        when(checkoutRepository.findById(1L)).thenReturn(Optional.of(testCheckout));
        when(checkoutRepository.save(any(Checkout.class))).thenReturn(testCheckout);

        // When
        Checkout result = checkoutService.updateCheckoutStatus(1L, newStatus);

        // Then
        assertNotNull(result);
        assertEquals(newStatus, result.getOrderStatus());
        verify(checkoutRepository).findById(1L);
        verify(checkoutRepository).save(any(Checkout.class));
    }

    @Test
    void whenUpdateCheckoutStatusWithInvalidId_thenReturnNull() {
        // Given
        when(checkoutRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Checkout result = checkoutService.updateCheckoutStatus(999L, "Completed");

        // Then
        assertNull(result);
        verify(checkoutRepository).findById(999L);
        verify(checkoutRepository, never()).save(any(Checkout.class));
    }

    @Test
    void whenCreateCheckoutWithZeroAmount_thenSucceed() {
        // Given
        testCart.setTotalPrice(0.0);
        testCheckout.setTotalAmount(0.0);
        testCheckout.setUser(testUser);
        testCheckout.setCart(testCart);
        testCheckout.setPaymentMethod("Credit Card");
        testCheckout.setShippingAddress("123 Test St");
        
        when(checkoutRepository.save(any(Checkout.class))).thenReturn(testCheckout);

        // When
        Checkout result = checkoutService.createCheckout(testCheckout);

        // Then
        assertNotNull(result);
        assertEquals(0.0, result.getTotalAmount());
        verify(checkoutRepository).save(any(Checkout.class));
    }
}
