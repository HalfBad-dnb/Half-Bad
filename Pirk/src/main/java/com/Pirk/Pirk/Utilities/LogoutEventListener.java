package com.Pirk.Pirk.Utilities;

import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class LogoutEventListener {

    @EventListener
    public void onLogout(LogoutSuccessEvent event) {
        String username = event.getAuthentication().getName();
        // Log or store the logout event for the user
        System.out.println("User logged out: " + username);
    }
}
