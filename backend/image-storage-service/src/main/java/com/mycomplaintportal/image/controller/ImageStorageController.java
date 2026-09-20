package com.mycomplaintportal.image.controller;

import com.mycomplaintportal.image.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class ImageStorageController {

    private final ImageStorageService imageStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Multipart file is empty");
                return ResponseEntity.badRequest().body(err);
            }
            return ResponseEntity.ok(imageStorageService.storeImage(file));
        } catch (Exception e) {
            log.error("Image upload exception: ", e);
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<?> getImage(@PathVariable("imageId") String imageId) {
        try {
            org.springframework.core.io.Resource resource = imageStorageService.getImageResource(imageId);
            String mediaType = "image/jpeg";
            if (resource.getFilename() != null && resource.getFilename().endsWith(".png")) {
                mediaType = "image/png";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mediaType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(new InputStreamResource(resource.getInputStream()));
        } catch (Exception e) {
            log.error("Error retrieving image {}: ", imageId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found: " + e.getMessage());
        }
    }
}
