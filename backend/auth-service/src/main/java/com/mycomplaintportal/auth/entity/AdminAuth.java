package com.mycomplaintportal.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ADMINS_AUTH", indexes = {
    @Index(name = "IDX_ADMINS_EMAIL", columnList = "EMAIL"),
    @Index(name = "IDX_ADMINS_ROLE", columnList = "ROLE"),
    @Index(name = "IDX_ADMINS_CREATED_AT", columnList = "CREATED_AT")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuth {

    @Id
    @Column(name = "ADMIN_ID", length = 64)
    private String adminId;

    @Column(name = "NAME", nullable = false, length = 128)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "PASSWORD_HASH", nullable = false, length = 256)
    private String passwordHash;

    @Column(name = "PHONE", length = 32)
    private String phone;

    @Column(name = "LOCATION", length = 256)
    private String location;

    @Column(name = "ROLE", nullable = false, length = 32)
    private String role; // 'SUPER_ADMIN', 'DEPARTMENT_ADMIN'

    @Column(name = "GRANT_LEVEL", length = 64)
    private String grantLevel; // 'Super Admin', 'Department Admin'

    @Column(name = "DEPT_ID", length = 64)
    private String departmentId;

    @Column(name = "IS_BLOCKED", nullable = false)
    private boolean blocked;

    @Column(name = "EMAIL_VERIFIED", nullable = false)
    private boolean emailVerified;

    @Column(name = "PROFILE_IMAGE_URL", length = 2048)
    private String profileImageUrl;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
