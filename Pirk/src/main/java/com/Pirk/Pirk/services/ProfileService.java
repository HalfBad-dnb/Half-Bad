package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setProfilePicture(updatedUser.getProfilePicture());
            user.setAddress(updatedUser.getAddress());
            user.setPreferences(updatedUser.getPreferences());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
