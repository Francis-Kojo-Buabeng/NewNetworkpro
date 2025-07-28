package com.networkpro.user_service.dto.privacy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettingsDto {
    private Long id;
    private boolean profileVisible;
    private boolean showEmail;
    private boolean showPhone;
    private boolean showDateOfBirth;
    private boolean showWorkExperience;
    private boolean showEducation;
    private boolean showCertifications;
    private boolean allowSearchByEmail;
    private boolean allowSearchByPhone;
    private boolean allowConnectionRequests;
    private boolean allowMessages;
}