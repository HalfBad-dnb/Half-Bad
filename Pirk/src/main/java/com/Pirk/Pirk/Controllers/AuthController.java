package com.Pirk.Pirk.Controllers;

import java.util.List;
import java.util.Optional;

import com.Pirk.Pirk.dto.JwtResponse;
import com.Pirk.Pirk.dto.LoginRequest;
import com.Pirk.Pirk.dto.RegisterRequest;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import com.Pirk.Pirk.security.JwtTokenProvider;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtUtils;

  public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtUtils) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
  }

  @PostMapping("/register")
  public String register(@Valid @RequestBody RegisterRequest request) {
    // Check if username already exists
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      return "Username already exists";
    }

    // Check if email already exists
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      return "Email already exists";
    }

    // Create and save new user
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(User.Role.USER);
    userRepository.save(user);

    return "User registered successfully!";
  }

  @PostMapping("/login")
  public JwtResponse login(@Valid @RequestBody LoginRequest request) {
    Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

    // Check if user exists and password is correct
    if (userOptional.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOptional.get().getPassword())) {
      throw new RuntimeException("Invalid credentials");
    }

    // Generate and return JWT token
    String token = jwtUtils.generateToken(userOptional.get().getUsername(), List.of(userOptional.get().getRole().toString()));
    return new JwtResponse(token);
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
