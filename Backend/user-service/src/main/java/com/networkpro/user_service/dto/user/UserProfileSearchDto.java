package com.networkpro.user_service.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileSearchDto {
    private String keyword;
    private String location;
    private String industry;
    private List<String> skills;
    private String company;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private Integer minExperienceYears;
    private Integer maxExperienceYears;
    private boolean includeIncompleteProfiles;
    private int page;
    private int size;
} 