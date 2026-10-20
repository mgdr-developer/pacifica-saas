package com.pacifica.backend.controllers;

import com.pacifica.backend.dtos.RoleResponse;
import com.pacifica.backend.dtos.UserCreateRequest;
import com.pacifica.backend.dtos.UserResponse;
import com.pacifica.backend.dtos.UserUpdateRequest;
import com.pacifica.backend.services.FileStorageService;
import com.pacifica.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    // 1. Obtener la lista de roles para el selector del formulario
    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

    // 2. Dar de alta a un nuevo usuario (Responde 201 Created)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        UserResponse response = userService.createUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 3. Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 4. Obtener un usuario específico por su UUID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 5. Editar los datos de un usuario
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // 6. Eliminar un usuario (Responde 204 No Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 7. Subir foto independiente (Para el formulario antes de guardar al usuario)
    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatarStandalone(@RequestParam("file") MultipartFile file) {
        String avatarUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
    }

    // 8. Subir foto y asociarla de inmediato (Para la opción en el menú de 3
    // puntos)
    @PostMapping("/{id}/avatar")
    public ResponseEntity<UserResponse> uploadUserAvatar(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        String avatarUrl = fileStorageService.storeFile(file);
        UserResponse response = userService.updateAvatar(id, avatarUrl);
        return ResponseEntity.ok(response);
    }

}
