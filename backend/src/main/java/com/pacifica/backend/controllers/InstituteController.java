package com.pacifica.backend.controllers;

import com.pacifica.backend.dtos.InstituteCreateRequest;
import com.pacifica.backend.dtos.InstituteResponse;
import com.pacifica.backend.services.InstituteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutes")
@RequiredArgsConstructor
public class InstituteController {

    private final InstituteService instituteService;

    @PostMapping
    public ResponseEntity<InstituteResponse> createInstitute(@RequestBody InstituteCreateRequest request) {
        InstituteResponse response = instituteService.createInstitute(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InstituteResponse>> getAllInstitutes() {
        List<InstituteResponse> responses = instituteService.getAllInstitutes();
        return ResponseEntity.ok(responses);
    }
}
