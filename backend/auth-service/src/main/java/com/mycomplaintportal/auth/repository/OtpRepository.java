package com.mycomplaintportal.auth.repository;

import com.mycomplaintportal.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    @Query("SELECT o FROM OtpVerification o WHERE LOWER(o.email) = LOWER(:email) AND o.otp = :otp")
    Optional<OtpVerification> findByEmailIgnoreCaseAndOtp(@Param("email") String email, @Param("otp") String otp);

    @Query("SELECT o FROM OtpVerification o WHERE LOWER(o.email) = LOWER(:email)")
    Optional<OtpVerification> findByEmailIgnoreCase(@Param("email") String email);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE LOWER(o.email) = LOWER(:email)")
    void deleteByEmailIgnoreCase(@Param("email") String email);
}
