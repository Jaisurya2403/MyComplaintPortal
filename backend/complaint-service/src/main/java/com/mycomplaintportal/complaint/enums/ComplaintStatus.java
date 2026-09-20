package com.mycomplaintportal.complaint.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ComplaintStatus {
    REGISTERED,
    VISITED,
    ACTION_IN_PROGRESS,
    RESOLVED;

    @JsonCreator
    public static ComplaintStatus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return REGISTERED;
        }
        String clean = value.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        switch (clean) {
            case "RESOLVED":
            case "COMPLETED":
            case "CLOSED":
            case "APPROVED":
                return RESOLVED;
            case "ACTION_IN_PROGRESS":
            case "IN_PROGRESS":
                return ACTION_IN_PROGRESS;
            case "VISITED":
                return VISITED;
            case "REGISTERED":
            case "CREATED":
            case "EMAIL_SENT":
            case "ACKNOWLEDGED":
            case "AI_CLASSIFIED":
            case "PENDING":
            default:
                return REGISTERED;
        }
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}


