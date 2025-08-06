package com.example.employeemanagement.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtTokenUtil {

  private String secret = "secretKey";

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public List<String> extractRoles(String token) {
    Claims claims = extractAllClaims(token);
    return (List<String>) claims.get("roles");
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public String generateToken(String username, List<String> roles) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", roles);
    return createToken(claims, username);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
  }

  public Boolean validateToken(String token, String username) {
    final String extractedUsername = extractUsername(token);
    return (extractedUsername.equals(username) && !isTokenExpired(token));
  }
}
