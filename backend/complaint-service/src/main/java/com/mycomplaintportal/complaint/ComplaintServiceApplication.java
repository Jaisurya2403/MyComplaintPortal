package com.mycomplaintportal.complaint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
@EnableDiscoveryClient
public class ComplaintServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ComplaintServiceApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner fixOracleConstraints(javax.sql.DataSource dataSource) {
        return args -> {
            try (java.sql.Connection conn = dataSource.getConnection();
                 java.sql.Statement stmt = conn.createStatement()) {
                try {
                    stmt.execute("ALTER TABLE COMPLAINTS DROP CONSTRAINT SYS_C007822");
                    System.out.println("✅ Successfully dropped SYS_C007822");
                } catch (Exception e) {
                    System.out.println("SYS_C007822 notice: " + e.getMessage());
                }
            } catch (Exception e) {
                System.out.println("Constraint notice: " + e.getMessage());
            }
        };
    }
}
