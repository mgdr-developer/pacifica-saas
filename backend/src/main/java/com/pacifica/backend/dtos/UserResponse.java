package com.pacifica.backend.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String paternalLastName,
        String maternalLastName,
        String phone,
        String email,
        String avatarUrl,
        RoleResponse role,
        LocalDateTime createdAt) {
}
