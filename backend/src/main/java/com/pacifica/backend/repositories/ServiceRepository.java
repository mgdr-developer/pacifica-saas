package com.pacifica.backend.repositories;

import com.pacifica.backend.models.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, UUID> {
    boolean existsByNameIgnoreCase(String name);
}
