package com.mycomplaintportal.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mycomplaintportal.auth.dto.AuthResponse;
import com.mycomplaintportal.auth.dto.LoginRequest;
import com.mycomplaintportal.auth.dto.SignupRequest;
import com.mycomplaintportal.auth.dto.VerifyOtpRequest;
import com.mycomplaintportal.auth.entity.UserAuth;
import com.mycomplaintportal.auth.security.JwtTokenProvider;
import com.mycomplaintportal.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendSignupOtp(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            AuthResponse response = authService.sendSignupOtp(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to send OTP. Please check your email and try again."));
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendForgotPasswordOtp(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            AuthResponse response = authService.sendForgotPasswordOtp(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "No registered account found with email address: [" + payload.get("email") + "]. Please check your email or sign up."));
        }
    }

    @PostMapping("/send-officer-email")
    public ResponseEntity<?> sendOfficerEmail(@RequestBody Map<String, String> payload) {
        try {
            String toEmail = payload.get("email");
            String complaintId = payload.get("complaintId");
            String title = payload.get("title");
            String description = payload.get("description");
            String location = payload.get("location");
            String pincode = payload.get("pincode");
            String deptName = payload.get("deptName");
            String trackingToken = payload.get("trackingToken");

            authService.sendOfficerNotification(toEmail, complaintId, title, description, location, pincode, deptName, trackingToken);
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Officer email dispatched successfully."));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "NOTICE", "message", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        AuthResponse response = authService.sendOtp(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(AuthResponse.builder()
                    .email(request.getEmail())
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAuth>> getAllUsersFromAuth() {
        return ResponseEntity.ok(authService.getAllUsersFromAuth());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String newPassword = payload.get("newPassword");
            AuthResponse response = authService.resetPassword(email, newPassword);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to reset password. Please try again."));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String oldPassword = payload.get("oldPassword");
            String newPassword = payload.get("newPassword");
            AuthResponse response = authService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to change password. Please try again."));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdminAccount(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");
        String role = payload.get("role");
        authService.createAdminAccount(username, email, password, role);
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "message", "Admin account successfully created/updated in authentication database.",
            "email", email
        ));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<com.mycomplaintportal.auth.entity.UserAuth> updateUserProfile(@PathVariable("userId") String userId, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String phone = payload.get("phone");
        String location = payload.get("location");
        String profileImageUrl = payload.get("profileImageUrl");
        return ResponseEntity.ok(authService.updateUserProfile(userId, name, phone, location, profileImageUrl));
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<Map<String, Object>> toggleUserBlockedInAuth(@PathVariable("userId") String userId) {
        boolean isBlocked = authService.toggleUserBlocked(userId);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "blocked", isBlocked));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUserInAuth(@PathVariable("userId") String userId) {
        authService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "User account deleted successfully."));
    }

    @DeleteMapping("/delete-admin")
    public ResponseEntity<Map<String, String>> deleteAdminAccount(@RequestParam("email") String email) {
        authService.deleteAdminAccount(email);
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "message", "Admin account successfully deleted from authentication database.",
            "email", email
        ));
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam("token") String token) {
        boolean isValid = jwtTokenProvider.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}
