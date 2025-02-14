package com.Pirk.Pirk.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Pirk.Pirk.models.Newsletter;
import java.util.Optional;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    boolean existsByEmail(String email);
    
    Optional<Newsletter> findByEmail(String email);

    void deleteByEmail(String email);
}
