package com.Pirk.Pirk.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Pirk.Pirk.models.Newsletter;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    boolean existsByEmail(String email);
}
