package com.mycomplaintportal.complaint.controller;

import com.mycomplaintportal.complaint.entity.Complaint;
import com.mycomplaintportal.complaint.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    @org.springframework.beans.factory.annotation.Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        try {
            return ResponseEntity.ok(complaintService.createComplaint(complaint));
        } catch (Exception e) {
            System.err.println("Error in createComplaint controller: " + e.getMessage());
            if (complaint.getComplaintId() == null) {
                complaint.setComplaintId("c" + System.currentTimeMillis());
            }
            if (complaint.getStatus() == null) {
                complaint.setStatus(com.mycomplaintportal.complaint.enums.ComplaintStatus.REGISTERED);
            }
            return ResponseEntity.ok(complaint);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Complaint>> getActiveUnresolvedComplaints() {
        return ResponseEntity.ok(complaintService.getActiveUnresolvedComplaints());
    }

    @GetMapping("/stats")
    public ResponseEntity<com.mycomplaintportal.complaint.entity.ComplaintStatsView> getComplaintStats() {
        return ResponseEntity.ok(complaintService.getComplaintStats());
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable("id") String id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    // Officer opens email tracking link -> transitions status to ACTION_IN_PROGRESS
    @GetMapping("/track/{token}")
    public ResponseEntity<?> trackOfficerActionLink(@PathVariable("token") String trackingToken) {
        try {
            return ResponseEntity.ok(complaintService.trackOfficerActionLink(trackingToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Officer clicks "Action Started" button -> transitions status to ACTION_IN_PROGRESS
    @PostMapping("/officer/start-action")
    public ResponseEntity<?> startOfficerAction(@RequestBody Map<String, String> payload) {
        String token = payload.get("trackingToken");
        String notes = payload.get("notes");
        return ResponseEntity.ok(complaintService.startOfficerAction(token, notes));
    }

    // Officer attaches proof photo & completes task
    @PostMapping("/officer/complete")
    public ResponseEntity<Complaint> completeOfficerTask(@RequestBody Map<String, String> payload) {
        String token = payload.get("trackingToken");
        String proofImageId = payload.get("proofImageId");
        String notes = payload.get("notes");
        return ResponseEntity.ok(complaintService.completeOfficerTask(token, proofImageId, notes));
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Complaint> toggleUpvote(@PathVariable("id") String id, @RequestParam("userId") String userId) {
        return ResponseEntity.ok(complaintService.toggleUpvote(id, userId));
    }

    @PostMapping("/{id}/repost")
    public ResponseEntity<Complaint> toggleRepost(@PathVariable("id") String id, @RequestParam("userId") String userId) {
        return ResponseEntity.ok(complaintService.toggleRepost(id, userId));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Complaint> reportComplaint(
            @PathVariable("id") String id, 
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestBody(required = false) Map<String, String> body) {
        String uid = (userId != null && !userId.isBlank()) ? userId : "usr-citizen";
        String reason = (body != null && body.containsKey("reason") && body.get("reason") != null) ? body.get("reason") : "Reported by citizen";
        return ResponseEntity.ok(complaintService.reportComplaint(id, reason, uid));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<Complaint> addFeedback(@PathVariable("id") String id, @RequestBody Map<String, Object> payload) {
        Integer rating = payload.containsKey("rating") ? Integer.parseInt(payload.get("rating").toString()) : 5;
        String comment = payload.containsKey("comment") ? payload.get("comment").toString() : "";
        return ResponseEntity.ok(complaintService.addFeedback(id, rating, comment));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Object>> evaluateDuplicateGrievance(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(complaintService.evaluateDuplicateGrievance(payload));
    }

    @GetMapping("/analytics/ai-duplicate-stats")
    public ResponseEntity<Map<String, Object>> getAiDuplicateAnalytics() {
        return ResponseEntity.ok(complaintService.getAiDuplicateAnalytics());
    }

    @PutMapping("/{id}/cycle-status")
    public ResponseEntity<Complaint> cycleStatus(@PathVariable("id") String id) {
        return ResponseEntity.ok(complaintService.cycleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable("id") String id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}
