package com.Pirk.Pirk.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        // Ensure the upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Get the original filename of the uploaded file
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("File name is empty");
        }

        // Create a path for the new file
        Path targetLocation = uploadPath.resolve(originalFilename);

        // Copy the file to the target location
        Files.copy(file.getInputStream(), targetLocation);

        return originalFilename;  // Return the file name for storing in the database
    }

    public File getFile(String filename) {
        Path filePath = Paths.get(uploadDir).resolve(filename);
        return filePath.toFile();
    }
}
