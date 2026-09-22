package com.mycomplaintportal.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initOtpTable(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {

                // 1. Drop broken legacy sequence table if present
                try {
                    stmt.execute("DROP TABLE IF EXISTS otp_verifications_seq");
                } catch (Exception ignored) {}

                // 2. Drop legacy 'id' column if it exists from older schema attempts
                try {
                    stmt.execute("ALTER TABLE OTP_VERIFICATIONS DROP COLUMN id");
                } catch (Exception ignored) {}
                try {
                    stmt.execute("ALTER TABLE otp_verifications DROP COLUMN id");
                } catch (Exception ignored) {}

                // 3. Ensure OTP_VERIFICATIONS table exists with exact MySQL schema
                try {
                    stmt.execute("CREATE TABLE IF NOT EXISTS OTP_VERIFICATIONS (" +
                                 "OTP_ID VARCHAR(64) PRIMARY KEY, " +
                                 "EMAIL VARCHAR(128) NOT NULL, " +
                                 "OTP_CODE VARCHAR(16) NOT NULL, " +
                                 "EXPIRY_TIME DATETIME NOT NULL, " +
                                 "IS_USED TINYINT(1) NOT NULL DEFAULT 0, " +
                                 "CREATED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                                 "KEY IDX_OTP_EMAIL (EMAIL), " +
                                 "KEY IDX_OTP_CODE (OTP_CODE)" +
                                 ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
                    System.out.println("✅ OTP_VERIFICATIONS table schema initialized cleanly.");
                } catch (Exception e) {
                    System.out.println("OTP table init notice: " + e.getMessage());
                }
            } catch (Exception e) {
                System.out.println("Database init notice: " + e.getMessage());
            }
        };
    }
}
