package com.mycomplaintportal.ai.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mycomplaintportal.ai.service.AiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/classify")
    public ResponseEntity<Map<String, Object>> classifyProblemAndDepartment(@RequestBody Map<String, Object> payload) {
        String description = (String) payload.get("description");
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) payload.getOrDefault("images", Collections.emptyList());
        return ResponseEntity.ok(aiService.classifyProblemAndDepartment(description, imageUrls));
    }

    @PostMapping("/detect-mismatch")
    public ResponseEntity<Map<String, Object>> detectMismatch(@RequestBody Map<String, Object> payload) {
        String description = (String) payload.get("description");
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) payload.getOrDefault("images", Collections.emptyList());
        return ResponseEntity.ok(aiService.detectDescriptionImageMismatch(description, imageUrls));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Object>> checkDuplicateInArea(@RequestBody Map<String, String> payload) {
        String description = payload.get("description");
        String pincode = payload.get("pincode");
        String deptId = payload.get("departmentId");
        return ResponseEntity.ok(aiService.checkDuplicateInArea(description, pincode, deptId));
    }

    @PostMapping("/evaluate-duplicate")
    public ResponseEntity<Map<String, Object>> evaluateDuplicateGrievance(@RequestBody Map<String, Object> payload) {
        String description = (String) payload.get("description");
        String locationName = (String) payload.get("locationName");
        String pincode = (String) payload.get("pincode");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) payload.getOrDefault("candidateGrievances", Collections.emptyList());
        return ResponseEntity.ok(aiService.evaluateDuplicateGrievance(description, locationName, pincode, candidates));
    }
}
