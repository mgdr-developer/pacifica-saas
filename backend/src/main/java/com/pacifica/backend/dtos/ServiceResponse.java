package com.pacifica.backend.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ServiceResponse(
    UUID id,
    String name,
    LocalDateTime createdAt
) {}
