package com.mycomplaintportal.deptadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DeptAdminServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeptAdminServiceApplication.class, args);
    }
}
