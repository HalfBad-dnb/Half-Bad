package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.nio.file.Files;

import java.nio.file.Paths;
import java.util.Optional;


@Service
public class ProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String uploadDir = "uploads/avatars/";

    public ProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        createUploadDirectoryIfNotExists();
    }

    private void createUploadDirectoryIfNotExists() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserProfile(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        return user.get();
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
         
            user.setAddress(updatedUser.getAddress());
           
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
     
            user.setAddress(updatedUser.getAddress());
    
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

  

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getUserProfile(userId);
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUserProfile(Long userId) {
        User user = getUserProfile(userId);
        
      
        
        userRepository.delete(user);
    }
}
