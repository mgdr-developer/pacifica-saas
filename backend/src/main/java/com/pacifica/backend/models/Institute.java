package com.pacifica.backend.models; 

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "institutes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Institute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // Ej: Pacífica Puebla

    @Column(nullable = false, unique = true)
    private String contactPhone; // Lo usaremos para identificar los webhooks de n8n

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Esta función se ejecuta sola justo antes de hacer el INSERT en la BD
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}