package com.mycomplaintportal.complaint.repository;

import com.mycomplaintportal.complaint.entity.Complaint;
import com.mycomplaintportal.complaint.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    Optional<Complaint> findByTrackingToken(String trackingToken);
    List<Complaint> findByPincode(String pincode);
    List<Complaint> findByUserId(String userId);
    List<Complaint> findByPincodeAndStatusNotIn(String pincode, List<ComplaintStatus> excludedStatuses);
    List<Complaint> findByStatusNotIn(List<ComplaintStatus> excludedStatuses);
}
