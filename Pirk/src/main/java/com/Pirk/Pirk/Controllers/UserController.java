package com.Pirk.Pirk.Controllers;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.repositories.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/info")
  public ResponseEntity<?> getUserInfo() {
    // Retrieve the current user's username from the SecurityContext
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    String username;
    if (principal instanceof UserDetails) {
      username = ((UserDetails) principal).getUsername();
    } else {
      username = principal.toString();
    }

    

    // Find the user in the database
    Optional<User> userOptional = userRepository.findByUsername(username);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    User user = userOptional.get();

    // Return the user information
    return ResponseEntity.ok(user);
  }

  @PutMapping("/update")
  public ResponseEntity<?> updateUserInfo(@RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
                                          @RequestParam(value = "address", required = false) String address,
                                          @RequestParam(value = "preferences", required = false) String preferences) {
    // Retrieve the current user's username from the SecurityContext
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    String username;
    if (principal instanceof UserDetails) {
      username = ((UserDetails) principal).getUsername();
    } else {
      username = principal.toString();
    }

    // Find the user in the database
    Optional<User> userOptional = userRepository.findByUsername(username);
    if (userOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    User user = userOptional.get();

    // Handle profile picture upload (if provided)
    if (profilePicture != null && !profilePicture.isEmpty()) {
      try {
        // Save the uploaded profile picture to a directory (you can use a service to save it)
        File file = new File("files/" + profilePicture.getOriginalFilename());
        profilePicture.transferTo(file);
        user.setProfilePicture(file.getAbsolutePath()); // Save the file path in the database
      } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload the profile picture.");
      }
    }

    // Update other user details if provided
    if (address != null) {
      user.setAddress(address);
    }
    if (preferences != null) {
      user.setPreferences(preferences);
    }

    // Save the updated user info to the database
    userRepository.save(user);

    // Return the updated user info
    return ResponseEntity.ok(user);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleException(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
  }
}
