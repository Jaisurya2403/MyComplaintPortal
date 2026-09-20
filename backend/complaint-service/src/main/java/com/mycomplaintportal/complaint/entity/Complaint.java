package com.mycomplaintportal.complaint.entity;

import com.mycomplaintportal.complaint.enums.ComplaintStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "COMPLAINTS", indexes = {
    @Index(name = "IDX_CMP_STATUS", columnList = "STATUS"),
    @Index(name = "IDX_CMP_PINCODE", columnList = "PINCODE"),
    @Index(name = "IDX_CMP_USER_ID", columnList = "USER_ID"),
    @Index(name = "IDX_CMP_DEPT_ID", columnList = "DEPT_ID"),
    @Index(name = "IDX_CMP_CREATED_AT", columnList = "CREATED_AT"),
    @Index(name = "IDX_CMP_TRACKING_TOKEN", columnList = "TRACKING_TOKEN")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @Column(name = "COMPLAINT_ID", length = 64)
    private String complaintId;

    @Column(name = "TITLE", nullable = false, length = 256)
    private String title;

    @Lob
    @Column(name = "DESCRIPTION", nullable = false)
    private String description;

    @Column(name = "PINCODE", nullable = false, length = 16)
    private String pincode;

    @Column(name = "LOCATION_NAME", nullable = false, length = 256)
    private String locationName;

    @Column(name = "DEPT_ID", length = 64)
    private String departmentId;

    @Column(name = "DEPT_NAME", length = 128)
    private String departmentName;

    @Column(name = "OFFICER_EMAIL", length = 128)
    private String officerEmail;

    @Convert(converter = com.mycomplaintportal.complaint.enums.ComplaintStatusConverter.class)
    @Column(name = "STATUS", nullable = false, length = 32)
    private ComplaintStatus status;

    @Column(name = "UPVOTES", nullable = false)
    private int upvotes;

    @Column(name = "REPOSTS", nullable = false)
    private int reposts;

    @Column(name = "IS_REPORTED", nullable = false)
    private boolean reported;

    @Column(name = "REPORT_COUNT")
    private int reportCount;

    @Column(name = "USER_ID", nullable = false, length = 64)
    private String userId;

    @Column(name = "USER_NAME", nullable = false, length = 128)
    private String userName;

    @Column(name = "USER_EMAIL", length = 128)
    private String userEmail;

    @Column(name = "TRACKING_TOKEN", length = 128, unique = true)
    private String trackingToken;

    @Column(name = "PROOF_IMAGE_ID", length = 128)
    private String proofImageId;

    @Lob
    @Column(name = "OFFICER_NOTES")
    private String officerNotes;

    @Column(name = "WAS_REDIRECTED")
    private boolean wasRedirected;

    @Column(name = "REDIRECTED_FROM_DEPT", length = 128)
    private String redirectedFromDeptName;

    @Column(name = "FEEDBACK_RATING")
    private Integer feedbackRating;

    @Column(name = "FEEDBACK_COMMENT", length = 512)
    private String feedbackComment;

    @Column(name = "FEEDBACK_DATE")
    private LocalDateTime feedbackDate;

    @Column(name = "AI_MATCHED_GRIEVANCE_ID", length = 64)
    private String aiMatchedGrievanceId;

    @Column(name = "AI_MATCH_TYPE", length = 64)
    private String aiMatchType;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "RESOLVED_AT")
    private LocalDateTime resolvedAt;

    @ElementCollection
    @CollectionTable(name = "COMPLAINT_ATTACHMENTS", joinColumns = @JoinColumn(name = "COMPLAINT_ID"))
    @Column(name = "GRIDFS_IMAGE_ID")
    @Builder.Default
    private List<String> attachmentImageIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "COMPLAINT_UPVOTES", joinColumns = @JoinColumn(name = "COMPLAINT_ID"))
    @Column(name = "USER_ID")
    @Builder.Default
    private java.util.Set<String> upvotedByUsers = new java.util.HashSet<>();

    @ElementCollection
    @CollectionTable(name = "COMPLAINT_REPOSTS", joinColumns = @JoinColumn(name = "COMPLAINT_ID"))
    @Column(name = "USER_ID")
    @Builder.Default
    private java.util.Set<String> repostedByUsers = new java.util.HashSet<>();

    @ElementCollection
    @CollectionTable(name = "COMPLAINT_REPORTS", joinColumns = @JoinColumn(name = "COMPLAINT_ID"))
    @Column(name = "USER_ID")
    @Builder.Default
    private java.util.Set<String> reportedByUsers = new java.util.HashSet<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ComplaintStatus.REGISTERED;
        }
    }
}
