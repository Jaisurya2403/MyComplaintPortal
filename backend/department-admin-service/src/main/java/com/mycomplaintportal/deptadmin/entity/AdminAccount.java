package com.mycomplaintportal.deptadmin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ADMIN_ACCOUNTS", indexes = {
    @Index(name = "IDX_ADMIN_EMAIL", columnList = "EMAIL"),
    @Index(name = "IDX_ADMIN_GRANT", columnList = "GRANT_LEVEL"),
    @Index(name = "IDX_ADMIN_DEPT", columnList = "DEPT_ID")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAccount {

    @Id
    @Column(name = "ADMIN_ID", length = 64)
    private String id;

    @Column(name = "USERNAME", nullable = false, length = 128)
    private String username;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "GRANT_LEVEL", nullable = false, length = 64)
    private String grantLevel; // 'SUPER_ADMIN', 'DEPARTMENT_ADMIN', 'EXECUTIVE_AUDITOR'

    @Column(name = "DESIGNATION", length = 128)
    private String designation;

    @Column(name = "BADGE_ID", length = 64)
    private String badgeId;

    @Column(name = "DEPT_ID", length = 64)
    private String departmentId;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active;
}
