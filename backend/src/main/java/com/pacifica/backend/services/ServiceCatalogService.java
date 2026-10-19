package com.pacifica.backend.services;

import com.pacifica.backend.dtos.ServiceCreateRequest;
import com.pacifica.backend.dtos.ServiceResponse;
import com.pacifica.backend.models.ServiceEntity;
import com.pacifica.backend.repositories.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;

    @Transactional
    public ServiceResponse createService(ServiceCreateRequest request) {
        if (request.name() == null || request.name().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del servicio es obligatorio");
        }

        String trimmedName = request.name().trim();
        if (serviceRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("Ya existe un servicio registrado con este nombre");
        }

        ServiceEntity service = ServiceEntity.builder()
                .name(trimmedName)
                .build();

        ServiceEntity saved = serviceRepository.save(service);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ServiceResponse updateService(UUID id, ServiceCreateRequest request) {
        if (request.name() == null || request.name().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del servicio es obligatorio");
        }

        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        String trimmedName = request.name().trim();
        if (!service.getName().equalsIgnoreCase(trimmedName) && serviceRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("Ya existe un servicio registrado con este nombre");
        }

        service.setName(trimmedName);
        ServiceEntity updated = serviceRepository.save(service);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteService(UUID id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con ID: " + id);
        }
        serviceRepository.deleteById(id);
    }

    private ServiceResponse mapToResponse(ServiceEntity service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getCreatedAt()
        );
    }
}
