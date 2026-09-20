package com.mycomplaintportal.complaint.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ComplaintStatusConverter implements AttributeConverter<ComplaintStatus, String> {

    @Override
    public String convertToDatabaseColumn(ComplaintStatus status) {
        if (status == null) {
            return ComplaintStatus.REGISTERED.name();
        }
        return status.name();
    }

    @Override
    public ComplaintStatus convertToEntityAttribute(String dbData) {
        return ComplaintStatus.fromString(dbData);
    }
}
