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
import org.springframework.security.core.context.SecurityContextHolder;

import com.pacifica.backend.dtos.ChangePasswordRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final RoleRepository roleRepository;
        private final FileStorageService fileStorageService;

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

                // 1. Preparamos los datos extra que grabaremos en el chip del gafete
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole() != null ? user.getRole().getName() : "SIN_ROL");
                extraClaims.put("userId", user.getId().toString());
                extraClaims.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
                // 2. Le pasamos los datos a JwtService para que selle el gafete con ellos
                // adentro
                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .id(user.getId())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .paternalLastName(user.getPaternalLastName())
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole().getName())
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

                // 1. Preparamos los datos extra que grabaremos en el chip del gafete
                java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
                extraClaims.put("role", user.getRole() != null ? user.getRole().getName() : "SIN_ROL");
                extraClaims.put("userId", user.getId().toString());
                extraClaims.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");

                // 2. Le pasamos los datos a JwtService para que selle el gafete con ellos adentro
                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .id(user.getId())
                                .email(user.getEmail())
                                .firstName(user.getFirstName() != null ? user.getFirstName() : "")
                                .paternalLastName(user.getPaternalLastName() != null ? user.getPaternalLastName() : "")
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole() != null ? user.getRole().getName() : "SIN_ROL")
                                .build();
        }

        // Permite a un usuario consultar su propio perfil usando su gafete activo
        public AuthenticationResponse getCurrentUser() {
                var user = getAuthenticatedUser();
                return AuthenticationResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .firstName(user.getFirstName() != null ? user.getFirstName() : "")
                                .paternalLastName(user.getPaternalLastName() != null ? user.getPaternalLastName() : "")
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole() != null ? user.getRole().getName() : "SIN_ROL")
                                .build();
        }

        // Permite a cualquier usuario autenticado cambiar su propia contraseña
        public void changePassword(ChangePasswordRequest request) {
                var user = getAuthenticatedUser();

                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual no es correcta");
                }

                if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña debe tener al menos 8 caracteres");
                }

                // Regla 2026: al menos 1 mayúscula, 1 número y 1 carácter especial
                String regex = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";
                if (!request.getNewPassword().matches(regex)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial");
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                repository.save(user);
        }

        // Permite a cualquier usuario autenticado actualizar su propia foto de perfil
        public String updateProfileAvatar(MultipartFile file) {
                var user = getAuthenticatedUser();
                String avatarUrl = fileStorageService.storeFile(file);
                user.setAvatarUrl(avatarUrl);
                repository.save(user);
                return avatarUrl;
        }

        private User getAuthenticatedUser() {
                var auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida o expirada");
                }
                return repository.findByEmail(auth.getName())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        }
}