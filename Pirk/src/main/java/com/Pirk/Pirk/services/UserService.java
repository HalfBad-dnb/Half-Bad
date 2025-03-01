package com.Pirk.Pirk.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(String username, String email, String password) {
    // Validate input parameters
    if (username == null || username.trim().isEmpty()) {
      throw new IllegalArgumentException("Username cannot be null or empty");
    }
    if (email == null || email.trim().isEmpty()) {
      throw new IllegalArgumentException("Email cannot be null or empty");
    }
    if (password == null || password.trim().isEmpty()) {
      throw new IllegalArgumentException("Password cannot be null or empty");
    }

    User user = new User();
    user.setUsername(username.trim());
    user.setEmail(email.trim());
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(User.Role.USER); // Default role is USER
    return userRepository.save(user);
  }

  // Method to fetch a user by their ID
  public User getUserById(Long userId) {
    if (userId == null) {
      throw new IllegalArgumentException("User ID cannot be null");
    }
    return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
  }

  public User getUserByUsername(String username) {
    if (username == null || username.trim().isEmpty()) {
      throw new IllegalArgumentException("Username cannot be null or empty");
    }
    return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
  }
}
