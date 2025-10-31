// UserService.java
package com.taskflow.backend.service;

import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Implementa esta interface
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService { // CRÍTICO: Implementa a interface

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Injeção via Construtor
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Cria o UserDetails do Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(), 
                new ArrayList<>() 
        );
    }

    // Lógica de Negócios: Registro
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Lógica de Negócios: Buscar por username (para login)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Lógica de Negócios: Checar se existe (para registro)
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}