package com.Pirk.Pirk.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.Pirk.Pirk.dto.JwtResponse;
import com.Pirk.Pirk.dto.LoginRequest;
import com.Pirk.Pirk.dto.RegisterRequest;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.security.JwtTokenProviderInterface;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProviderInterface jwtUtils;

  public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProviderInterface jwtUtils) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    try {
      // Check if username already exists
      if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username already exists");
      }

      // Check if email already exists
      if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body("Email already exists");
      }

      // Create and save new user
      User user = new User();
      user.setUsername(request.getUsername());
      user.setEmail(request.getEmail());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
      user.setRole(User.Role.USER);
      user.setIsActive(true);
      user.setCreatedAt(LocalDateTime.now());
      user.setUpdatedAt(LocalDateTime.now());
      user.setLastPasswordChange(LocalDateTime.now());

      try {
        user = userRepository.save(user);
      } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to save user: " + e.getMessage());
      }

      // Generate token for the new user
      String token = jwtUtils.generateToken(user.getUsername(), user.getId(), List.of(user.getRole().toString()));
      
      // Create response with all user details
      JwtResponse response = new JwtResponse(token);
      response.setUserId(user.getId());
      response.setUsername(user.getUsername());
      response.setEmail(user.getEmail());
      response.setRole(user.getRole().toString());
      
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    try {
      Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

      if (userOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
      }

      User user = userOptional.get();

      // Check if password matches
      if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
      }
      
      // Check if user is active
      if (!user.getIsActive()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account is disabled");
      }

      // Update last login time
      user.setLastLoginAt(LocalDateTime.now());
      userRepository.save(user);

      // Generate token with user ID and return response with user info
      String token = jwtUtils.generateToken(user.getUsername(), user.getId(), List.of(user.getRole().toString()));
      return ResponseEntity.ok(new JwtResponse(
          token,
          user.getId(),
          user.getUsername(),
          user.getEmail(),
          user.getRole().toString()
      ));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Login failed: " + e.getMessage());
    }
  }

  // Handle exceptions specifically for registration or login errors
  @ExceptionHandler(RuntimeException.class)
  public String handleRuntimeException(RuntimeException ex) {
    return "Error: " + ex.getMessage();
  }

  @ExceptionHandler(Exception.class)
  public String handleException(Exception ex) {
    return "An error occurred: " + ex.getMessage();
  }
}
