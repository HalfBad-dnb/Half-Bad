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
    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(User.Role.USER); // Default role is USER
    return userRepository.save(user);
  }

  // Method to fetch a user by their ID
  public User getUserById(Long userId) {
    return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
  }
}
