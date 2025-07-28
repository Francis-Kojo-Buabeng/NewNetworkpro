package com.networkpro.user_service.mapper;

import com.networkpro.user_service.dto.work.WorkExperienceDto;
import com.networkpro.user_service.model.WorkExperience;
import org.springframework.stereotype.Component;

@Component
public class WorkExperienceMapper {

    public WorkExperienceDto toDto(WorkExperience workExperience) {
        if (workExperience == null) return null;
        
        return WorkExperienceDto.builder()
                .id(workExperience.getId())
                .title(workExperience.getPosition())
                .company(workExperience.getCompany())
                .location(workExperience.getLocation())
                .startDate(workExperience.getStartDate())
                .endDate(workExperience.getEndDate())
                .isCurrentPosition(workExperience.isCurrentPosition())
                .description(workExperience.getDescription())
                .companyLogoUrl(null) //                 private String institutionLogoUrl;
                .build();
    }

    public WorkExperience toEntity(WorkExperienceDto dto) {
        if (dto == null) return null;
        
        WorkExperience workExperience = new WorkExperience();
        workExperience.setPosition(dto.getTitle());
        workExperience.setCompany(dto.getCompany());
        workExperience.setLocation(dto.getLocation());
        workExperience.setStartDate(dto.getStartDate());
        workExperience.setEndDate(dto.getEndDate());
        workExperience.setCurrentPosition(dto.isCurrentPosition());
        workExperience.setDescription(dto.getDescription());
        return workExperience;
    }
} 