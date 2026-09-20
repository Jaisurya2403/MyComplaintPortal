package com.mycomplaintportal.user.repository;

import com.mycomplaintportal.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {

    @Query("SELECT u FROM UserProfile u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<UserProfile> findByEmailIgnoreCase(@Param("email") String email);
}
