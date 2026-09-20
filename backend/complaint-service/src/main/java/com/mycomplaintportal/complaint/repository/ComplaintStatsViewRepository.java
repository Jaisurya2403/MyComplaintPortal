package com.mycomplaintportal.complaint.repository;

import com.mycomplaintportal.complaint.entity.ComplaintStatsView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintStatsViewRepository extends JpaRepository<ComplaintStatsView, Long> {
}
