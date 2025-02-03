package com.Pirk.Pirk.Utilities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class LogoutEventListener {
    private static final Logger logger = LoggerFactory.getLogger(LogoutEventListener.class);

    @EventListener
    public void onLogout(LogoutSuccessEvent event) {
        String username = event.getAuthentication().getName();
        logger.info("User logged out: {}", username);
    }
}