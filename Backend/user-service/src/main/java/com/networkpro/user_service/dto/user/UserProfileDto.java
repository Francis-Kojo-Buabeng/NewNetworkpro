package com.networkpro.user_service.dto.user;

import com.networkpro.user_service.dto.work.WorkExperienceDto;
import com.networkpro.user_service.dto.education.EducationDto;
import com.networkpro.user_service.dto.certification.CertificationDto;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;
    private String headline;
    private String summary;
    private String location;
    private String industry;
    private String profilePictureUrl;
    private String headerImage;
    private String website;
    private String phoneNumber;
    private boolean emailVerified;
    private int profileCompletionPercentage;
    private boolean profilePublic;
    private boolean contactInfoPublic;
    private boolean workExperiencePublic;
    private boolean educationPublic;
    private boolean skillsPublic;
    private String currentPosition;
    private String currentCompany;
    private List<String> skills;
    private List<WorkExperienceDto> workExperience;
    private List<EducationDto> education;
    private List<CertificationDto> certifications;
    private PrivacySettingsDto privacySettings;
    private boolean isProfileComplete;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}