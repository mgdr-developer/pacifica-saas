package com.pacifica.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Carpeta en el disco donde se guardarán las fotos de perfil
    private final Path storageDirectory = Paths.get("uploads/avatars");

    public FileStorageService() {
        try {
            // Creamos la carpeta automáticamente si aún no existe
            Files.createDirectories(storageDirectory);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta de almacenamiento", e);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("No se puede subir un archivo vacío");
        }

        // 1. Validamos que el archivo sea una imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("El archivo debe ser una imagen válida (PNG, JPG, WEBP)");
        }

        // 2. Generamos un nombre único e irrepetible para evitar colisiones
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.jpg";
        String cleanFilename = originalFilename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");
        String uniqueFilename = UUID.randomUUID().toString() + "_" + cleanFilename;

        try {
            // 3. Guardamos físicamente la imagen en la carpeta
            Path targetLocation = this.storageDirectory.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 4. Retornamos la ruta web para que el frontend pueda consultarla
            return "/uploads/avatars/" + uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen en el servidor", e);
        }
    }
}
