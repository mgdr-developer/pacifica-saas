package com.pacifica.backend.dtos;

public record UserUpdateRequest(
        String firstName,
        String paternalLastName,
        String maternalLastName,
        String phone,
        Long roleId,
        String avatarUrl) {
}
