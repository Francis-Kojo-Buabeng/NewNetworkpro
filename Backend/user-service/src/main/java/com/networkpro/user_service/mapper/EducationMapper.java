package com.networkpro.user_service.mapper;

import com.networkpro.user_service.dto.education.EducationDto;
import com.networkpro.user_service.model.Education;
import org.springframework.stereotype.Component;

@Component
public class EducationMapper {

    public EducationDto toDto(Education education) {
        if (education == null) return null;
        
        return EducationDto.builder()
                .id(education.getId())
                .institution(education.getInstitution())
                .degree(education.getDegree())
                .fieldOfStudy(education.getFieldOfStudy())
                .startDate(education.getStartDate())
                .endDate(education.getEndDate())
                .grade(education.getGrade())
                .description(education.getDescription())
                .institutionLogoUrl(null) // TODO: Add institution logo URL field to entity
                .build();
    }

    public Education toEntity(EducationDto dto) {
        if (dto == null) return null;
        
        Education education = new Education();
        education.setInstitution(dto.getInstitution());
        education.setDegree(dto.getDegree());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartDate(dto.getStartDate());
        education.setEndDate(dto.getEndDate());
        education.setGrade(dto.getGrade());
        education.setDescription(dto.getDescription());
        return education;
    }
} 