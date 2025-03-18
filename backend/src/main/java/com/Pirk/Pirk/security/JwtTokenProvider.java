package com.Pirk.Pirk.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;

@Component
public class JwtTokenProvider implements JwtTokenProviderInterface {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private JwtDecoder jwtDecoder;

    @PostConstruct
    public void init() {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
            this.jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey).build();
            logger.debug("JwtDecoder initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize JwtDecoder: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize JwtDecoder", e);
        }
    }

    // Generate JWT Token with username, userId and roles using HS256
    @Override
    public String generateToken(String username, Long userId, List<String> roles) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
            
            String token = Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
            
            logger.debug("Generated token for user {}: {}", username, token);
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate token for user {}: {}", username, e.getMessage());
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    // Validate JWT Token
    @Override
    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                logger.warn("Token is null or empty");
                return false;
            }
            
            Jwt jwt;
            try {
                jwt = jwtDecoder.decode(token);
            } catch (Exception e) {
                logger.warn("Failed to decode JWT token: {}", e.getMessage());
                return false;
            }
            
            // First check if jwt is null
            if (jwt == null) {
                logger.warn("Failed to decode JWT token");
                return false;
            }

            // Get current time once to avoid time-based attacks
            Instant now = Instant.now();

            // Check expiration
            Instant expiresAt = jwt.getExpiresAt();
            if (expiresAt == null) {
                logger.warn("Token is missing expiration date");
                return false;
            }
            if (expiresAt.isBefore(now)) {
                logger.warn("Token is expired");
                return false;
            }

            // Check issuedAt
            Instant issuedAt = jwt.getIssuedAt();
            if (issuedAt == null) {
                logger.warn("Token is missing issuedAt date");
                return false;
            }
            if (issuedAt.isAfter(now)) {
                logger.warn("Token has future issuedAt date");
                return false;
            }

            // Check for required claims
            String username = jwt.getClaimAsString("sub");
            Object userIdObj = jwt.getClaim("userId");
            Long userId;
            if (userIdObj == null) {
                logger.warn("Token is missing userId claim");
                return false;
            }
            if (userIdObj instanceof Integer) {
                userId = ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                userId = (Long) userIdObj;
            } else {
                logger.error("userId claim is not a number: {}", userIdObj.getClass());
                throw new RuntimeException("Invalid userId type in token");
            }
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) jwt.getClaim("roles");

            if (username == null || username.isEmpty() || 
                userId == null || 
                roles == null || roles.isEmpty()) {
                logger.warn("Token is missing required claims");
                return false;
            }

            // Additional security check: Ensure token is not used before its issuedAt time
            if (issuedAt.plusSeconds(1).isAfter(now)) {
                logger.warn("Token is being used too soon after issuance");
                return false;
            }

            // If all checks pass, token is valid
            logger.debug("Token validated successfully for user: {}", jwt.getSubject());
            return true;
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Get username from token
    @Override
    public String getUsernameFromToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String username = jwt.getSubject();
            logger.debug("Extracted username from token: {}", username);
            return username;
        } catch (Exception e) {
            logger.error("Failed to get username from token: {}", e.getMessage());
            throw new RuntimeException("Failed to get username from token", e);
        }
    }

    // Get user ID from token
    @Override
    public Long getUserIdFromToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            Object userIdObj = jwt.getClaim("userId");
            
            if (userIdObj == null) {
                logger.error("userId claim is missing from token");
                throw new RuntimeException("userId claim is missing from token");
            }
            
            Long userId;
            if (userIdObj instanceof Integer) {
                userId = ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                userId = (Long) userIdObj;
            } else {
                logger.error("userId claim is not a number: {}", userIdObj.getClass());
                throw new RuntimeException("Invalid userId type in token");
            }
            
            logger.debug("Extracted userId from token: {}", userId);
            return userId;
        } catch (Exception e) {
            logger.error("Failed to get userId from token: {}", e.getMessage());
            throw new RuntimeException("Failed to get userId from token", e);
        }
    }

    // Get roles from token
    @Override
    public List<String> getRolesFromToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                logger.error("Token is null or empty");
                throw new RuntimeException("Token is null or empty");
            }

            Jwt jwt = jwtDecoder.decode(token);
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) jwt.getClaim("roles");
            
            if (roles == null || roles.isEmpty()) {
                logger.error("No roles found in token");
                throw new RuntimeException("No roles found in token");
            }

            // Validate that all roles are non-null and non-empty
            if (!roles.stream().allMatch(role -> role != null && !role.trim().isEmpty())) {
                logger.error("Invalid role found in token");
                throw new RuntimeException("Invalid role found in token");
            }

            logger.debug("Extracted roles from token: {}", roles);
            return roles;
        } catch (Exception e) {
            logger.error("Failed to get roles from token: {}", e.getMessage());
            throw new RuntimeException("Failed to get roles from token", e);
        }
    }

    // Convert roles to authorities
    @Override
    public List<GrantedAuthority> getAuthoritiesFromToken(String token) {
        try {
            List<String> roles = getRolesFromToken(token);
            List<GrantedAuthority> authorities = roles.stream()
                .map(role -> {
                    // Ensure role has proper format (e.g., "ROLE_USER")
                    String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    return (GrantedAuthority) new SimpleGrantedAuthority(formattedRole);
                })
                .collect(Collectors.toList());
            
            logger.debug("Converted roles to authorities: {}", authorities);
            return authorities;
        } catch (Exception e) {
            logger.error("Failed to convert roles to authorities: {}", e.getMessage());
            throw new RuntimeException("Failed to convert roles to authorities", e);
        }
    }

    // Extract JWT token from Authorization header
    @Override
    public String resolveToken(HttpServletRequest request) {
        try {
            String bearerToken = request.getHeader("Authorization");
            if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
                return null;
            }

            String token = bearerToken.substring(7);
            if (token.trim().isEmpty()) {
                logger.warn("Empty token in Authorization header");
                return null;
            }

            // Basic format validation
            if (!token.matches("^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$")) {
                logger.warn("Invalid token format in Authorization header");
                return null;
            }

            return token;
        } catch (Exception e) {
            logger.error("Error resolving token from request: {}", e.getMessage());
            return null;
        }
    }
}