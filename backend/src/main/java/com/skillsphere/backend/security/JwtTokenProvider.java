package com.skillsphere.backend.security;

import com.skillsphere.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final Key accessKey;
    private final Key refreshKey;

    public JwtTokenProvider(
            @Value("${skillsphere.jwt.access-secret}") String accessSecret,
            @Value("${skillsphere.jwt.refresh-secret}") String refreshSecret) {
        this.accessKey = Keys.hmacShaKeyFor(accessSecret.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }

    private Key getKey(boolean isRefreshToken) {
        return isRefreshToken ? refreshKey : accessKey;
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("id", user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("username", user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(accessKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 7L * 24 * 60 * 60 * 1000); // 7 days

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("id", user.getId().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(refreshKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getUserIdFromToken(String token, boolean isRefreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey(isRefreshToken))
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object idVal = claims.get("id");
        if (idVal == null) {
            idVal = claims.getSubject();
        }
        return Long.parseLong(idVal.toString());
    }

    public Claims getUserClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, boolean isRefreshToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey(isRefreshToken)).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
