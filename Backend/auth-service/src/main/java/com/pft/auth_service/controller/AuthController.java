package com.pft.auth_service.controller;

import com.pft.auth_service.filter.TokenGeneratorFilter;
import com.pft.auth_service.model.JwtRequest;
import com.pft.auth_service.model.JwtResponse;
import com.pft.auth_service.model.User;
import com.pft.auth_service.repository.UserRepository;
import com.pft.auth_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthenticationManager authentication;
    private final TokenGeneratorFilter tokenGenerator;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService, AuthenticationManager authentication, TokenGeneratorFilter tokenGenerator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.authentication = authentication;
        this.tokenGenerator = tokenGenerator;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
        UserDetails user = userService.loadUserByUsername(request.getUsername());
        if (user != null) {
            authentication.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),
                    request.getPassword()));
        }
        final String jwt = tokenGenerator.generateToken(user);
        return ResponseEntity.ok(new JwtResponse("Login Successful",jwt));
    }

    @GetMapping("/user/{username}")
public ResponseEntity<Map<String, String>> getUserById(@PathVariable("username") String username) {
    try {
        Map<String, String> map = userService.getEmailByUsername(username);
        return ResponseEntity.ok(map);
    } catch (Exception e) {
        return ResponseEntity.status(404).body(null);
    }
}
}