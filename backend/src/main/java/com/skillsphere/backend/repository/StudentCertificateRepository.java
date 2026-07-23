package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.StudentCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentCertificateRepository extends JpaRepository<StudentCertificate, Long> {
    List<StudentCertificate> findByUserId(Long userId);
}
