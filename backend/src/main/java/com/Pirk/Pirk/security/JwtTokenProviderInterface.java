package com.Pirk.Pirk.security;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;


public interface JwtTokenProviderInterface {
    String generateToken(String username, Long userId, List<String> roles);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);
    Long getUserIdFromToken(String token);
    List<String> getRolesFromToken(String token);
    List<GrantedAuthority> getAuthoritiesFromToken(String token);
    String resolveToken(HttpServletRequest request);
}
