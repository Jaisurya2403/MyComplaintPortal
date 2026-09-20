package com.mycomplaintportal.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String profileImageUrl;
    private String role;
    private boolean emailVerified;
    private String message;
}
