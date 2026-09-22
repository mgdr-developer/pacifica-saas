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

        // 1. Extraer el header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Si no hay header o no empieza con "Bearer ", lo dejamos pasar (Spring
        // Security lo bloqueará más adelante si la ruta era privada)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token (quitando los primeros 7 caracteres de "Bearer ")
        jwt = authHeader.substring(7);

        // 4. Extraer el correo usando nuestra Máquina Creadora de Gafetes
        userEmail = jwtService.extractUsername(jwt);

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