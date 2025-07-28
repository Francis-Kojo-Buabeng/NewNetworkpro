package com.networkpro.user_service.mapper;

import com.networkpro.user_service.dto.certification.CertificationDto;
import com.networkpro.user_service.model.Certification;
import org.springframework.stereotype.Component;

@Component
public class CertificationMapper {

    public CertificationDto toDto(Certification certification) {
        if (certification == null) return null;
        
        return CertificationDto.builder()
                .id(certification.getId())
                .name(certification.getName())
                .issuingOrganization(certification.getIssuingOrganization())
                .issueDate(certification.getIssueDate())
                .expiryDate(certification.getExpirationDate())
                .credentialId(certification.getCredentialId())
                .credentialUrl(certification.getCredentialUrl())
                .description(certification.getDescription())
                .build();
    }

    public Certification toEntity(CertificationDto dto) {
        if (dto == null) return null;
        
        Certification certification = new Certification();
        certification.setName(dto.getName());
        certification.setIssuingOrganization(dto.getIssuingOrganization());
        certification.setIssueDate(dto.getIssueDate());
        certification.setExpirationDate(dto.getExpiryDate());
        certification.setCredentialId(dto.getCredentialId());
        certification.setCredentialUrl(dto.getCredentialUrl());
        certification.setDescription(dto.getDescription());
        return certification;
    }
} 