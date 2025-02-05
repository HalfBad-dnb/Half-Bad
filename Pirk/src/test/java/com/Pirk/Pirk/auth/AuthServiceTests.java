package com.Pirk.Pirk.auth;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "encodedPassword123";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername(TEST_USERNAME);
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(ENCODED_PASSWORD);
        testUser.setRole(User.Role.USER);

        // Setup default mock behaviors
        when(passwordEncoder.encode(anyString())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
    }

    @Test
    void whenRegisterUser_thenSucceed() {
        // When
        User registeredUser = userService.registerUser(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);

        // Then
        assertNotNull(registeredUser);
        assertEquals(TEST_USERNAME, registeredUser.getUsername());
        assertEquals(TEST_EMAIL, registeredUser.getEmail());
        assertEquals(ENCODED_PASSWORD, registeredUser.getPassword());
        assertEquals(User.Role.USER, registeredUser.getRole());

        verify(passwordEncoder).encode(TEST_PASSWORD);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenRegisterUser_thenPasswordIsEncoded() {
        // When
        userService.registerUser(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);

        // Then
        verify(passwordEncoder).encode(TEST_PASSWORD);
    }

    @Test
    void whenGetUserById_thenReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        User foundUser = userService.getUserById(1L);

        // Then
        assertNotNull(foundUser);
        assertEquals(TEST_USERNAME, foundUser.getUsername());
        assertEquals(TEST_EMAIL, foundUser.getEmail());
        verify(userRepository).findById(1L);
    }

    @Test
    void whenGetUserByIdNotFound_thenThrowException() {
        // Given
        Long nonExistentUserId = 999L;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(nonExistentUserId);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findById(nonExistentUserId);
    }

    @Test
    void whenRegisterUser_thenRoleIsUser() {
        // When
        User registeredUser = userService.registerUser(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);

        // Then
        assertEquals(User.Role.USER, registeredUser.getRole());
    }

    @Test
    void whenRegisterUserWithNullValues_thenThrowException() {
        // Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(null, TEST_EMAIL, TEST_PASSWORD);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(TEST_USERNAME, null, TEST_PASSWORD);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(TEST_USERNAME, TEST_EMAIL, null);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}
