package com.mycomplaintportal.image.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class ImageStorageService {

    @Autowired(required = false)
    private GridFsTemplate gridFsTemplate;

    private final Path storageFolder = Paths.get("uploads").toAbsolutePath().normalize();

    public ImageStorageService() {
        try {
            Files.createDirectories(storageFolder);
            log.info("Local File Storage directory initialized at: {}", storageFolder);
        } catch (Exception e) {
            log.error("Failed to initialize storage directory: {}", e.getMessage());
        }
    }

    public Map<String, String> storeImage(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        String contentType = file.getContentType();
        String imageId = null;

        if (gridFsTemplate != null) {
            try {
                ObjectId id = gridFsTemplate.store(file.getInputStream(), fileName, contentType);
                if (id != null) {
                    imageId = id.toString();
                    log.info("Image successfully stored in MongoDB Atlas GridFS with ID: {}", imageId);
                }
            } catch (Throwable t) {
                log.warn("MongoDB Atlas storage failed ({}), using local disk storage fallback.", t.getMessage());
            }
        }

        if (imageId == null) {
            imageId = saveToDisk(file);
        }

        String streamUrl = "http://localhost:9999/api/images/" + imageId;

        Map<String, String> response = new HashMap<>();
        response.put("imageId", imageId);
        response.put("fileName", fileName);
        response.put("contentType", contentType);
        response.put("imageUrl", streamUrl);
        response.put("message", "Image uploaded successfully.");

        return response;
    }

    private String saveToDisk(MultipartFile file) throws IOException {
        String uniqueId = "img-" + UUID.randomUUID().toString().substring(0, 8);
        String extension = getExtension(file.getOriginalFilename());
        String targetFilename = uniqueId + extension;
        Path targetPath = storageFolder.resolve(targetFilename);
        Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        log.info("Image saved to local disk storage: {}", targetPath);
        return uniqueId;
    }

    public Resource getImageResource(String imageId) throws IOException {
        if (gridFsTemplate != null) {
            try {
                GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(imageId)));
                if (file != null) {
                    return gridFsTemplate.getResource(file);
                }
            } catch (Throwable t) {
                log.warn("MongoDB GridFS retrieval failed: {}. Checking local disk storage.", t.getMessage());
            }
        }

        File directory = storageFolder.toFile();
        File[] matches = directory.listFiles((dir, name) -> name.startsWith(imageId));
        if (matches != null && matches.length > 0) {
            return new FileSystemResource(matches[0]);
        }
        throw new IllegalArgumentException("Image file not found with ID: " + imageId);
    }

    private String getExtension(String originalFilename) {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return ".jpg";
    }
}
