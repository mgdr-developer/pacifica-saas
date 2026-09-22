package com.pacifica.backend.services;

import com.pacifica.backend.dtos.InstituteCreateRequest;
import com.pacifica.backend.dtos.InstituteResponse;
import com.pacifica.backend.models.Institute;
import com.pacifica.backend.repositories.InstituteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    private InstituteResponse mapToResponse(Institute institute) {
        return new InstituteResponse(
                institute.getId(),
                institute.getName(),
                institute.getContactPhone(),
                institute.getCreatedAt()
        );
    }
}
