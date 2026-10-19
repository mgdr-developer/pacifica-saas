package com.pacifica.backend.controllers;

import com.pacifica.backend.dtos.ServiceCreateRequest;
import com.pacifica.backend.dtos.ServiceResponse;
import com.pacifica.backend.services.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    @PostMapping
    public ResponseEntity<ServiceResponse> createService(@RequestBody ServiceCreateRequest request) {
        ServiceResponse response = serviceCatalogService.createService(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        List<ServiceResponse> responses = serviceCatalogService.getAllServices();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable UUID id,
            @RequestBody ServiceCreateRequest request) {
        return ResponseEntity.ok(serviceCatalogService.updateService(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable UUID id) {
        serviceCatalogService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
