package com.pacifica.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pacifica.backend.models.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Spring Data crea la consulta automáticamente basándose en el nombre del
    // método
    Optional<Role> findByName(String name);
}
