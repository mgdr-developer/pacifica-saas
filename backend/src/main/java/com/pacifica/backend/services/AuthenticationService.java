package com.pacifica.backend.services;

import com.pacifica.backend.dtos.AuthenticationRequest;
import com.pacifica.backend.dtos.AuthenticationResponse;
import com.pacifica.backend.dtos.RegisterRequest;
import com.pacifica.backend.models.User;
import com.pacifica.backend.repositories.RoleRepository;
import com.pacifica.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final RoleRepository roleRepository;

        public AuthenticationResponse register(RegisterRequest request) {
                // 1. Buscamos el rol ADMIN en la BD a través del repositorio
                var defaultRole = roleRepository.findByName("ADMIN")
                                .orElseThrow(() -> new RuntimeException("El rol ADMIN no ha sido inicializado"));
                // 2. Creamos al usuario con la ficha obtenida de la BD
                var user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(defaultRole) // Ya no usamos Role.ADMIN
                                .build();
                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                // El Gerente General verifica las credenciales
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                // Si llega a esta línea, la contraseña era correcta. Buscamos al usuario.
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();

                // Imprimimos un nuevo gafete
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}