package com.mycomplaintportal.complaint.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "AI_GRIEVANCE_ANALYSIS", indexes = {
    @Index(name = "IDX_AI_CMP_ID", columnList = "COMPLAINT_ID"),
    @Index(name = "IDX_AI_MATCHED_ID", columnList = "MATCHED_COMPLAINT_ID"),
    @Index(name = "IDX_AI_DUP_STATUS", columnList = "DUPLICATE_STATUS"),
    @Index(name = "IDX_AI_CREATED_AT", columnList = "CREATED_AT")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiGrievanceAnalysis {

    @Id
    @Column(name = "AI_ANALYSIS_ID", length = 64)
    private String aiAnalysisId;

    @Column(name = "COMPLAINT_ID", length = 64)
    private String complaintId;

    @Column(name = "MATCHED_COMPLAINT_ID", length = 64)
    private String matchedComplaintId;

    @Column(name = "DUPLICATE_STATUS", length = 64)
    private String duplicateStatus; // 'SAME_ONGOING_ISSUE', 'RELATED_ISSUE', 'DIFFERENT_ISSUE', 'NO_MATCH'

    @Column(name = "DUPLICATE_CONFIDENCE")
    private Double duplicateConfidence;

    @Column(name = "LOCATION_MATCH_SCORE")
    private Double locationMatchScore;

    @Column(name = "IMAGE_DESCRIPTION_MATCH")
    private Boolean imageDescriptionMatch;

    @Column(name = "IMAGE_MATCH_CONFIDENCE")
    private Double imageMatchConfidence;

    @Column(name = "PREDICTED_DEPT_ID", length = 64)
    private String predictedDepartmentId;

    @Column(name = "PREDICTED_DEPT_NAME", length = 128)
    private String predictedDepartmentName;

    @Column(name = "DEPARTMENT_CONFIDENCE")
    private Double departmentConfidence;

    @Lob
    @Column(name = "AI_REASON")
    private String aiReason;

    @Column(name = "AI_MODEL", length = 64)
    private String aiModel;

    @Column(name = "AI_STATUS", length = 32)
    private String aiStatus;

    @Column(name = "PROCESSING_TIME_MS")
    private Long processingTimeMs;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
