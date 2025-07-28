package com.networkpro.user_service.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateDto {
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;
    private String headline;
    private String summary;
    private String location;
    private String industry;
    private String website;
    private String phoneNumber;
    private boolean profilePublic;
    private boolean contactInfoPublic;
    private boolean workExperiencePublic;
    private boolean educationPublic;
    private boolean skillsPublic;
    private String currentPosition;
    private String currentCompany;
    private List<String> skills;
}