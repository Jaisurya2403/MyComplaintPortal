package com.mycomplaintportal.complaint.repository;

import com.mycomplaintportal.complaint.entity.AiGrievanceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiGrievanceAnalysisRepository extends JpaRepository<AiGrievanceAnalysis, String> {

    Optional<AiGrievanceAnalysis> findByComplaintId(String complaintId);

    List<AiGrievanceAnalysis> findByMatchedComplaintId(String matchedComplaintId);

    List<AiGrievanceAnalysis> findByDuplicateStatus(String duplicateStatus);

    long countByDuplicateStatus(String duplicateStatus);
}
