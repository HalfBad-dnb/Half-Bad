package com.Pirk.Pirk.Controllers;

import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getProfile(@PathVariable Long id) {
        Optional<User> user = profileService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(profileService.updateUser(id, updatedUser));
    }
}
