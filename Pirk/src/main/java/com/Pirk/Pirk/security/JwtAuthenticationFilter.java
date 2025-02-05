package com.Pirk.Pirk.security;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");

    // Check if Authorization header is present and starts with "Bearer "
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);  // Proceed without authentication if no token
      return;
    }

    String token = authHeader.substring(7); // Extract token from header
    if (logger.isDebugEnabled()) {
      logger.debug("Received Token: {}", token);
    }

    try {
      // Validate the token
      if (jwtTokenProvider.validateToken(token)) {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        if (logger.isDebugEnabled()) {
          logger.debug("Extracted Username: {}", username);
        }

        var authorities = jwtTokenProvider.getAuthoritiesFromToken(token);
        if (logger.isDebugEnabled()) {
          logger.debug("Authorities: {}", authorities);
        }

        // Create the authentication token and set it in the SecurityContext
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } else {
        if (logger.isWarnEnabled()) {
          logger.warn("Invalid token: {}", token);
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
        return;
      }
    } catch (Exception e) {
      if (logger.isErrorEnabled()) {
        logger.error("Error processing token: {}", e.getMessage(), e);
      }
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
      return;
    }

    filterChain.doFilter(request, response);
  }
}
