package com.Pirk.Pirk.repositories;

import com.Pirk.Pirk.models.Confirmation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationRepository extends JpaRepository<Confirmation, Long> {

    // Find confirmation by confirmation code
    Confirmation findByConfirmationCode(String confirmationCode);
}
