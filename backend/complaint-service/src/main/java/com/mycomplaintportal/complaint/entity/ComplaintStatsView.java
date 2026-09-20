package com.mycomplaintportal.complaint.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

@Entity
@Table(name = "VW_COMPLAINT_STATS")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStatsView {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "TOTAL_SUBMITTED")
    private long totalSubmitted;

    @Column(name = "TOTAL_RESOLVED")
    private long totalResolved;

    @Column(name = "TOTAL_PENDING")
    private long totalPending;

    @Column(name = "TOTAL_IN_PROGRESS")
    private long totalInProgress;

    @Column(name = "TOTAL_VISITED")
    private long totalVisited;

    @Column(name = "TOTAL_REPOSTS")
    private long totalReposts;

    @Column(name = "TOTAL_UPVOTES")
    private long totalUpvotes;

    @Column(name = "TOTAL_TODAY")
    private long totalToday;

    @Column(name = "TOTAL_REDIRECTED")
    private long totalRedirected;

    @Column(name = "TOTAL_REPORTED")
    private long totalReported;
}
