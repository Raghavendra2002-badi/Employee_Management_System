package com.example.employeemanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

  @Autowired
  private UserDetailsService userDetailsService;

  @Autowired
  private JwtTokenUtil jwtTokenUtil;

  @Override
  protected void doFilterInternal(
          HttpServletRequest request, HttpServletResponse response, FilterChain chain)
          throws ServletException, IOException {

    final String authorizationHeader = request.getHeader("Authorization");

    String username = null;
    String jwt = null;

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      jwt = authorizationHeader.substring(7);
      username = jwtTokenUtil.extractUsername(jwt);
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

      if (jwtTokenUtil.validateToken(jwt, userDetails.getUsername())) {
        List<String> roles = jwtTokenUtil.extractRoles(jwt);
        List<SimpleGrantedAuthority> authorities = roles==null ? Collections.emptyList() :
                roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities);
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
      }
    }
    chain.doFilter(request, response);
  }
}
