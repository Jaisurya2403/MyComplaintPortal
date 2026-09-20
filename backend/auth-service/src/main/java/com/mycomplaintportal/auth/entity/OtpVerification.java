package com.mycomplaintportal.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OTP_VERIFICATIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "EMAIL", nullable = false, length = 128)
    private String email;

    @Column(name = "OTP", nullable = false, length = 16)
    private String otp;

    @Column(name = "EXPIRY_TIME", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "IS_VERIFIED", nullable = false)
    private Boolean verified;
}
