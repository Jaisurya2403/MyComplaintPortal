package com.mycomplaintportal.notification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendDepartmentOfficerEmail(String toEmail, String complaintId, String title, String description, String location, String trackingToken) {
        String trackingLink = "http://localhost:5173/admin/track/" + trackingToken;
        String htmlBody = "<h2>🚨 New Civic Grievance Assigned</h2>" +
                "<p><strong>Complaint ID:</strong> " + complaintId + "</p>" +
                "<p><strong>Title:</strong> " + title + "</p>" +
                "<p><strong>Location:</strong> " + location + "</p>" +
                "<p><strong>Description:</strong> " + description + "</p>" +
                "<p>Click the link below to inspect details and initiate action on this issue:</p>" +
                "<p><a href='" + trackingLink + "' style='background:#2563eb;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;'>Inspect & Begin Action (Change Status)</a></p>";

        sendHtmlEmail(toEmail, "Action Required: Civic Grievance #" + complaintId, htmlBody);
    }

    public void sendCitizenProblemSolvedEmail(String citizenEmail, String complaintId, String title, String officerNotes) {
        String htmlBody = "<h2>🎉 Problem Solved!</h2>" +
                "<p>Your reported grievance <strong>#" + complaintId + " (" + title + ")</strong> has been successfully resolved by the department officer.</p>" +
                "<p><strong>Officer Resolution Notes:</strong> " + (officerNotes != null ? officerNotes : "Issue fixed & verified on site.") + "</p>" +
                "<p>Thank you for making our city better through MyComplaintPortal!</p>";

        sendHtmlEmail(citizenEmail, "Problem Solved: Grievance #" + complaintId + " Resolved", htmlBody);
    }

    public void sendVerificationOtpEmail(String userEmail, String otpCode) {
        String htmlBody = "<h2>🔒 Email Verification Code</h2>" +
                "<p>Your 6-digit verification code is: <strong style='font-size:24px;color:#aa3bff;'>" + otpCode + "</strong></p>" +
                "<p>This code expires in 10 minutes.</p>";

        sendHtmlEmail(userEmail, "Verify Your Email - MyComplaintPortal", htmlBody);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("alonewarrior123456@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.warn("Could not send email to {}: {}. Continuing gracefully.", to, e.getMessage());
        }
    }
}
