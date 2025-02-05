package com.Pirk.Pirk.security;

import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public interface JwtTokenProviderInterface {
    String generateToken(String username, List<String> roles);
    boolean validateToken(String token);
    String getUsernameFromToken(String token);
    List<String> getRolesFromToken(String token);
    List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token);
}
