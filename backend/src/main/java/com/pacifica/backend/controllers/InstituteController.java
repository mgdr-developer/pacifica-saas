package com.pacifica.backend.controllers;

import com.pacifica.backend.dtos.InstituteCreateRequest;
import com.pacifica.backend.dtos.InstituteResponse;
import com.pacifica.backend.services.InstituteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutes")
@RequiredArgsConstructor
public class InstituteController {

    private final InstituteService instituteService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<InstituteResponse> createInstitute(@RequestBody InstituteCreateRequest request) {
        InstituteResponse response = instituteService.createInstitute(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'COACH')")
    @GetMapping
    public ResponseEntity<List<InstituteResponse>> getAllInstitutes() {
        List<InstituteResponse> responses = instituteService.getAllInstitutes();
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<InstituteResponse> updateInstitute(
            @PathVariable java.util.UUID id,
            @RequestBody InstituteCreateRequest request) {
        return ResponseEntity.ok(instituteService.updateInstitute(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstitute(@PathVariable java.util.UUID id) {
        instituteService.deleteInstitute(id);
        return ResponseEntity.noContent().build();
    }
}
