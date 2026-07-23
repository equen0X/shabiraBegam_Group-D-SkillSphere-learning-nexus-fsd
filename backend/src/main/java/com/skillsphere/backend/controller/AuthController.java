package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.RefreshToken;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.RefreshTokenRepository;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.security.GoogleTokenVerifier;
import com.skillsphere.backend.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider tokenProvider;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            JwtTokenProvider tokenProvider,
            GoogleTokenVerifier googleTokenVerifier,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenProvider = tokenProvider;
        this.googleTokenVerifier = googleTokenVerifier;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Local Sign-Up
     */
    @PostMapping({"/auth/signup", "/register"})
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String fullName = body.get("full_name");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.get("role");

        Map<String, Object> response = new HashMap<>();

        if (username == null || fullName == null || email == null || password == null) {
            response.put("success", false);
            response.put("message", "All fields (username, full_name, email, password) are required");
            return ResponseEntity.status(400).body(response);
        }

        if (password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters long");
            return ResponseEntity.status(400).body(response);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            response.put("success", false);
            response.put("message", "Email is already registered");
            return ResponseEntity.status(400).body(response);
        }

        if (userRepository.findByUsername(username).isPresent()) {
            response.put("success", false);
            response.put("message", "Username is already taken");
            return ResponseEntity.status(400).body(response);
        }

        // Validate and set role
        String targetRole = Arrays.asList("STUDENT", "EMPLOYEE", "MANAGER", "ADMIN").contains(role) ? role : "STUDENT";

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(targetRole);
        user.setProvider("LOCAL");
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(savedUser);
        String refreshToken = tokenProvider.generateRefreshToken(savedUser);

        // Save hashed refresh token
        saveHashedRefreshToken(savedUser.getId(), refreshToken);

        response.put("success", true);
        response.put("message", "Registered successfully");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId().toString());
        userData.put("username", savedUser.getUsername());
        userData.put("email", savedUser.getEmail());
        userData.put("full_name", savedUser.getFullName());
        userData.put("role", savedUser.getRole());
        response.put("user", userData);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Local Login
     */
    @PostMapping({"/auth/login", "/login"})
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null) {
            response.put("success", false);
            response.put("message", "Email and password are required");
            return ResponseEntity.status(400).body(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Incorrect email ID");
            return ResponseEntity.status(401).body(response);
        }

        User user = userOpt.get();

        if (!"LOCAL".equals(user.getProvider()) || user.getPasswordHash() == null) {
            response.put("success", false);
            response.put("message", "Please use Google login for this account");
            return ResponseEntity.status(400).body(response);
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            response.put("success", false);
            response.put("message", "Incorrect password");
            return ResponseEntity.status(401).body(response);
        }

        if (!user.getIsActive()) {
            response.put("success", false);
            response.put("message", "This user account is inactive. Please contact support.");
            return ResponseEntity.status(403).body(response);
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        // Save hashed refresh token
        saveHashedRefreshToken(user.getId(), refreshToken);

        response.put("success", true);
        response.put("message", "Logged in successfully");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("full_name", user.getFullName());
        userData.put("role", user.getRole());
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    /**
     * Google Sign-In / Login
     */
    @PostMapping("/auth/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        String credential = body.get("credential");
        String role = body.get("role");

        Map<String, Object> response = new HashMap<>();

        if (credential == null) {
            response.put("success", false);
            response.put("message", "Google credential ID token is required");
            return ResponseEntity.status(400).body(response);
        }

        try {
            GoogleTokenVerifier.GoogleProfile profile = googleTokenVerifier.verifyToken(credential);
            String googleId = profile.getGoogleId();
            String email = profile.getEmail();
            String name = profile.getName();

            Optional<User> userOpt = userRepository.findByProviderAndProviderId("GOOGLE", googleId);
            User user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
            } else {
                // Check if email already registered
                Optional<User> existingUserOpt = userRepository.findByEmail(email);
                if (existingUserOpt.isPresent()) {
                    user = existingUserOpt.get();
                    user.setProvider("GOOGLE");
                    user.setProviderId(googleId);
                    user.setLastLoginAt(LocalDateTime.now());
                    userRepository.save(user);
                } else {
                    // Create new user
                    String usernameBase = email.split("@")[0];
                    String username = usernameBase;

                    int suffix = 1;
                    while (userRepository.findByUsername(username).isPresent()) {
                        username = usernameBase + suffix;
                        suffix++;
                    }

                    String targetRole = Arrays.asList("STUDENT", "EMPLOYEE", "MANAGER", "ADMIN").contains(role) ? role : "STUDENT";

                    user = new User();
                    user.setUsername(username);
                    user.setFullName(name != null ? name : username);
                    user.setEmail(email);
                    user.setProvider("GOOGLE");
                    user.setProviderId(googleId);
                    user.setRole(targetRole);
                    user.setIsActive(true);
                    user.setLastLoginAt(LocalDateTime.now());
                    user = userRepository.save(user);
                }
            }

            if (!user.getIsActive()) {
                response.put("success", false);
                response.put("message", "This user account is inactive. Please contact support.");
                return ResponseEntity.status(403).body(response);
            }

            // Generate tokens
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);

            // Save hashed refresh token
            saveHashedRefreshToken(user.getId(), refreshToken);

            response.put("success", true);
            response.put("message", "Logged in successfully");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId().toString());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("full_name", user.getFullName());
            userData.put("role", user.getRole());
            response.put("user", userData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Google authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Token Refresh (Rotation)
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        Map<String, Object> response = new HashMap<>();

        if (refreshToken == null) {
            response.put("success", false);
            response.put("message", "Refresh token is required");
            return ResponseEntity.status(400).body(response);
        }

        try {
            if (!tokenProvider.validateToken(refreshToken, true)) {
                response.put("success", false);
                response.put("message", "Invalid or expired refresh token");
                return ResponseEntity.status(403).body(response);
            }

            Long userId = tokenProvider.getUserIdFromToken(refreshToken, true);

            List<RefreshToken> activeDbTokens = refreshTokenRepository.findByUserIdAndRevoked(userId, false);
            RefreshToken matchedToken = null;

            for (RefreshToken dbToken : activeDbTokens) {
                // Ensure expired check
                if (dbToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                    continue;
                }

                if (passwordEncoder.matches(refreshToken, dbToken.getTokenHash())) {
                    matchedToken = dbToken;
                    break;
                }
            }

            if (matchedToken == null) {
                // Replay attack: Revoke all tokens for this user
                for (RefreshToken dbToken : activeDbTokens) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                }
                response.put("success", false);
                response.put("message", "Refresh token compromised or revoked. Please log in again.");
                return ResponseEntity.status(403).body(response);
            }

            // Revoke current token
            matchedToken.setRevoked(true);
            refreshTokenRepository.save(matchedToken);

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty() || !userOpt.get().getIsActive()) {
                response.put("success", false);
                response.put("message", "User account is disabled or does not exist");
                return ResponseEntity.status(403).body(response);
            }

            User user = userOpt.get();

            // Generate new token pair
            String newAccessToken = tokenProvider.generateAccessToken(user);
            String newRefreshToken = tokenProvider.generateRefreshToken(user);

            // Save new hashed token
            saveHashedRefreshToken(user.getId(), newRefreshToken);

            response.put("success", true);
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Internal server error refreshing token");
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * User Logout
     */
    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody(required = false) Map<String, String> body) {
        String plainRefreshToken = body != null ? body.get("refreshToken") : null;
        Map<String, Object> response = new HashMap<>();

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());

        List<RefreshToken> activeDbTokens = refreshTokenRepository.findByUserIdAndRevoked(userId, false);

        if (plainRefreshToken != null) {
            for (RefreshToken dbToken : activeDbTokens) {
                if (passwordEncoder.matches(plainRefreshToken, dbToken.getTokenHash())) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                    break;
                }
            }
        } else {
            // Revoke all
            for (RefreshToken dbToken : activeDbTokens) {
                dbToken.setRevoked(true);
                refreshTokenRepository.save(dbToken);
            }
        }

        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    private void saveHashedRefreshToken(Long userId, String plainToken) {
        String hashedToken = passwordEncoder.encode(plainToken);
        RefreshToken dbToken = new RefreshToken();
        dbToken.setUserId(userId);
        dbToken.setTokenHash(hashedToken);
        dbToken.setRevoked(false);
        dbToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(dbToken);
    }
}
