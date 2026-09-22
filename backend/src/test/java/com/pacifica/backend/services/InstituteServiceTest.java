package com.pacifica.backend.services;

import com.pacifica.backend.dtos.InstituteCreateRequest;
import com.pacifica.backend.dtos.InstituteResponse;
import com.pacifica.backend.models.Institute;
import com.pacifica.backend.repositories.InstituteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Le decimos a JUnit que vamos a usar los "actores falsos" de Mockito
@ExtendWith(MockitoExtension.class)
public class InstituteServiceTest {

    // @Mock crea la "gasolina falsa". Un repositorio que no toca ninguna base de
    // datos.
    @Mock
    private InstituteRepository instituteRepository;

    // @InjectMocks crea tu motor real (InstituteService) y le inyecta el
    // repositorio falso por dentro.
    @InjectMocks
    private InstituteService instituteService;

    @Test
    @DisplayName("Debe crear un instituto exitosamente y retornar el DTO correcto")
    void shouldCreateInstituteSuccessfully() {
        // 1. PREPARACIÓN (Arrange)
        InstituteCreateRequest request = new InstituteCreateRequest("Pacífica CDMX", "5551234567");

        Institute savedInstitute = Institute.builder()
                .id(UUID.randomUUID())
                .name("Pacífica CDMX")
                .contactPhone("5551234567")
                .createdAt(LocalDateTime.now())
                .build();

        // Le enseñamos al actor falso su guion: "Cuando alguien llame a save(),
        // devuelve este objeto"
        when(instituteRepository.save(any(Institute.class))).thenReturn(savedInstitute);

        // 2. EJECUCIÓN (Act)
        InstituteResponse response = instituteService.createInstitute(request);

        // 3. VERIFICACIÓN (Assert)
        assertNotNull(response.id());
        assertEquals("Pacífica CDMX", response.name());

        // Verificamos que el repositorio falso haya sido llamado exactamente 1 vez
        verify(instituteRepository).save(any(Institute.class));
    }
}
