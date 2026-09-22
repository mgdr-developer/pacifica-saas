package com.pacifica.backend.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record InstituteResponse(
    UUID id,
    String name,
    String contactPhone,
    LocalDateTime createdAt
) {}
