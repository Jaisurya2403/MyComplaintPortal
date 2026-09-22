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
    public CommandLineRunner cleanupLegacyTables(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                try {
                    stmt.execute("DROP TABLE IF EXISTS OTP_VERIFICATIONS");
                } catch (Exception ignored) {}
                try {
                    stmt.execute("DROP TABLE IF EXISTS otp_verifications");
                } catch (Exception ignored) {}
                try {
                    stmt.execute("DROP TABLE IF EXISTS otp_verifications_seq");
                } catch (Exception ignored) {}
                System.out.println("✅ Legacy OTP table cleanup completed.");
            } catch (Exception e) {
                System.out.println("Schema cleanup notice: " + e.getMessage());
            }
        };
    }
}
