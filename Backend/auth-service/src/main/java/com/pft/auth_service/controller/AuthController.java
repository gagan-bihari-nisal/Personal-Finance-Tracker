package com.pft.auth_service.controller;

import com.pft.auth_service.filter.TokenGeneratorFilter;
import com.pft.auth_service.model.LoginRequest;
import com.pft.auth_service.model.LoginResponse;
import com.pft.auth_service.model.User;
import com.pft.auth_service.repository.UserRepository;
import com.pft.auth_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AuthenticationManager authentication;
    private final TokenGeneratorFilter tokenGenerator;

    public AuthController(UserRepository userRepository, UserService userService, AuthenticationManager authentication, TokenGeneratorFilter tokenGenerator) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.authentication = authentication;
        this.tokenGenerator = tokenGenerator;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        User createdUser = userService.registerUser(user);
        return ResponseEntity.ok(createdUser.getUsername() + " registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        UserDetails user = userService.loadUserByUsername(request.getUsername());
        if (user != null) {
            authentication.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),
                    request.getPassword()));
        }
        final String jwt = tokenGenerator.generateToken(user);
        return ResponseEntity.ok(new LoginResponse("Login Successful", jwt));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Map<String, String>> getUserByUsername(@PathVariable("username") String username) {
        Map<String, String> map = userService.getUserByUsername(username);
        return ResponseEntity.ok(map);
    }
}