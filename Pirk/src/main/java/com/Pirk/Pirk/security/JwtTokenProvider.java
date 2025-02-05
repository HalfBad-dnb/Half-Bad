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
public class JwtTokenProvider implements JwtTokenProviderInterface {

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
  @Override
  public String generateToken(String username, List<String> roles) {
    return Jwts.builder()
        .setSubject(username)
        .claim("roles", roles)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256"), SignatureAlgorithm.HS256)
        .compact();
  }

  // Validate JWT Token
  @Override
  public boolean validateToken(String token) {
    try {
      jwtDecoder().decode(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  // Get username from token
  @Override
  public String getUsernameFromToken(String token) {
    Jwt jwt = jwtDecoder().decode(token);
    return jwt.getSubject();
  }

  // Get roles from token
  @Override
  public List<String> getRolesFromToken(String token) {
    Jwt jwt = jwtDecoder().decode(token);
    @SuppressWarnings("unchecked")
    List<String> roles = (List<String>) jwt.getClaim("roles");
    return roles;
  }

  // Convert roles to authorities
  @Override
  public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
    List<String> roles = getRolesFromToken(token);
    return roles.stream()
               .map(SimpleGrantedAuthority::new)
               .collect(Collectors.toList());
  }
}