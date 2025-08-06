package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.Role;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.RoleRepository;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.security.JwtTokenUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired AuthenticationManager authenticationManager;
  @Autowired UserDetailsService userDetailsService;
  @Autowired JwtTokenUtil jwtTokenUtil;
  @Autowired UserRepository userRepository;
  @Autowired RoleRepository roleRepository;
  @Autowired PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    if (userRepository.findByUsername(req.getUsername()).isPresent()) {
      return ResponseEntity.badRequest().body("Username already exists");
    }
    Set<Role> roles = new HashSet<>();
    for (String r : req.getRoles()) {
      roles.add(roleRepository.findByName("ROLE_" + r.toUpperCase())
              .orElseThrow(() -> new RuntimeException("Role not found: " + r)));
    }
    User user = new User();
    user.setUsername(req.getUsername());
    user.setPassword(passwordEncoder.encode(req.getPassword()));
    user.setRoles(roles);
    userRepository.save(user);
    return ResponseEntity.ok("User registered successfully");
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
    );
    final org.springframework.security.core.userdetails.UserDetails userDetails =
            userDetailsService.loadUserByUsername(req.getUsername());
    User user = userRepository.findByUsername(req.getUsername()).get();
    List<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
    final String jwt = jwtTokenUtil.generateToken(userDetails.getUsername(), roles);
    Map<String, Object> resp = new HashMap<>();
    resp.put("jwt", jwt);
    return ResponseEntity.ok(resp);
  }

  @Data
  static class RegisterRequest {
    private String username;
    private String password;
    private Set<String> roles;
  }

  @Data
  static class LoginRequest {
    private String username;
    private String password;
  }
}
