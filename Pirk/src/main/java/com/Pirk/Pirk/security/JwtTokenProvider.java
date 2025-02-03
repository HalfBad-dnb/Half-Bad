package com.Pirk.Pirk.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private long jwtExpiration;

  // Create a JwtDecoder Bean for token validation using HS256
  private JwtDecoder jwtDecoder() {
    // Create SecretKeySpec from jwtSecret string for HS256
    SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256");

    // Return NimbusJwtDecoder with the SecretKeySpec for HS256
    return NimbusJwtDecoder.withSecretKey(secretKey).build();
  }

  // Generate JWT Token with username and roles using HS256
  public String generateToken(String username, List<String> roles) {
    return Jwts.builder()
        .setSubject(username)
        .claim("roles", roles)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256"), SignatureAlgorithm.HS256) // Sign with HS256
        .compact();
  }

  // Validate JWT Token
  public boolean validateToken(String token) {
    try {
      jwtDecoder().decode(token); // Decode and validate token using NimbusJwtDecoder
      return true; // If no exception is thrown, the token is valid
    } catch (Exception e) {
      return false; // If there's an exception, return false (invalid token)
    }
  }

  // Extract Username from Token
  public String getUsernameFromToken(String token) {
    Jwt jwt = jwtDecoder().decode(token); // Decode token using NimbusJwtDecoder
    return jwt.getSubject(); // Extract the username (subject) from the decoded JWT
  }

  // Extract Authorities (Roles) from Token
  public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
    Jwt jwt = jwtDecoder().decode(token); // Decode token
    List<String> roles = jwt.getClaimAsStringList("roles"); // Get roles from the token
    return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()); // Convert roles to authorities
  }
}