package com.mycomplaintportal.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "OTP_VERIFICATIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @Column(name = "OTP_ID", length = 64)
    private String id;

    @Column(name = "EMAIL", nullable = false, length = 128)
    private String email;

    @Column(name = "OTP_CODE", nullable = false, length = 16)
    private String otp;

    @Column(name = "EXPIRY_TIME", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "IS_USED", nullable = false)
    private Boolean verified;

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) {
            id = "otp-" + UUID.randomUUID().toString().substring(0, 12);
        }
        if (verified == null) {
            verified = false;
        }
    }
}
