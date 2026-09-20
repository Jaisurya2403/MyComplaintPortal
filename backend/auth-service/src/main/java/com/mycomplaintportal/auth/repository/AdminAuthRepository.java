package com.mycomplaintportal.auth.repository;

import com.mycomplaintportal.auth.entity.AdminAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminAuthRepository extends JpaRepository<AdminAuth, String> {

    @Query("SELECT a FROM AdminAuth a WHERE LOWER(a.email) = LOWER(:email)")
    Optional<AdminAuth> findByEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM AdminAuth a WHERE LOWER(a.email) = LOWER(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);
}
