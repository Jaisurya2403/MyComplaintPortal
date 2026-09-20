package com.mycomplaintportal.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycomplaintportal.auth.dto.AuthResponse;
import com.mycomplaintportal.auth.dto.LoginRequest;
import com.mycomplaintportal.auth.dto.SignupRequest;
import com.mycomplaintportal.auth.dto.VerifyOtpRequest;
import com.mycomplaintportal.auth.entity.AdminAuth;
import com.mycomplaintportal.auth.entity.OtpVerification;
import com.mycomplaintportal.auth.entity.UserAuth;
import com.mycomplaintportal.auth.repository.AdminAuthRepository;
import com.mycomplaintportal.auth.repository.OtpRepository;
import com.mycomplaintportal.auth.repository.UserRepository;
import com.mycomplaintportal.auth.security.JwtTokenProvider;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AdminAuthRepository adminAuthRepository;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostConstruct
    public void initSuperAdmin() {
        String superAdminEmail = "jaisurya7482@gmail.com";

        // Clean up legacy admin from USERS_AUTH to keep USERS_AUTH CITIZEN ONLY
        userRepository.findByEmailIgnoreCase(superAdminEmail).ifPresent(legacyUser -> {
            userRepository.delete(legacyUser);
            log.info("Cleaned up legacy admin from USERS_AUTH table.");
        });

        // Initialize default Super Admin in ADMINS_AUTH table
        Optional<AdminAuth> existing = adminAuthRepository.findByEmailIgnoreCase(superAdminEmail);
        if (existing.isPresent()) {
            AdminAuth superAdmin = existing.get();
            superAdmin.setPasswordHash(passwordEncoder.encode("ksjaisurya"));
            superAdmin.setRole("SUPER_ADMIN");
            superAdmin.setGrantLevel("Super Admin");
            superAdmin.setEmailVerified(true);
            superAdmin.setBlocked(false);
            adminAuthRepository.save(superAdmin);
            log.info("Default Super Admin account updated in ADMINS_AUTH table: {}", superAdminEmail);
        } else {
            AdminAuth superAdmin = AdminAuth.builder()
                    .adminId("adm-superadmin")
                    .name("Super Admin Jai Surya")
                    .email(superAdminEmail)
                    .passwordHash(passwordEncoder.encode("ksjaisurya"))
                    .role("SUPER_ADMIN")
                    .grantLevel("Super Admin")
                    .blocked(false)
                    .emailVerified(true)
                    .phone("+91 98765 43210")
                    .location("Peelamedu, Coimbatore - 641004")
                    .build();
            adminAuthRepository.save(superAdmin);
            log.info("Default Super Admin account created in ADMINS_AUTH table: {}", superAdminEmail);
        }
    }

    @Transactional
    public AuthResponse sendSignupOtp(String email) {
        String targetEmail = email.toLowerCase().trim();

        // 1 Email must be either User OR Admin across both tables
        if (userRepository.existsByEmailIgnoreCase(targetEmail) || adminAuthRepository.existsByEmailIgnoreCase(targetEmail)) {
            throw new IllegalArgumentException("This email address is already registered. 1 email can only belong to 1 user or admin account.");
        }

        return generateAndSendOtp(targetEmail);
    }

    @Transactional
    public AuthResponse sendForgotPasswordOtp(String email) {
        String targetEmail = email.toLowerCase().trim();

        boolean existsInUsers = userRepository.existsByEmailIgnoreCase(targetEmail);
        boolean existsInAdmins = adminAuthRepository.existsByEmailIgnoreCase(targetEmail);

        if (!existsInUsers && !existsInAdmins) {
            throw new IllegalArgumentException("No registered account found with email address: [" + targetEmail + "]. Please check your email or sign up.");
        }

        return generateAndSendOtp(targetEmail);
    }

    @Transactional
    public AuthResponse sendOtp(String email) {
        String targetEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmailIgnoreCase(targetEmail) || adminAuthRepository.existsByEmailIgnoreCase(targetEmail)) {
            return sendForgotPasswordOtp(targetEmail);
        }
        return generateAndSendOtp(targetEmail);
    }

    private AuthResponse generateAndSendOtp(String targetEmail) {
        otpRepository.deleteByEmailIgnoreCase(targetEmail);

        SecureRandom random = new SecureRandom();
        String otp = String.valueOf(100000 + random.nextInt(900000));

        OtpVerification otpVerification = OtpVerification.builder()
                .email(targetEmail)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        otpRepository.save(otpVerification);

        emailService.sendOtp(targetEmail, otp);

        return AuthResponse.builder()
                .email(targetEmail)
                .message("OTP sent successfully to your email [" + targetEmail + "]. Please check your inbox.")
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String targetEmail = request.getEmail().toLowerCase().trim();
        String submittedOtp = request.getOtp().trim();

        Optional<OtpVerification> otpRecord = otpRepository.findByEmailIgnoreCaseAndOtp(targetEmail, submittedOtp);

        if (otpRecord.isEmpty()) {
            return AuthResponse.builder()
                    .email(targetEmail)
                    .emailVerified(false)
                    .message("Invalid OTP code.")
                    .build();
        }

        OtpVerification otp = otpRecord.get();

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder()
                    .email(targetEmail)
                    .emailVerified(false)
                    .message("OTP has expired. Please request a new OTP.")
                    .build();
        }

        if (Boolean.TRUE.equals(otp.getVerified())) {
            return AuthResponse.builder()
                    .email(targetEmail)
                    .emailVerified(true)
                    .message("OTP is already verified.")
                    .build();
        }

        otp.setVerified(true);
        otpRepository.save(otp);

        userRepository.findByEmailIgnoreCase(targetEmail).ifPresent(user -> {
            user.setEmailVerified(true);
            userRepository.save(user);
        });

        adminAuthRepository.findByEmailIgnoreCase(targetEmail).ifPresent(admin -> {
            admin.setEmailVerified(true);
            adminAuthRepository.save(admin);
        });

        return AuthResponse.builder()
                .email(targetEmail)
                .emailVerified(true)
                .message("OTP verified successfully.")
                .build();
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String targetEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(targetEmail) || adminAuthRepository.existsByEmailIgnoreCase(targetEmail)) {
            return AuthResponse.builder()
                    .email(targetEmail)
                    .message("Email is already registered. 1 email can only belong to 1 user or admin account.")
                    .build();
        }

        SecureRandom random = new SecureRandom();
        String otpCode = String.valueOf(100000 + random.nextInt(900000));

        otpRepository.deleteByEmailIgnoreCase(targetEmail);
        OtpVerification otpVerification = OtpVerification.builder()
                .email(targetEmail)
                .otp(otpCode)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        otpRepository.save(otpVerification);

        emailService.sendOtp(targetEmail, otpCode);
        log.info("Live OTP [{}] dispatched to email: {}", otpCode, targetEmail);

        String userId = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        UserAuth newUser = UserAuth.builder()
                .userId(userId)
                .name(request.getName())
                .email(targetEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .location(request.getLocation())
                .role("CITIZEN")
                .blocked(false)
                .emailVerified(false)
                .build();

        userRepository.save(newUser);

        String token = jwtTokenProvider.generateToken(userId, newUser.getEmail(), newUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(userId)
                .name(newUser.getName())
                .email(newUser.getEmail())
                .role(newUser.getRole())
                .emailVerified(false)
                .message("User account created. A 6-digit OTP code has been sent to " + targetEmail + ". Please verify via /api/auth/verify-otp.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String targetEmail = request.getEmail().toLowerCase().trim();
        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank()) ? request.getPassword() : "ksjaisurya";

        // 1. Check ADMINS_AUTH table
        Optional<AdminAuth> adminOpt = adminAuthRepository.findByEmailIgnoreCase(targetEmail);
        if (adminOpt.isPresent()) {
            AdminAuth admin = adminOpt.get();
            if (!passwordEncoder.matches(rawPassword, admin.getPasswordHash())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (admin.isBlocked()) {
                throw new IllegalStateException("Admin account is blocked. Please contact Super Admin.");
            }
            String token = jwtTokenProvider.generateToken(admin.getAdminId(), admin.getEmail(), admin.getRole());
            return AuthResponse.builder()
                    .token(token)
                    .userId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .phone(admin.getPhone())
                    .location(admin.getLocation())
                    .profileImageUrl(admin.getProfileImageUrl())
                    .role(admin.getRole())
                    .emailVerified(admin.isEmailVerified())
                    .message("Admin login successful.")
                    .build();
        }

        // 2. Check USERS_AUTH table (CITIZENS ONLY)
        Optional<UserAuth> userOpt = userRepository.findByEmailIgnoreCase(targetEmail);
        if (userOpt.isPresent()) {
            UserAuth user = userOpt.get();
            if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (user.isBlocked()) {
                throw new IllegalStateException("User account is blocked. Please contact support.");
            }
            String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail(), user.getRole());
            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getUserId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .location(user.getLocation())
                    .profileImageUrl(user.getProfileImageUrl())
                    .role(user.getRole())
                    .emailVerified(user.isEmailVerified())
                    .message("Login successful.")
                    .build();
        }

        throw new IllegalArgumentException("Account not found with this email. Please check your credentials or sign up.");
    }

    @Transactional
    public UserAuth updateUserProfile(String userId, String name, String phone, String location, String profileImageUrl) {
        Optional<AdminAuth> adminOpt = adminAuthRepository.findById(userId);
        if (adminOpt.isEmpty()) {
            adminOpt = adminAuthRepository.findByEmailIgnoreCase(userId);
        }
        if (adminOpt.isPresent()) {
            AdminAuth admin = adminOpt.get();
            if (name != null && !name.isBlank()) admin.setName(name);
            if (phone != null && !phone.isBlank()) admin.setPhone(phone);
            if (location != null && !location.isBlank()) admin.setLocation(location);
            if (profileImageUrl != null) admin.setProfileImageUrl(profileImageUrl);
            adminAuthRepository.save(admin);
            return UserAuth.builder()
                    .userId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .phone(admin.getPhone())
                    .location(admin.getLocation())
                    .profileImageUrl(admin.getProfileImageUrl())
                    .role(admin.getRole())
                    .build();
        }

        UserAuth user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + userId)));

        if (name != null && !name.isBlank()) user.setName(name);
        if (phone != null && !phone.isBlank()) user.setPhone(phone);
        if (location != null && !location.isBlank()) user.setLocation(location);
        if (profileImageUrl != null) user.setProfileImageUrl(profileImageUrl);

        return userRepository.save(user);
    }

    @Transactional
    public AdminAuth createAdminAccount(String username, String email, String password, String role) {
        String targetEmail = email.toLowerCase().trim();
        String rawPassword = (password != null && !password.isBlank()) ? password : "ksjaisurya";
        String adminRole = (role != null && !role.isBlank()) ? role : "SUPER_ADMIN";

        // If email exists in USERS_AUTH (citizens table), remove it so it becomes an Admin account in ADMINS_AUTH
        userRepository.findByEmailIgnoreCase(targetEmail).ifPresent(legacyCitizen -> {
            userRepository.delete(legacyCitizen);
            log.info("Converted citizen account [{}] to Admin account in ADMINS_AUTH table.", targetEmail);
        });

        Optional<AdminAuth> existing = adminAuthRepository.findByEmailIgnoreCase(targetEmail);
        if (existing.isPresent()) {
            AdminAuth admin = existing.get();
            admin.setPasswordHash(passwordEncoder.encode(rawPassword));
            admin.setRole(adminRole);
            admin.setGrantLevel(adminRole.equalsIgnoreCase("SUPER_ADMIN") ? "Super Admin" : "Department Admin");
            admin.setEmailVerified(true);
            admin.setBlocked(false);
            log.info("Updated existing admin account in ADMINS_AUTH table for email: {} with role: {}", targetEmail, adminRole);
            return adminAuthRepository.save(admin);
        } else {
            AdminAuth newAdmin = AdminAuth.builder()
                    .adminId("admin-" + UUID.randomUUID().toString().substring(0, 8))
                    .name(username != null ? username : targetEmail.split("@")[0])
                    .email(targetEmail)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(adminRole)
                    .grantLevel(adminRole.equalsIgnoreCase("SUPER_ADMIN") ? "Super Admin" : "Department Admin")
                    .blocked(false)
                    .emailVerified(true)
                    .build();
            log.info("Created new admin account in ADMINS_AUTH table for email: {} with role: {}", targetEmail, adminRole);
            return adminAuthRepository.save(newAdmin);
        }
    }

    @Transactional
    public void deleteAdminAccount(String email) {
        String targetEmail = email.toLowerCase().trim();
        if ("jaisurya7482@gmail.com".equalsIgnoreCase(targetEmail)) {
            throw new IllegalArgumentException("Default Super Admin account cannot be deleted.");
        }
        adminAuthRepository.findByEmailIgnoreCase(targetEmail).ifPresent(admin -> {
            adminAuthRepository.delete(admin);
            log.info("Deleted admin account from ADMINS_AUTH table for email: {}", targetEmail);
        });
    }

    @Transactional
    public AuthResponse resetPassword(String email, String newPassword) {
        String targetEmail = email.toLowerCase().trim();

        Optional<AdminAuth> adminOpt = adminAuthRepository.findByEmailIgnoreCase(targetEmail);
        if (adminOpt.isPresent()) {
            AdminAuth admin = adminOpt.get();
            admin.setPasswordHash(passwordEncoder.encode(newPassword));
            admin.setEmailVerified(true);
            adminAuthRepository.save(admin);
            return AuthResponse.builder()
                    .userId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .role(admin.getRole())
                    .message("Password updated successfully in database.")
                    .build();
        }

        UserAuth user = userRepository.findByEmailIgnoreCase(targetEmail)
                .orElseThrow(() -> new IllegalArgumentException("No registered account found with email: " + targetEmail));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setEmailVerified(true);
        userRepository.save(user);

        return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Password updated successfully in database.")
                .build();
    }

    @Transactional
    public AuthResponse changePassword(String email, String oldPassword, String newPassword) {
        String targetEmail = email.toLowerCase().trim();

        Optional<AdminAuth> adminOpt = adminAuthRepository.findByEmailIgnoreCase(targetEmail);
        if (adminOpt.isPresent()) {
            AdminAuth admin = adminOpt.get();
            if (!passwordEncoder.matches(oldPassword, admin.getPasswordHash())) {
                throw new IllegalArgumentException("Incorrect Old Password. Please enter your correct existing password.");
            }
            if (passwordEncoder.matches(newPassword, admin.getPasswordHash())) {
                throw new IllegalArgumentException("New password cannot be the same as your old password.");
            }
            admin.setPasswordHash(passwordEncoder.encode(newPassword));
            adminAuthRepository.save(admin);
            return AuthResponse.builder()
                    .userId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .role(admin.getRole())
                    .message("Password changed successfully in database.")
                    .build();
        }

        UserAuth user = userRepository.findByEmailIgnoreCase(targetEmail)
                .orElseThrow(() -> new IllegalArgumentException("No registered account found with email: " + targetEmail));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect Old Password. Please enter your correct existing password.");
        }

        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("New password cannot be the same as your old password.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Password changed successfully in database.")
                .build();
    }

    @Transactional
    public boolean toggleUserBlocked(String userIdOrEmail) {
        Optional<UserAuth> userOpt = userRepository.findByEmailIgnoreCase(userIdOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findById(userIdOrEmail);
        }
        if (userOpt.isPresent()) {
            UserAuth u = userOpt.get();
            u.setBlocked(!u.isBlocked());
            userRepository.save(u);
            return u.isBlocked();
        }
        return false;
    }

    @Transactional
    public void deleteUser(String userIdOrEmail) {
        Optional<UserAuth> userOpt = userRepository.findByEmailIgnoreCase(userIdOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findById(userIdOrEmail);
        }
        userOpt.ifPresent(userRepository::delete);
    }

    public List<UserAuth> getAllUsersFromAuth() {
        return userRepository.findAll();
    }

    public void sendOfficerNotification(String toEmail, String complaintId, String title, String description, String location, String pincode, String deptName, String trackingToken) {
        emailService.sendOfficerNotificationEmail(toEmail, complaintId, title, description, location, pincode, deptName, trackingToken);
    }
}
