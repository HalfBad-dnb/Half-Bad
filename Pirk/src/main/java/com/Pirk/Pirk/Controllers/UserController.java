package com.Pirk.Pirk.controllers;

import com.Pirk.Pirk.models.ErrorResponse;
import com.Pirk.Pirk.models.User;
import com.Pirk.Pirk.services.UserService;
import com.Pirk.Pirk.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/info")
    public ResponseEntity<?> getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.debug("Current authentication: {}", authentication);
        
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("User not authenticated. Authentication: {}", authentication);
            return ResponseEntity.status(401)
                .body(new ErrorResponse("User not authenticated"));
        }

        logger.debug("Authentication principal type: {}", authentication.getPrincipal().getClass().getName());
        if (!(authentication.getPrincipal() instanceof CustomUserDetails)) {
            logger.warn("Invalid authentication type. Expected CustomUserDetails but got: {}", 
                authentication.getPrincipal().getClass().getName());
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Invalid authentication type"));
        }

        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            logger.debug("User details - userId: {}, username: {}", userDetails.getUserId(), userDetails.getUsername());
            
            User user = userService.getUserById(userDetails.getUserId());
            logger.debug("Found user: {}", user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Failed to fetch user information", e);
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Failed to fetch user information: " + e.getMessage()));
        }
    }
}
