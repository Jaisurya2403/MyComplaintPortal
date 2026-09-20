package com.mycomplaintportal.user.service;

import com.mycomplaintportal.user.entity.UserProfile;
import com.mycomplaintportal.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserProfileRepository userRepository;

    public UserProfile getUserProfile(String userIdOrEmail) {
        return userRepository.findById(userIdOrEmail)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(userIdOrEmail)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for ID or Email: " + userIdOrEmail)));
    }

    @Transactional
    public UserProfile updateProfile(String userIdOrEmail, UserProfile updatedData) {
        UserProfile existing = userRepository.findById(userIdOrEmail)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(userIdOrEmail)
                .orElseGet(() -> {
                    String email = (updatedData.getEmail() != null && !updatedData.getEmail().isBlank()) 
                            ? updatedData.getEmail().toLowerCase() 
                            : userIdOrEmail.toLowerCase();
                    return UserProfile.builder()
                            .userId(userIdOrEmail)
                            .email(email)
                            .name(updatedData.getName() != null ? updatedData.getName() : "Citizen User")
                            .role("CITIZEN")
                            .blocked(false)
                            .emailVerified(true)
                            .build();
                }));

        if (updatedData.getName() != null && !updatedData.getName().isBlank()) {
            existing.setName(updatedData.getName());
        }
        if (updatedData.getPhone() != null && !updatedData.getPhone().isBlank()) {
            existing.setPhone(updatedData.getPhone());
        }
        if (updatedData.getLocation() != null && !updatedData.getLocation().isBlank()) {
            existing.setLocation(updatedData.getLocation());
        }
        if (updatedData.getProfileImageUrl() != null) {
            existing.setProfileImageUrl(updatedData.getProfileImageUrl());
        }

        return userRepository.save(existing);
    }

    @Transactional
    public UserProfile updateEmailWithReverification(String userId, String newEmail) {
        UserProfile existing = getUserProfile(userId);

        if (!existing.getEmail().equalsIgnoreCase(newEmail)) {
            existing.setEmail(newEmail.toLowerCase());
            existing.setEmailVerified(false);
        }

        return userRepository.save(existing);
    }
    
    @Transactional
    public UserProfile toggleUserBlocked(String userIdOrEmail) {
        UserProfile existing = userRepository.findById(userIdOrEmail)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(userIdOrEmail).orElse(null));
        
        if (existing == null) {
            existing = UserProfile.builder()
                    .userId(userIdOrEmail)
                    .email(userIdOrEmail.contains("@") ? userIdOrEmail : userIdOrEmail + "@citizen.portal")
                    .name("Citizen User")
                    .role("CITIZEN")
                    .blocked(true)
                    .emailVerified(true)
                    .build();
        } else {
            existing.setBlocked(!existing.isBlocked());
        }

        UserProfile saved = userRepository.save(existing);

        // Async sync with auth-service USERS_AUTH table
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("http://localhost:8081/api/auth/users/" + java.net.URLEncoder.encode(saved.getEmail(), java.nio.charset.StandardCharsets.UTF_8) + "/block"))
                    .PUT(java.net.http.HttpRequest.BodyPublishers.noBody())
                    .build();
            client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            log.warn("Background auth sync warning on toggleUserBlocked: {}", e.getMessage());
        }

        return saved;
    }

    @Transactional
    public void deleteUser(String userIdOrEmail) {
        try {
            Optional<UserProfile> userOpt = userRepository.findById(userIdOrEmail);
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByEmailIgnoreCase(userIdOrEmail);
            }
            userOpt.ifPresent(userRepository::delete);
        } catch (Exception e) {
            log.warn("Delete user profile database warning: {}", e.getMessage());
        }

        // Async sync with auth-service USERS_AUTH table
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("http://localhost:8081/api/auth/users/" + java.net.URLEncoder.encode(userIdOrEmail, java.nio.charset.StandardCharsets.UTF_8)))
                    .DELETE()
                    .build();
            client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            log.warn("Background auth sync warning on deleteUser: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public List<UserProfile> getAllUsers() {
        List<UserProfile> localUsers = userRepository.findAll();
        java.util.Set<String> existingEmails = localUsers.stream()
                .map(u -> u.getEmail() != null ? u.getEmail().toLowerCase() : "")
                .collect(java.util.stream.Collectors.toSet());

        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("http://localhost:8081/api/auth/users"))
                    .GET()
                    .build();
            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                List<java.util.Map<String, Object>> authUsers = mapper.readValue(response.body(), List.class);
                for (java.util.Map<String, Object> au : authUsers) {
                    String email = (String) au.get("email");
                    String role = (String) au.get("role");
                    if (email != null && !existingEmails.contains(email.toLowerCase()) && !"SUPER_ADMIN".equalsIgnoreCase(role) && !"DEPARTMENT_ADMIN".equalsIgnoreCase(role)) {
                        String name = (String) au.getOrDefault("name", "Citizen User");
                        String phone = (String) au.getOrDefault("phone", "");
                        String location = (String) au.getOrDefault("location", "");
                        String profileImageUrl = (String) au.getOrDefault("profileImageUrl", "");
                        Boolean isBlocked = (Boolean) au.getOrDefault("blocked", false);

                        Object rawCreated = au.get("createdAt");
                        java.time.LocalDateTime createdDt = java.time.LocalDateTime.now();
                        if (rawCreated instanceof String) {
                            try {
                                createdDt = java.time.LocalDateTime.parse((String) rawCreated);
                            } catch (Exception e) {}
                        }

                        UserProfile synced = UserProfile.builder()
                                .userId((String) au.getOrDefault("userId", "usr-" + java.util.UUID.randomUUID().toString().substring(0, 8)))
                                .name(name)
                                .email(email)
                                .phone(phone)
                                .location(location)
                                .profileImageUrl(profileImageUrl)
                                .role(role != null ? role : "CITIZEN")
                                .blocked(isBlocked != null && isBlocked)
                                .emailVerified(true)
                                .createdAt(createdDt)
                                .build();
                        try {
                            userRepository.save(synced);
                        } catch (Exception ex) {}
                        localUsers.add(synced);
                        existingEmails.add(email.toLowerCase());
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not sync users from USERS_AUTH: {}", e.getMessage());
        }

        return localUsers.stream()
                .filter(u -> u.getRole() == null || "CITIZEN".equalsIgnoreCase(u.getRole()))
                .filter(u -> u.getEmail() == null || !u.getEmail().toLowerCase().contains("@citizen.portal"))
                .filter(u -> u.getEmail() == null || !u.getEmail().equalsIgnoreCase("jaisurya7482@gmail.com"))
                .collect(java.util.stream.Collectors.toList());
    }
}
