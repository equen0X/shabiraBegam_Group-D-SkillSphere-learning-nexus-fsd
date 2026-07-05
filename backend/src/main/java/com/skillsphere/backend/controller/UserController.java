package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping({"/me", "/profile"})
    public ResponseEntity<Map<String, Object>> getMe() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map<String, Object> response = new HashMap<>();

        if (!(principal instanceof Claims)) {
            response.put("success", false);
            response.put("message", "Unauthorized: User context missing");
            return ResponseEntity.status(401).body(response);
        }

        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User profile not found");
            return ResponseEntity.status(404).body(response);
        }

        User user = userOpt.get();

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("full_name", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("provider", user.getProvider());
        userData.put("is_active", user.getIsActive() ? 1 : 0);
        userData.put("last_login_at", user.getLastLoginAt());
        userData.put("created_at", user.getCreatedAt());
        userData.put("updated_at", user.getUpdatedAt());

        response.put("success", true);
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }
}
