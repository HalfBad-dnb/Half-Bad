package services;

import com.Pirk.Pirk.models.Newsletter;
import com.Pirk.Pirk.repositories.NewsletterRepository;
import com.Pirk.Pirk.services.NewsletterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;

public class NewsletterServiceTest {

    @Mock
    private NewsletterRepository newsletterRepository;

    @InjectMocks
    private NewsletterService newsletterService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSubscribeUser_AlreadySubscribed() {
        // Arrange
        String email = "test@example.com";
        Mockito.when(newsletterRepository.existsByEmail(anyString())).thenReturn(true);

        // Act
        boolean result = newsletterService.subscribeUser(email);

        // Assert
        assertFalse(result, "User should not be subscribed again if already subscribed");
        Mockito.verify(newsletterRepository, Mockito.never()).save(Mockito.any(Newsletter.class));
    }

    @Test
    public void testSubscribeUser_NewSubscription() {
        // Arrange
        String email = "new@example.com";
        Mockito.when(newsletterRepository.existsByEmail(anyString())).thenReturn(false);
        Mockito.when(newsletterRepository.save(Mockito.any(Newsletter.class))).thenReturn(new Newsletter(email));

        // Act
        boolean result = newsletterService.subscribeUser(email);

        // Assert
        assertTrue(result, "New user should be successfully subscribed");
        Mockito.verify(newsletterRepository, Mockito.times(1)).save(Mockito.any(Newsletter.class));
    }

    @Test
    public void testGetSubscription_Exists() {
        // Arrange
        String email = "test@example.com";
        Newsletter newsletter = new Newsletter(email);
        Mockito.when(newsletterRepository.findByEmail(anyString())).thenReturn(Optional.of(newsletter));

        // Act
        Optional<Newsletter> result = newsletterService.getSubscription(email);

        // Assert
        assertTrue(result.isPresent(), "Subscription should exist");
        assertEquals(email, result.get().getEmail(), "The email should match");
    }

    @Test
    public void testGetSubscription_NotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        Mockito.when(newsletterRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        Optional<Newsletter> result = newsletterService.getSubscription(email);

        // Assert
        assertFalse(result.isPresent(), "Subscription should not exist for a non-existent email");
    }

    @Test
    public void testUnsubscribeUser_Exists() {
        // Arrange
        String email = "test@example.com";
        Newsletter newsletter = new Newsletter(email);
        Mockito.when(newsletterRepository.findByEmail(anyString())).thenReturn(Optional.of(newsletter));

        // Act
        boolean result = newsletterService.unsubscribeUser(email);

        // Assert
        assertTrue(result, "User should be unsubscribed successfully");
        Mockito.verify(newsletterRepository, Mockito.times(1)).delete(newsletter);
    }

    @Test
    public void testUnsubscribeUser_NotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        Mockito.when(newsletterRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act
        boolean result = newsletterService.unsubscribeUser(email);

        // Assert
        assertFalse(result, "Unsubscribing should fail for a non-existent email");
        Mockito.verify(newsletterRepository, Mockito.never()).delete(Mockito.any(Newsletter.class));
    }
}
