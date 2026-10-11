package com.pacifica.backend.services;

import com.pacifica.backend.dtos.InstituteCreateRequest;
import com.pacifica.backend.dtos.InstituteResponse;
import com.pacifica.backend.models.Institute;
import com.pacifica.backend.repositories.InstituteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InstituteService {

    private final InstituteRepository instituteRepository;

    @Transactional
    public InstituteResponse createInstitute(InstituteCreateRequest request) {
        Institute institute = Institute.builder()
                .name(request.name())
                .contactPhone(request.contactPhone())
                .build();
        
        Institute savedInstitute = instituteRepository.save(institute);
        
        return mapToResponse(savedInstitute);
    }

    @Transactional(readOnly = true)
    public List<InstituteResponse> getAllInstitutes() {
        return instituteRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public InstituteResponse updateInstitute(UUID id, InstituteCreateRequest request) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instituto no encontrado"));
        
        institute.setName(request.name());
        institute.setContactPhone(request.contactPhone());
        
        Institute updatedInstitute = instituteRepository.save(institute);
        return mapToResponse(updatedInstitute);
    }

    @Transactional
    public void deleteInstitute(UUID id) {
        if (!instituteRepository.existsById(id)) {
            throw new RuntimeException("Instituto no encontrado");
        }
        instituteRepository.deleteById(id);
    }

    private InstituteResponse mapToResponse(Institute institute) {
        return new InstituteResponse(
                institute.getId(),
                institute.getName(),
                institute.getContactPhone(),
                institute.getCreatedAt()
        );
    }
}
