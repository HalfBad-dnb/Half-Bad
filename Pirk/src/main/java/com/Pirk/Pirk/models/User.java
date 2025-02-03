package com.Pirk.Pirk.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 50)
    @Column(unique = true)
    private String username;

    @NotNull
    @Size(min = 8)
    private String password;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    // New Profile Fields
    private String profilePicture;  // Store URL or file path
    private String address;
    private String preferences;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    // New Getters and Setters
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }

    public enum Role {
        USER, ADMIN;
    }
}
