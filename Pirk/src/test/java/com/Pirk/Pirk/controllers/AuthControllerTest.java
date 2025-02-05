package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.dto.JwtResponse;
import com.Pirk.Pirk.dto.LoginRequest;
import com.Pirk.Pirk.dto.RegisterRequest;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.security.JwtTokenProviderInterface;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProviderInterface jwtTokenProvider;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User existingUser;
    private Validator validator;

    @BeforeEach
    void setUp() {
        // Setup validator
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        // Setup valid registration request
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUsername("testuser");
        validRegisterRequest.setEmail("test@example.com");
        validRegisterRequest.setPassword("password123");

        // Setup valid login request
        validLoginRequest = new LoginRequest();
        validLoginRequest.setUsername("testuser");
        validLoginRequest.setPassword("password123");

        // Setup existing user
        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setEmail("test@example.com");
        existingUser.setPassword("encodedPassword");
        existingUser.setRole(User.Role.USER);

        // Default mock behavior
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtTokenProvider.generateToken(anyString(), any())).thenReturn("valid.jwt.token");
    }

    // Registration Validation Tests

    @Test
    void whenRegisterWithShortUsername_thenValidationFails() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setUsername("ab"); // Less than min length 3
        request.setEmail("test@example.com");
        request.setPassword("password123");

        // When
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    void whenRegisterWithLongUsername_thenValidationFails() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setUsername("a".repeat(51)); // More than max length 50
        request.setEmail("test@example.com");
        request.setPassword("password123");

        // When
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "invalid.email",
        "@nodomain",
        "noat.com",
        "@.com",
        "space @domain.com"
    })
    void whenRegisterWithInvalidEmail_thenValidationFails(String invalidEmail) {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail(invalidEmail);
        request.setPassword("password123");

        // When
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void whenRegisterWithShortPassword_thenValidationFails() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("short"); // Less than min length 8

        // When
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void whenRegisterWithNullFields_thenValidationFails() {
        // Given
        RegisterRequest request = new RegisterRequest();

        // When
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        // Then
        assertEquals(3, violations.size()); // username, email, and password are all required
    }

    // Login Validation Tests

    @Test
    void whenLoginWithNullUsername_thenValidationFails() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setPassword("password123");

        // When
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    void whenLoginWithNullPassword_thenValidationFails() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");

        // When
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    // Registration Tests

    @Test
    void whenRegisterWithValidData_thenSuccess() {
        // Given
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // When
        String response = authController.register(validRegisterRequest);

        // Then
        assertEquals("User registered successfully!", response);
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode(validRegisterRequest.getPassword());
    }

    @Test
    void whenRegisterWithExistingUsername_thenFail() {
        // Given
        when(userRepository.findByUsername(validRegisterRequest.getUsername()))
            .thenReturn(Optional.of(existingUser));

        // When
        String response = authController.register(validRegisterRequest);

        // Then
        assertEquals("Username already exists", response);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void whenRegisterWithExistingEmail_thenFail() {
        // Given
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(validRegisterRequest.getEmail()))
            .thenReturn(Optional.of(existingUser));

        // When
        String response = authController.register(validRegisterRequest);

        // Then
        assertEquals("Email already exists", response);
        verify(userRepository, never()).save(any(User.class));
    }

    // Login Tests

    @Test
    void whenLoginWithValidCredentials_thenReturnToken() {
        // Given
        when(userRepository.findByUsername(validLoginRequest.getUsername()))
            .thenReturn(Optional.of(existingUser));

        // When
        JwtResponse response = authController.login(validLoginRequest);

        // Then
        assertNotNull(response);
        assertEquals("valid.jwt.token", response.getToken());
        verify(passwordEncoder).matches(validLoginRequest.getPassword(), existingUser.getPassword());
        verify(jwtTokenProvider).generateToken(eq(existingUser.getUsername()), any());
    }

    @Test
    void whenLoginWithNonExistentUsername_thenThrowException() {
        // Given
        when(userRepository.findByUsername(validLoginRequest.getUsername()))
            .thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authController.login(validLoginRequest);
        });

        assertEquals("Invalid credentials", exception.getMessage());
        verify(jwtTokenProvider, never()).generateToken(anyString(), any());
    }

    @Test
    void whenLoginWithIncorrectPassword_thenThrowException() {
        // Given
        when(userRepository.findByUsername(validLoginRequest.getUsername()))
            .thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authController.login(validLoginRequest);
        });

        assertEquals("Invalid credentials", exception.getMessage());
        verify(jwtTokenProvider, never()).generateToken(anyString(), any());
    }

    @Test
    void whenLoginSuccessful_thenGenerateTokenWithCorrectRole() {
        // Given
        when(userRepository.findByUsername(validLoginRequest.getUsername()))
            .thenReturn(Optional.of(existingUser));

        // When
        authController.login(validLoginRequest);

        // Then
        verify(jwtTokenProvider).generateToken(
            eq(existingUser.getUsername()),
            eq(List.of(User.Role.USER.toString()))
        );
    }

    // Security Tests

    @Test
    void whenRegisterWithSQLInjection_thenSanitized() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user' OR '1'='1");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When
        authController.register(request);

        // Then
        verify(userRepository).save(argThat(user -> 
            user.getUsername().equals("user' OR '1'='1") // Should be treated as literal string
        ));
    }

    @Test
    void whenLoginWithSQLInjection_thenSanitized() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setUsername("admin' --");
        request.setPassword("anything");

        when(userRepository.findByUsername(request.getUsername()))
            .thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authController.login(request);
        });
    }

    // Exception Handling Tests

    @Test
    void whenRuntimeException_thenHandleGracefully() {
        // When
        String response = authController.handleRuntimeException(
            new RuntimeException("Test error")
        );

        // Then
        assertEquals("Error: Test error", response);
    }

    @Test
    void whenGenericException_thenHandleGracefully() {
        // When
        String response = authController.handleException(
            new Exception("Test error")
        );

        // Then
        assertEquals("An error occurred: Test error", response);
    }

    @Test
    void whenPasswordEncryptionFails_thenHandleGracefully() {
        // Given
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenThrow(new RuntimeException("Encryption failed"));

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authController.register(validRegisterRequest);
        });

        assertEquals("Error: Encryption failed", authController.handleRuntimeException((RuntimeException) exception));
    }
}
