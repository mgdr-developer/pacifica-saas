package com.pacifica.backend.config;

import com.pacifica.backend.models.Role;
import com.pacifica.backend.models.User;
import com.pacifica.backend.repositories.RoleRepository;
import com.pacifica.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ============================================================================
 * ROLE SEEDER (El Jardinero que Siembra antes de Abrir las Puertas)
 * ============================================================================
 * 
 * ANALOGÍA:
 * Imagina que vas a abrir un restaurante con especialidades. Antes de que
 * llegue el primer comensal o se contrate al primer empleado, el jardinero
 * debe asegurarse de que las plantas básicas estén sembradas en el huerto:
 * (SUPER_ADMIN, ADMIN, COACH, ALUMNO).
 * 
 * ¿CÓMO FUNCIONA?
 * - La interfaz CommandLineRunner le dice a Spring Boot: "Ejecuta este código
 * automáticamente UNA SOLA VEZ, justo después de encender el servidor y
 * conectar la base de datos".
 * - Es idempotente: revisa si el rol ya existe antes de crearlo, evitando
 * duplicados cada vez que reinicias el backend.
 */
@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {

    // El bibliotecario que nos permite consultar y guardar en la tabla 'roles'
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Método de entrada exigido por CommandLineRunner.
     * Spring Boot lo invoca automáticamente al finalizar el arranque.
     */
    @Override
    public void run(String... args) {
        seedRoles();
        seedSuperAdmin();
    }

    /**
     * Siembra los 4 roles fundamentales en la tabla 'roles' de PostgreSQL.
     * Si la base de datos ya los tiene, no hace nada para mantener la integridad.
     */
    private void seedRoles() {
        // 1. Definición del catálogo oficial de roles del sistema
        List<Role> defaultRoles = List.of(
                Role.builder()
                        .name("SUPER_ADMIN")
                        .description("Acceso total al sistema y configuración global")
                        .build(),
                Role.builder()
                        .name("ADMIN")
                        .description("Administrador del instituto o sede")
                        .build(),
                Role.builder()
                        .name("COACH")
                        .description("Entrenador o profesor asignado a clases")
                        .build(),
                Role.builder()
                        .name("ALUMNO")
                        .description("Estudiante o miembro del instituto")
                        .build());

        // 2. Verificación e inserción segura (Idempotente)
        for (Role role : defaultRoles) {
            // Si el rol aún no existe en la base de datos, lo guardamos
            if (roleRepository.findByName(role.getName()).isEmpty()) {
                roleRepository.save(role);
            }
        }
    }

    private void seedSuperAdmin() {
        String adminEmail = "rodrigom@pacifica.com";

        // Si el Super Admin aún no existe, lo creamos
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Rol SUPER_ADMIN no encontrado"));

            User superAdmin = User.builder()
                    .firstName("Rodrigo")
                    .paternalLastName("Mora")
                    .maternalLastName("Gomez")
                    .phone("2221918832")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("superpassword")) // Contraseña encriptada
                    .role(superAdminRole)
                    .build();

            userRepository.save(superAdmin);
            System.out.println(">>> [RoleSeeder] Usuario SUPER_ADMIN creado exitosamente: " + adminEmail);
        }
    }

}
