package com.pacifica.backend.dtos;

public record UserCreateRequest(
        String firstName,
        String paternalLastName,
        String maternalLastName,
        String phone,
        String email,
        String password,
        Long roleId,
        String avatarUrl) {
}
