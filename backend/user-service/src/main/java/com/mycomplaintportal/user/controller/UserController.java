package com.mycomplaintportal.user.controller;

import com.mycomplaintportal.user.entity.UserProfile;
import com.mycomplaintportal.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable("id") String userId, @RequestBody UserProfile updatedData) {
        return ResponseEntity.ok(userService.updateProfile(userId, updatedData));
    }

    @PostMapping("/{id}/update-email")
    public ResponseEntity<UserProfile> updateEmail(@PathVariable("id") String userId, @RequestBody Map<String, String> payload) {
        String newEmail = payload.get("email");
        return ResponseEntity.ok(userService.updateEmailWithReverification(userId, newEmail));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<UserProfile> toggleUserBlocked(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.toggleUserBlocked(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("id") String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User account deleted successfully."));
    }

    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
