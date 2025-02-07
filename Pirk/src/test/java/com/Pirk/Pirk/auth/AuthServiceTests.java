package com.Pirk.Pirk.auth;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

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
    }

    @Test
    void whenRegisterUser_thenSucceed() {
        // Given
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

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
        // Given
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

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
        assertEquals("User not found with id: " + nonExistentUserId, exception.getMessage());
    }

    @Test
    void whenRegisterUser_thenRoleIsUser() {
        // Given
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User registeredUser = userService.registerUser(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);

        // Then
        assertEquals(User.Role.USER, registeredUser.getRole());
    }

    @Test
    void whenRegisterUserWithNullValues_thenThrowException() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(null, TEST_EMAIL, TEST_PASSWORD);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(TEST_USERNAME, null, TEST_PASSWORD);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(TEST_USERNAME, TEST_EMAIL, null);
        });
    }
}
