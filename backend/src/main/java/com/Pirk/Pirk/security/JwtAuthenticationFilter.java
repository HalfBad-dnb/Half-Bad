package com.Pirk.Pirk.security;

import java.io.IOException;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProviderInterface jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProviderInterface jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        logger.debug("Processing request to: {} {}", request.getMethod(), request.getRequestURI());
        logger.debug("Authorization header: {}", authHeader);

        // Check if Authorization header is present and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found");
            filterChain.doFilter(request, response);  // Proceed without authentication if no token
            return;
        }

        String token = jwtTokenProvider.resolveToken(request);

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                var authorities = jwtTokenProvider.getAuthoritiesFromToken(token);

                logger.debug("Token validation successful");
                logger.debug("Username from token: {}", username);
                logger.debug("UserId from token: {}", userId);
                logger.debug("Authorities from token: {}", authorities);

                var simpleAuthorities = authorities.stream()
                    .map(auth -> new SimpleGrantedAuthority(auth.getAuthority()))
                    .collect(Collectors.toList());
                var userDetails = new CustomUserDetails(username, userId, simpleAuthorities);
                var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    simpleAuthorities
                );
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authentication set in SecurityContext");
            } else if (token != null) {
                handleInvalidToken(response, token, "Invalid JWT token");
                return;
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token", e);
            handleInvalidToken(response, token, "Error processing JWT token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleInvalidToken(HttpServletResponse response, String token, String errorMessage) throws IOException {
        if (token != null && logger.isWarnEnabled()) {
            logger.warn("Invalid token: {}", token);
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + errorMessage + "\"}");
    }
}
