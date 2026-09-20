package com.mycomplaintportal.complaint.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class EmailService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private static class InlineImageData {
        byte[] bytes;
        String contentType;
        public InlineImageData(byte[] bytes, String contentType) {
            this.bytes = bytes;
            this.contentType = contentType;
        }
    }

    private InlineImageData fetchImageData(String imgId) {
        try {
            if (imgId == null || imgId.trim().isEmpty()) return null;

            if (imgId.startsWith("data:image")) {
                int commaIdx = imgId.indexOf(",");
                if (commaIdx != -1) {
                    String header = imgId.substring(0, commaIdx);
                    String base64Data = imgId.substring(commaIdx + 1);
                    String mimeType = "image/jpeg";
                    if (header.contains("image/png")) mimeType = "image/png";
                    else if (header.contains("image/gif")) mimeType = "image/gif";
                    else if (header.contains("image/webp")) mimeType = "image/webp";

                    byte[] decoded = Base64.getDecoder().decode(base64Data);
                    return new InlineImageData(decoded, mimeType);
                }
            }

            String cleanId = imgId;
            if (cleanId.contains("/api/images/")) {
                cleanId = cleanId.substring(cleanId.lastIndexOf("/") + 1);
            }
            
            // Attempt fetching from image-storage-service (port 8087)
            String fetchUrl = cleanId.startsWith("http") ? cleanId : "http://localhost:8087/api/images/" + cleanId;
            HttpURLConnection conn = (HttpURLConnection) new URL(fetchUrl).openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(5000);

            if (conn.getResponseCode() == 200) {
                String contentType = conn.getContentType();
                if (contentType == null || !contentType.contains("image")) contentType = "image/jpeg";
                try (InputStream is = conn.getInputStream()) {
                    byte[] bytes = is.readAllBytes();
                    return new InlineImageData(bytes, contentType);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch image inline attachment for {}: {}", imgId, e.getMessage());
        }
        return null;
    }

    public void sendOfficerNotificationEmail(String officerEmail, String complaintId, String title, String description, String location, String pincode, String deptName, String trackingToken, List<String> attachmentImageIds) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            String targetEmail = (officerEmail != null && officerEmail.contains("@") && !officerEmail.equalsIgnoreCase("alonewarrior123456@gmail.com")) 
                    ? officerEmail.trim() 
                    : "b.karthikeyan1000@gmail.com";
            String trackingLink = "http://localhost:5173/track/" + (trackingToken != null ? trackingToken : complaintId);

            try {
                // Fetch images beforehand
                List<InlineImageData> inlineImages = new ArrayList<>();
                if (attachmentImageIds != null && !attachmentImageIds.isEmpty()) {
                    for (String imgId : attachmentImageIds) {
                        InlineImageData data = fetchImageData(imgId);
                        if (data != null && data.bytes != null && data.bytes.length > 0) {
                            inlineImages.add(data);
                        }
                    }
                }

                MimeMessage message = mailSender.createMimeMessage();
                // MULTIPART_MODE_MIXED_RELATED allows both inline CID images and attachments
                MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
                helper.setFrom("alonewarrior123456@gmail.com");
                helper.setTo(targetEmail);
                helper.setSubject("🚨 New Grievance Assigned: #" + complaintId + " - " + title);

                StringBuilder imgHtml = new StringBuilder();
                if (!inlineImages.isEmpty()) {
                    imgHtml.append("<div style='background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;'>");
                    imgHtml.append("<h3 style='margin: 0 0 12px 0; font-size: 15px; color: #1e293b;'>📷 Attached Photo Evidence (" + inlineImages.size() + " Image" + (inlineImages.size() > 1 ? "s" : "") + "):</h3>");
                    imgHtml.append("<div style='display: flex; flex-direction: column; gap: 12px;'>");
                    for (int i = 0; i < inlineImages.size(); i++) {
                        imgHtml.append("<div style='text-align: center; background: #f1f5f9; padding: 8px; border-radius: 8px;'>");
                        imgHtml.append("<img src='cid:evidence_").append(i).append("' style='max-width: 100%; max-height: 400px; border-radius: 6px; border: 1px solid #cbd5e1; display: inline-block;' alt='Evidence ").append(i + 1).append("' />");
                        imgHtml.append("</div>");
                    }
                    imgHtml.append("</div>");
                    imgHtml.append("</div>");
                }

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

                        imgHtml.toString() +

                        "<div style='text-align: center; margin-top: 24px; margin-bottom: 12px;'>" +
                        "<a href='" + trackingLink + "' style='background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.3);'>Inspect Grievance & Track Status</a>" +
                        "</div>" +
                        "<p style='font-size: 11px; text-align: center; color: #64748b;'>Officer Direct Access Link: <a href='" + trackingLink + "'>" + trackingLink + "</a></p>" +
                        "</div>";

                helper.setText(htmlBody, true);

                // Attach inline images for CID reference and as attachments
                for (int i = 0; i < inlineImages.size(); i++) {
                    InlineImageData data = inlineImages.get(i);
                    helper.addInline("evidence_" + i, new ByteArrayResource(data.bytes), data.contentType);
                    String ext = data.contentType.contains("png") ? ".png" : ".jpg";
                    helper.addAttachment("photo_evidence_" + (i + 1) + ext, new ByteArrayResource(data.bytes), data.contentType);
                }

                mailSender.send(message);

                log.info("Officer notification email with {} embedded images dispatched to: {}", inlineImages.size(), targetEmail);
                System.out.println("=================================================================");
                System.out.println("🚨 OFFICER NOTIFICATION EMAIL DISPATCHED TO: " + targetEmail);
                System.out.println("📸 EMBEDDED IMAGES: " + inlineImages.size());
                System.out.println("📋 COMPLAINT ID: " + complaintId + " | TRACKING LINK: " + trackingLink);
                System.out.println("=================================================================");
            } catch (Exception e) {
                log.error("SMTP Exception sending officer notification email to {}: {}", targetEmail, e.getMessage());
                System.out.println("=================================================================");
                System.out.println("⚠️ SMTP NOTICE FOR OFFICER EMAIL (" + targetEmail + "): " + e.getMessage());
                System.out.println("📋 COMPLAINT ID: " + complaintId + " | TRACKING LINK: " + trackingLink);
                System.out.println("=================================================================");
            }
        });
    }

    public void sendCitizenProblemSolvedEmail(String citizenEmail, String complaintId, String title, String officerNotes) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            String targetEmail = (citizenEmail != null && citizenEmail.contains("@")) 
                    ? citizenEmail.trim() 
                    : "717824p120@kce.ac.in";
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom("alonewarrior123456@gmail.com");
                helper.setTo(targetEmail);
                helper.setSubject("🎉 Problem Solved: Grievance #" + complaintId + " Resolved");

                String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;'>" +
                        "<div style='background: linear-gradient(135deg, #059669, #047857); padding: 16px 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 20px;'>" +
                        "<h2 style='margin: 0; font-size: 20px;'>🎉 Grievance Resolved & Verified</h2>" +
                        "<span style='font-size: 12px; color: #a7f3d0;'>MyComplaintPortal Resolution Notification</span>" +
                        "</div>" +

                        "<p style='color: #334155;'>Your reported issue <strong>#" + complaintId + " (" + title + ")</strong> has been successfully fixed by the department officer.</p>" +
                        "<p><strong>Officer Resolution Notes:</strong> " + (officerNotes != null ? officerNotes : "Issue resolved and verified on-site.") + "</p>" +
                        "<p style='color: #64748b; font-size: 13px; margin-top: 20px;'>Thank you for making our city better!</p>" +
                        "</div>";

                helper.setText(htmlBody, true);
                mailSender.send(message);

                log.info("Citizen problem solved notification email sent via JavaMailSender to: {}", targetEmail);
                System.out.println("=================================================================");
                System.out.println("🎉 CITIZEN PROBLEM SOLVED EMAIL DISPATCHED TO: " + targetEmail);
                System.out.println("📋 COMPLAINT ID: " + complaintId);
                System.out.println("=================================================================");
            } catch (Exception e) {
                log.error("SMTP Exception sending problem solved email to {}: {}", targetEmail, e.getMessage());
            }
        });
    }

    public void sendReportAlertToAdmins(List<String> adminEmails, String complaintId, String reportDate, String reportReason, String postLink, String postOwnerEmail) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                List<String> validEmails = new ArrayList<>();
                if (adminEmails != null) {
                    for (String e : adminEmails) {
                        if (e != null && e.contains("@") && !validEmails.contains(e.trim().toLowerCase())) {
                            validEmails.add(e.trim());
                        }
                    }
                }
                if (!validEmails.contains("jaisurya7482@gmail.com")) {
                    validEmails.add("jaisurya7482@gmail.com");
                }
                if (!validEmails.contains("b.karthikeyan1000@gmail.com")) {
                    validEmails.add("b.karthikeyan1000@gmail.com");
                }

                String cleanComplaintId = complaintId != null ? complaintId : "UNKNOWN";
                String cleanDate = reportDate != null ? reportDate : java.time.LocalDateTime.now().toString();
                String cleanReason = (reportReason != null && !reportReason.isBlank()) ? reportReason : "Inappropriate content or inaccurate details reported by citizen.";
                String cleanOwnerEmail = (postOwnerEmail != null && postOwnerEmail.contains("@")) ? postOwnerEmail : "Anonymous Citizen";
                String cleanLink = (postLink != null && !postLink.isBlank()) ? postLink : "http://localhost:5173/posts/" + cleanComplaintId;

                String htmlBody = "<div style='font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;'>" +
                        "<div style='background: linear-gradient(135deg, #dc2626, #991b1b); padding: 16px 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 20px;'>" +
                        "<h2 style='margin: 0; font-size: 20px;'>🚨 Post Flagged & Reported</h2>" +
                        "<span style='font-size: 12px; color: #fecaca;'>MyComplaintPortal Admin Security Alert</span>" +
                        "</div>" +

                        "<div style='background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;'>" +
                        "<p style='margin: 0 0 10px 0;'><strong>Complaint ID:</strong> <span style='color: #dc2626; font-weight: bold;'>" + cleanComplaintId + "</span></p>" +
                        "<p style='margin: 0 0 10px 0;'><strong>Date of Report:</strong> " + cleanDate + "</p>" +
                        "<p style='margin: 0 0 10px 0;'><strong>Post Owner's Email:</strong> <a href='mailto:" + cleanOwnerEmail + "' style='color: #2563eb; font-weight: bold;'>" + cleanOwnerEmail + "</a></p>" +
                        "<p style='margin: 0 0 10px 0;'><strong>Report Description / Reason:</strong></p>" +
                        "<blockquote style='margin: 8px 0; padding: 12px; background: #fef2f2; border-left: 4px solid #dc2626; font-style: italic; color: #7f1d1d;'>" + cleanReason + "</blockquote>" +
                        "</div>" +

                        "<div style='text-align: center; margin-top: 24px; margin-bottom: 12px;'>" +
                        "<a href='" + cleanLink + "' style='background-color: #dc2626; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(220,38,38,0.3);'>View Reported Post Link</a>" +
                        "</div>" +
                        "<p style='font-size: 11px; text-align: center; color: #64748b;'>Direct Post URL: <a href='" + cleanLink + "'>" + cleanLink + "</a></p>" +
                        "</div>";

                for (String adminEmail : validEmails) {
                    try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                        helper.setFrom("alonewarrior123456@gmail.com");
                        helper.setTo(adminEmail);
                        helper.setSubject("🚨 REPORT ALERT: Post #" + cleanComplaintId + " Flagged by Citizen");
                        helper.setText(htmlBody, true);

                        mailSender.send(message);
                        log.info("Report alert email successfully sent to admin: {}", adminEmail);
                        System.out.println("=================================================================");
                        System.out.println("🚨 REPORT ALERT EMAIL DISPATCHED TO ADMIN: " + adminEmail);
                        System.out.println("📋 COMPLAINT ID: " + cleanComplaintId);
                        System.out.println("📅 REPORT DATE: " + cleanDate);
                        System.out.println("👤 POST OWNER EMAIL: " + cleanOwnerEmail);
                        System.out.println("📝 REPORT REASON: " + cleanReason);
                        System.out.println("🔗 POST LINK: " + cleanLink);
                        System.out.println("=================================================================");
                    } catch (Throwable t) {
                        log.error("Failed sending report alert email to admin {}: {}", adminEmail, t.getMessage());
                    }
                }
            } catch (Throwable t) {
                log.error("Top-level exception in sendReportAlertToAdmins: {}", t.getMessage());
            }
        });
    }
}
