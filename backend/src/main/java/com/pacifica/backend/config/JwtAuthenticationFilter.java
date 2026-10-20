package com.pacifica.backend.config;

import com.pacifica.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Spring usa esto para buscar al usuario en la BD

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwt = null;
        final String userEmail;

        // 1. PRIMERA OPCIÓN (MÁXIMA SEGURIDAD): Buscar en la caja fuerte blindada
        // (Cookie)
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("pacifica_jwt_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }
        // 2. SEGUNDA OPCIÓN (RED DE SEGURIDAD): Buscar en el bolsillo (Header
        // Authorization)
        if (jwt == null) {
            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
            }
        }

        // 3. Si no traía gafete en ningún lado, lo dejamos continuar
        // (Spring Security lo bloqueará en la puerta si la sala requiere permiso)
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Extraer el correo usando nuestra Máquina Creadora de Gafetes
        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Si encontramos un correo y el usuario aún no está autenticado en este
        // contexto temporal
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Buscamos al usuario en la base de datos
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Si el token es matemáticamente válido
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Creamos la "anotación en la libreta de visitantes"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));
                // Guardamos la autorización temporal en el contexto
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Levantar la pluma y pasar a la siguiente etapa
        filterChain.doFilter(request, response);
    }
}