package com.mycomplaintportal.notification.controller;

import com.mycomplaintportal.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send-officer-email")
    public ResponseEntity<String> sendOfficerEmail(@RequestBody Map<String, String> payload) {
        notificationService.sendDepartmentOfficerEmail(
                payload.get("toEmail"),
                payload.get("complaintId"),
                payload.get("title"),
                payload.get("description"),
                payload.get("location"),
                payload.get("trackingToken")
        );
        return ResponseEntity.ok("Department officer email dispatched successfully.");
    }

    @PostMapping("/send-solved-email")
    public ResponseEntity<String> sendSolvedEmail(@RequestBody Map<String, String> payload) {
        notificationService.sendCitizenProblemSolvedEmail(
                payload.get("citizenEmail"),
                payload.get("complaintId"),
                payload.get("title"),
                payload.get("officerNotes")
        );
        return ResponseEntity.ok("Citizen problem solved notification dispatched successfully.");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtpEmail(@RequestBody Map<String, String> payload) {
        notificationService.sendVerificationOtpEmail(payload.get("email"), payload.get("otp"));
        return ResponseEntity.ok("OTP verification email dispatched successfully.");
    }
}
