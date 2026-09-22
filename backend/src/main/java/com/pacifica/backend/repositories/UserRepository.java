package com.pacifica.backend.repositories;

import com.pacifica.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Magia de Spring Data: Buscará automáticamente por la columna email
    Optional<User> findByEmail(String email);
}