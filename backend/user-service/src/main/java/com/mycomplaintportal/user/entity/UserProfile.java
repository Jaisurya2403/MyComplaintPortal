package com.mycomplaintportal.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_PROFILES", indexes = {
    @Index(name = "IDX_UP_EMAIL", columnList = "EMAIL"),
    @Index(name = "IDX_UP_ROLE", columnList = "ROLE")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(name = "USER_ID", length = 64)
    private String userId;

    @Column(name = "NAME", nullable = false, length = 128)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "PHONE", length = 32)
    private String phone;

    @Column(name = "LOCATION", length = 256)
    private String location;

    @Column(name = "ROLE", nullable = false, length = 32)
    private String role; // 'CITIZEN', 'SUPER_ADMIN', 'DEPARTMENT_ADMIN'

    @Column(name = "IS_BLOCKED", nullable = false)
    private boolean blocked;

    @Column(name = "EMAIL_VERIFIED", nullable = false)
    private boolean emailVerified;

    @Column(name = "PROFILE_IMAGE_URL", length = 2048)
    private String profileImageUrl;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
