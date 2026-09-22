package com.pacifica.backend.repositories;

import com.pacifica.backend.models.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, UUID> {
}
