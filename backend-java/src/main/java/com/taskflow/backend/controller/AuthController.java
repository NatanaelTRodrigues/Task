// AuthController.java
package com.taskflow.backend.controller;

import com.taskflow.backend.dto.AuthResponse;
import com.taskflow.backend.dto.LoginRequest;
import com.taskflow.backend.dto.RegisterRequest;
import com.taskflow.backend.model.User;
import com.taskflow.backend.security.JwtUtil;
import com.taskflow.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {

        logger.info("Tentativa de registro. Username: {}", registerRequest.getUsername()); 

        if (userService.existsByUsername(registerRequest.getUsername())) {
            logger.warn("Registro falhou: Usuário {} já existe.", registerRequest.getUsername());
            return new ResponseEntity<>("Username already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword()); // A senha será codificada no Service

        userService.registerUser(user);
        logger.info("Usuário {} registrado com sucesso!", registerRequest.getUsername());

        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        User user;
        try {
            user = userService.findByUsername(loginRequest.getUsername());
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getUsername());
        logger.info("Login bem-sucedido para o usuário {}.", loginRequest.getUsername());

        return ResponseEntity.ok(new AuthResponse(token));
    }
}