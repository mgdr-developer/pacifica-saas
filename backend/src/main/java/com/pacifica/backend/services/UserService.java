package com.pacifica.backend.services;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pacifica.backend.dtos.RoleResponse;
import com.pacifica.backend.dtos.UserCreateRequest;
import com.pacifica.backend.dtos.UserResponse;
import com.pacifica.backend.dtos.UserUpdateRequest;
import com.pacifica.backend.models.Role;
import com.pacifica.backend.models.User;
import com.pacifica.backend.repositories.RoleRepository;
import com.pacifica.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // 1. Obtener todos los roles disponibles (Para alimentar el selector del
    // formulario)
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(r -> new RoleResponse(r.getId(), r.getName(), r.getDescription()))
                .toList();
    }

    // 2. Crear un nuevo usuario
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("El correo ya se encuentra registrado: " + request.email());
        }
        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + request.roleId()));
        User user = User.builder()
                .firstName(request.firstName())
                .paternalLastName(request.paternalLastName())
                .maternalLastName(request.maternalLastName())
                .phone(request.phone())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .avatarUrl(request.avatarUrl())
                .role(role)
                .build();
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    // 3. Listar todos los usuarios
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 4. Buscar un usuario por ID
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return mapToResponse(user);
    }

    // 5. Editar un usuario existente
    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + request.roleId()));
        user.setFirstName(request.firstName());
        user.setPaternalLastName(request.paternalLastName());
        user.setMaternalLastName(request.maternalLastName());
        user.setPhone(request.phone());
        user.setAvatarUrl(request.avatarUrl());
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    // 6. Eliminar un usuario
    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // 7. Actualizar solo el avatar de un usuario existente (Usado por el menú de 3
    // puntos)
    @Transactional
    public UserResponse updateAvatar(UUID id, String avatarUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        user.setAvatarUrl(avatarUrl);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    // Método de apoyo para transformar la Entidad en el DTO seguro
    private UserResponse mapToResponse(User user) {
        RoleResponse roleResponse = user.getRole() != null
                ? new RoleResponse(user.getRole().getId(), user.getRole().getName(), user.getRole().getDescription())
                : null;
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getPaternalLastName(),
                user.getMaternalLastName(),
                user.getPhone(),
                user.getEmail(),
                user.getAvatarUrl(),
                roleResponse,
                user.getCreatedAt());
    }
}
