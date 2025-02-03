package com.Pirk.Pirk.security;

import java.security.Key;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
  
  private final Key jwtSecret;
  
  @Value("${jwt.expiration}")
  private long jwtExpirationMs;
  
  public JwtUtils(@Value("${jwt.secret}") String secret) {
    // Use the secret key from application.properties
    this.jwtSecret = Keys.hmacShaKeyFor(secret.getBytes());
  }
  
  public String generateToken(String username) {
    Date issuedAt = new Date();
    Date expirationDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(issuedAt)
        .setExpiration(expirationDate)
        .signWith(jwtSecret)
        .compact();
  }
  
  // Optionally, you can also add a method to validate the token
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(jwtSecret)
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      logger.error("Token validation failed", e);
      return false;
    }
  }
}