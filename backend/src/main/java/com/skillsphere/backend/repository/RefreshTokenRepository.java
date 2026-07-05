package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    List<RefreshToken> findByUserIdAndRevoked(Long userId, Boolean revoked);
}
