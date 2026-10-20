package com.pacifica.backend.controllers;

import com.pacifica.backend.dtos.AuthenticationRequest;
import com.pacifica.backend.dtos.AuthenticationResponse;
import com.pacifica.backend.dtos.RegisterRequest;
import com.pacifica.backend.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest; // <-- 1. NUEVA IMPORTACIÓN PARA DETECTAR LA CONEXIÓN
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @Value("${pacifica.security.jwt.expiration:86400000}")
    private long jwtExpiration;

    // Registro con emisión de Cookie adaptable
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) { // Recibimos los datos de la conexión
        AuthenticationResponse response = service.register(request);
        ResponseCookie cookie = createJwtCookie(httpRequest, response.getToken(), jwtExpiration / 1000);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    // Login con emisión de Cookie adaptable
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletRequest httpRequest) { // Recibimos los datos de la conexión
        AuthenticationResponse response = service.authenticate(request);
        ResponseCookie cookie = createJwtCookie(httpRequest, response.getToken(), jwtExpiration / 1000);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    // Endpoint /me: Cuando Angular inicia o refresca la página
    @GetMapping("/me")
    public ResponseEntity<AuthenticationResponse> getCurrentUser() {
        return ResponseEntity.ok(service.getCurrentUser());
    }

    // Logout: Destruye la cookie en el navegador asignándole maxAge = 0
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        ResponseCookie deleteCookie = createJwtCookie(httpRequest, "", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }

    // Fábrica inteligente de Cookies blindadas
    private ResponseCookie createJwtCookie(HttpServletRequest request, String token, long maxAgeSeconds) {
        // DETECTOR INTELIGENTE:
        // Google Cloud Run envía el encabezado "X-Forwarded-Proto: https" cuando está
        // en la nube
        boolean isHttps = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));

        return ResponseCookie.from("pacifica_jwt_token", token)
                .httpOnly(true) // Blindaje contra scripts maliciosos (Anti-XSS)
                .secure(isHttps) // true en Google Cloud Run (HTTPS), false en tu localhost
                .path("/") // Válida para todo el club
                .maxAge(maxAgeSeconds) // Tiempo de vida (24 horas o 0 si es logout)
                .sameSite(isHttps ? "None" : "Lax") // "None" para viajar entre Vercel y Cloud Run, "Lax" para localhost
                .build();
    }
}
