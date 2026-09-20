package com.mycomplaintportal.deptadmin.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mycomplaintportal.deptadmin.entity.AdminAccount;
import com.mycomplaintportal.deptadmin.entity.Department;
import com.mycomplaintportal.deptadmin.repository.AdminAccountRepository;
import com.mycomplaintportal.deptadmin.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeptAdminService {

    private final DepartmentRepository departmentRepository;
    private final AdminAccountRepository adminRepository;

    // DEPARTMENTS
//    public List<Department> getAllDepartments() {
//        return departmentRepository.findAll();
//    }
//
//    public Department createDepartment(Department department) {
//        if (department.getId() == null) {
//            department.setId("dept-" + UUID.randomUUID().toString().substring(0, 8));
//        }
//        department.setActive(true);
//        return departmentRepository.save(department);
//    }
//
////    public Department updateDepartment(String id, Department updatedData) {
////        Department existing = departmentRepository.findById(id)
////                .orElseThrow(() -> new IllegalArgumentException("Department not found for ID: " + id));
////        existing.setName(updatedData.getName());
////        existing.setOfficialEmail(updatedData.getOfficialEmail());
////        existing.setCode(updatedData.getCode());
////        existing.setDescription(updatedData.getDescription());
////        return departmentRepository.save(existing);
////    }
//
//    public Department updateDepartment(String id, Department updatedData) {
//
//        Department existing = departmentRepository.findById(id)
//                .orElseThrow(() ->
//                        new IllegalArgumentException(
//                                "Department not found for ID: " + id
//                        )
//                );
//
//        existing.setName(updatedData.getName());
//        existing.setCode(updatedData.getCode());
//
//        if (updatedData.getOfficialEmail() != null
//                && !updatedData.getOfficialEmail().trim().isEmpty()) {
//
//            existing.setOfficialEmail(
//                    updatedData.getOfficialEmail().trim()
//            );
//        }
//
//        if (updatedData.getDescription() != null) {
//            existing.setDescription(updatedData.getDescription());
//        }
//
//        return departmentRepository.save(existing);
//    }
//    
//    public void deleteDepartment(String id) {
//        departmentRepository.deleteById(id);
//    }


 // DEPARTMENTS

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department createDepartment(Department department) {

        // Generate ID if frontend did not provide one
        if (department.getId() == null || department.getId().trim().isEmpty()) {
            department.setId("dept-" + UUID.randomUUID().toString().substring(0, 8));
        }

        // Required fields
        if (department.getName() == null || department.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name is required");
        }

        if (department.getCode() == null || department.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Department code is required");
        }

        if (department.getOfficialEmail() == null ||
                department.getOfficialEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Official email is required");
        }

        department.setName(department.getName().trim());
        department.setCode(department.getCode().trim().toUpperCase());
        department.setOfficialEmail(department.getOfficialEmail().trim());

        if (department.getDescription() == null) {
            department.setDescription("");
        } else {
            department.setDescription(department.getDescription().trim());
        }

        // Default values for a newly created department
        department.setActive(true);
        department.setTotalCount(0);
        department.setSolvedCount(0);
        department.setPendingCount(0);

        return departmentRepository.save(department);
    }


    public Department updateDepartment(String id, Department updatedData) {

        Department existing = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Department not found for ID: " + id
                        )
                );

        // Update name
        if (updatedData.getName() != null &&
                !updatedData.getName().trim().isEmpty()) {

            existing.setName(
                    updatedData.getName().trim()
            );
        }

        // Update code
        if (updatedData.getCode() != null &&
                !updatedData.getCode().trim().isEmpty()) {

            existing.setCode(
                    updatedData.getCode().trim().toUpperCase()
            );
        }

        // Update official email
        if (updatedData.getOfficialEmail() != null &&
                !updatedData.getOfficialEmail().trim().isEmpty()) {

            existing.setOfficialEmail(
                    updatedData.getOfficialEmail().trim()
            );
        }

        // Update description
        if (updatedData.getDescription() != null) {

            existing.setDescription(
                    updatedData.getDescription().trim()
            );
        }

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(String id) {
        departmentRepository.deleteById(id);
    }
    // ADMINS
    public List<AdminAccount> getAllAdmins() {
        return adminRepository.findAll();
    }

    public AdminAccount createAdmin(AdminAccount admin) {
        return createAdmin(admin, "ksjaisurya", "SUPER_ADMIN");
    }

    public AdminAccount createAdmin(AdminAccount admin, String password, String role) {
        String email = admin.getEmail() != null ? admin.getEmail().trim().toLowerCase() : "";
        if (email.isBlank()) {
            throw new IllegalArgumentException("Admin email address is required.");
        }

        Optional<AdminAccount> existingOpt = adminRepository.findByEmailIgnoreCase(email);
        if (existingOpt.isPresent()) {
            throw new IllegalArgumentException("Admin account with this email already exists. Please use a different official email.");
        }

        if (admin.getId() == null) {
            admin.setId("admin-" + UUID.randomUUID().toString().substring(0, 8));
        }
        admin.setEmail(email);
        admin.setActive(true);
        AdminAccount saved = adminRepository.save(admin);

        // SYNC NEW ADMIN ACCOUNT TO AUTH-SERVICE DATABASE
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            String rawPassword = (password != null && !password.isBlank()) ? password : "ksjaisurya";
            String adminRole = (role != null && !role.isBlank()) 
                    ? role 
                    : (saved.getGrantLevel() != null && saved.getGrantLevel().toLowerCase().contains("super") ? "SUPER_ADMIN" : "DEPARTMENT_ADMIN");
            String jsonPayload = String.format(
                "{\"username\":\"%s\",\"email\":\"%s\",\"password\":\"%s\",\"role\":\"%s\"}",
                saved.getUsername() != null ? saved.getUsername() : "Admin",
                saved.getEmail(),
                rawPassword,
                adminRole
            );

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("http://localhost:8081/api/auth/create-admin"))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

            client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.err.println("Warning: Auth sync for new admin failed: " + e.getMessage());
        }

        return saved;
    }

    public AdminAccount updateAdmin(String id, AdminAccount updatedData) {
        AdminAccount existing = adminRepository.findById(id)
                .orElseGet(() -> adminRepository.findByEmailIgnoreCase(id).orElse(null));
        if (existing == null) {
            existing = AdminAccount.builder()
                    .id(id.contains("@") ? "admin-" + UUID.randomUUID().toString().substring(0, 8) : id)
                    .username(updatedData.getUsername() != null ? updatedData.getUsername() : id)
                    .email(updatedData.getEmail() != null ? updatedData.getEmail() : (id.contains("@") ? id : id + "@admin.portal"))
                    .grantLevel(updatedData.getGrantLevel() != null ? updatedData.getGrantLevel() : "Super Admin")
                    .designation(updatedData.getDesignation())
                    .badgeId(updatedData.getBadgeId())
                    .active(true)
                    .build();
        } else {
            if (updatedData.getUsername() != null && !updatedData.getUsername().isBlank()) existing.setUsername(updatedData.getUsername());
            if (updatedData.getEmail() != null && !updatedData.getEmail().isBlank()) existing.setEmail(updatedData.getEmail());
            if (updatedData.getGrantLevel() != null && !updatedData.getGrantLevel().isBlank()) existing.setGrantLevel(updatedData.getGrantLevel());
            if (updatedData.getDesignation() != null && !updatedData.getDesignation().isBlank()) existing.setDesignation(updatedData.getDesignation());
            if (updatedData.getBadgeId() != null && !updatedData.getBadgeId().isBlank()) existing.setBadgeId(updatedData.getBadgeId());
            if (updatedData.getDepartmentId() != null) existing.setDepartmentId(updatedData.getDepartmentId());
        }
        AdminAccount saved = adminRepository.save(existing);

        // SYNC UPDATED ADMIN ACCESS PERMISSIONS TO AUTH-SERVICE ADMINS_AUTH DATABASE TABLE
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            String roleStr = (saved.getGrantLevel() != null && saved.getGrantLevel().toLowerCase().contains("super")) 
                    ? "SUPER_ADMIN" 
                    : "DEPARTMENT_ADMIN";
            String jsonPayload = String.format(
                "{\"username\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}",
                saved.getUsername() != null ? saved.getUsername() : "Admin",
                saved.getEmail(),
                roleStr
            );

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("http://localhost:8081/api/auth/create-admin"))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

            client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.err.println("Warning: Auth sync on admin update failed: " + e.getMessage());
        }

        return saved;
    }

    public void deleteAdmin(String id, String requesterEmail) {
        AdminAccount admin = adminRepository.findById(id).orElseGet(() -> adminRepository.findByEmailIgnoreCase(id).orElse(null));

        if (admin != null) {
            String targetEmail = admin.getEmail() != null ? admin.getEmail().toLowerCase().trim() : "";
            if ("jaisurya7482@gmail.com".equalsIgnoreCase(targetEmail) || "adm-superadmin".equalsIgnoreCase(admin.getId())) {
                throw new IllegalArgumentException("Action denied: Default Super Admin (jaisurya7482@gmail.com) cannot be deleted.");
            }
            if (requesterEmail != null && requesterEmail.trim().equalsIgnoreCase(targetEmail)) {
                throw new IllegalArgumentException("Action denied: Administrators cannot delete their own active account.");
            }
            adminRepository.delete(admin);

            // SYNC DELETE TO AUTH-SERVICE ADMINS_AUTH TABLE
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("http://localhost:8081/api/auth/delete-admin?email=" + java.net.URLEncoder.encode(targetEmail, "UTF-8")))
                    .DELETE()
                    .build();
                client.sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            } catch (Exception e) {
                System.err.println("Warning: Auth sync delete for admin failed: " + e.getMessage());
            }
        } else {
            adminRepository.deleteById(id);
        }
    }

    public void deleteAdmin(String id) {
        deleteAdmin(id, null);
    }
}
