package com.mycomplaintportal.deptadmin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MUNICIPAL_DEPARTMENTS", indexes = {
    @Index(name = "IDX_DEPT_CODE", columnList = "DEPT_CODE"),
    @Index(name = "IDX_DEPT_ACTIVE", columnList = "IS_ACTIVE")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @Column(name = "DEPT_ID", length = 64)
    private String id;

    @Column(name = "DEPT_NAME", nullable = false, length = 128)
    private String name;

    @Column(name = "DEPT_CODE", nullable = false, unique = true, length = 32)
    private String code;

    @Column(name = "OFFICIAL_EMAIL", nullable = false, length = 128)
    private String officialEmail;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active;

    @Column(name = "TOTAL_COUNT")
    private int totalCount;

    @Column(name = "SOLVED_COUNT")
    private int solvedCount;

    @Column(name = "PENDING_COUNT")
    private int pendingCount;
}
