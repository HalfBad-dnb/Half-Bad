package com.Pirk.Pirk.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "newsletter_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @Builder.Default
    private boolean active = true; // Default value for 'active'

    // Constructor for email only (useful for subscription)
    public Newsletter(String email) {
        this.email = email;
        this.active = true; // Default to active
    }

    // Optional: Add a method to deactivate the subscription
    public void deactivate() {
        this.active = false;
    }

    // Optional: Add a method to activate the subscription
    public void activate() {
        this.active = true;
    }
}
