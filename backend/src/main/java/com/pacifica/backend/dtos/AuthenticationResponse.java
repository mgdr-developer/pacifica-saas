package com.pacifica.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UUID id;
    private String email;
    private String firstName;
    private String paternalLastName;
    private String avatarUrl;
    private String role;
}