package com.mycomplaintportal.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("alonewarrior123456@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Your MyComplaintPortal Verification Code");

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;'>" +
                    "<h2 style='color: #0f172a;'>🔒 Email Verification Code</h2>" +
                    "<p style='color: #475569;'>Your 6-digit verification code for MyComplaintPortal is:</p>" +
                    "<div style='font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; padding: 12px 24px; background: #ffffff; display: inline-block; border-radius: 8px; border: 2px solid #cbd5e1;'>" + otp + "</div>" +
                    "<p style='color: #64748b; font-size: 13px; margin-top: 16px;'>This code is valid for 5 minutes. If you did not request this code, please ignore this message.</p>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Live OTP email sent successfully via JavaMailSender to: {}", toEmail);
            System.out.println("=================================================================");
            System.out.println("📧 LIVE EMAIL DISPATCHED TO: " + toEmail);
            System.out.println("🔑 6-DIGIT OTP CODE: " + otp);
            System.out.println("=================================================================");
        } catch (Exception e) {
            log.error("Failed to send live OTP email to {}: {}", toEmail, e.getMessage());
            System.out.println("=================================================================");
            System.out.println("⚠️ SMTP NOTICE FOR: " + toEmail + " | 6-DIGIT OTP CODE: " + otp);
            System.out.println("=================================================================");
        }
    }

    public void sendOfficerNotificationEmail(String toEmail, String complaintId, String title, String description, String location, String pincode, String deptName, String trackingToken) {
        try {
            String targetEmail = (toEmail != null && toEmail.contains("@") && !toEmail.equalsIgnoreCase("alonewarrior123456@gmail.com"))
                    ? toEmail.trim()
                    : "b.karthikeyan1000@gmail.com";
            String trackingLink = "http://localhost:5173/track/" + (trackingToken != null ? trackingToken : complaintId);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("alonewarrior123456@gmail.com");
            helper.setTo(targetEmail);
            helper.setSubject("🚨 New Grievance Assigned: #" + complaintId + " - " + title);

            String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;'>" +
                    "<div style='background: linear-gradient(135deg, #1e293b, #0f172a); padding: 16px 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 20px;'>" +
                    "<h2 style='margin: 0; font-size: 20px;'>🚨 New Civic Grievance Assignment</h2>" +
                    "<span style='font-size: 12px; color: #94a3b8;'>MyComplaintPortal Department Alert</span>" +
                    "</div>" +

                    "<div style='background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;'>" +
                    "<p style='margin: 0 0 10px 0;'><strong>Complaint ID:</strong> <span style='color: #2563eb; font-weight: bold;'>" + complaintId + "</span></p>" +
                    "<p style='margin: 0 0 10px 0;'><strong>Title:</strong> " + title + "</p>" +
                    "<p style='margin: 0 0 10px 0;'><strong>Assigned Department:</strong> " + deptName + "</p>" +
                    "<p style='margin: 0 0 10px 0;'><strong>Location / Pincode:</strong> " + location + " (Pincode: " + pincode + ")</p>" +
                    "<p style='margin: 0 0 10px 0;'><strong>Issue Description:</strong></p>" +
                    "<blockquote style='margin: 8px 0; padding: 12px; background: #f1f5f9; border-left: 4px solid #2563eb; font-style: italic; color: #334155;'>" + description + "</blockquote>" +
                    "</div>" +

                    "<div style='text-align: center; margin-top: 24px; margin-bottom: 12px;'>" +
                    "<a href='" + trackingLink + "' style='background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.3);'>Inspect Grievance & Track Status</a>" +
                    "</div>" +
                    "<p style='font-size: 11px; text-align: center; color: #64748b;'>Officer Direct Access Link: <a href='" + trackingLink + "'>" + trackingLink + "</a></p>" +
                    "</div>";

            helper.setText(htmlBody, true);
            mailSender.send(message);

            log.info("Live officer notification email sent successfully via JavaMailSender to: {}", targetEmail);
            System.out.println("=================================================================");
            System.out.println("🚨 LIVE OFFICER EMAIL SENT TO: " + targetEmail);
            System.out.println("📋 COMPLAINT ID: " + complaintId + " | TRACKING LINK: " + trackingLink);
            System.out.println("=================================================================");
        } catch (Exception e) {
            log.error("Failed to send officer email to: {}", toEmail, e);
        }
    }
}
