package com.networkpro.user_service.service.certification;

import com.networkpro.user_service.model.Certification;
import com.networkpro.user_service.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CertificationService {

    private final CertificationRepository certificationRepository;

    // Create new certification
    public Certification createCertification(Certification certification) {
        log.info("Creating new certification for user: {}", certification.getUserProfile().getId());
        return certificationRepository.save(certification);
    }

    // Get certification by ID
    public Optional<Certification> getCertificationById(Long id) {
        log.info("Fetching certification with ID: {}", id);
        return certificationRepository.findById(id);
    }

    // Get all certifications for a user
    public List<Certification> getCertificationsByUserId(Long userId) {
        log.info("Fetching certifications for user: {}", userId);
        return certificationRepository.findByUserProfileId(userId);
    }

    // Update certification
    public Certification updateCertification(Long id, Certification updatedCertification) {
        log.info("Updating certification with ID: {}", id);
        return certificationRepository.findById(id)
                .map(existingCertification -> {
                    existingCertification.setName(updatedCertification.getName());
                    existingCertification.setIssuingOrganization(updatedCertification.getIssuingOrganization());
                    existingCertification.setCredentialId(updatedCertification.getCredentialId());
                    existingCertification.setCredentialUrl(updatedCertification.getCredentialUrl());
                    existingCertification.setIssueDate(updatedCertification.getIssueDate());
                    existingCertification.setExpirationDate(updatedCertification.getExpirationDate());
                    existingCertification.setDoesNotExpire(updatedCertification.isDoesNotExpire());
                    existingCertification.setDescription(updatedCertification.getDescription());
                    existingCertification.setSkills(updatedCertification.getSkills());
                    
                    return certificationRepository.save(existingCertification);
                })
                .orElseThrow(() -> new RuntimeException("Certification not found with ID: " + id));
    }

    // Delete certification
    public void deleteCertification(Long id) {
        log.info("Deleting certification with ID: {}", id);
        certificationRepository.deleteById(id);
    }

    // Find certifications by name
    public List<Certification> findCertificationsByName(String name) {
        log.info("Finding certifications with name: {}", name);
        return certificationRepository.findByNameContainingIgnoreCase(name);
    }

    // Find certifications by issuing organization
    public List<Certification> findCertificationsByOrganization(String organization) {
        log.info("Finding certifications from organization: {}", organization);
        return certificationRepository.findByIssuingOrganizationContainingIgnoreCase(organization);
    }

    // Find certifications by credential ID
    public List<Certification> findCertificationsByCredentialId(String credentialId) {
        log.info("Finding certification with credential ID: {}", credentialId);
        return certificationRepository.findByCredentialId(credentialId);
    }

    // Find active certifications (not expired) for a user
    public List<Certification> findActiveCertificationsByUserId(Long userId) {
        log.info("Finding all active certifications for user {}", userId);
        return certificationRepository.findActiveCertificationsByUserId(userId, java.time.LocalDate.now());
    }

    // Find expired certifications for a user
    public List<Certification> findExpiredCertificationsByUserId(Long userId) {
        log.info("Finding all expired certifications for user {}", userId);
        return certificationRepository.findExpiredCertificationsByUserId(userId, java.time.LocalDate.now());
    }

    // Find certifications expiring soon for a user
    public List<Certification> findCertificationsExpiringSoonByUserId(Long userId) {
        log.info("Finding certifications expiring soon for user {}", userId);
        java.time.LocalDate now = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysFromNow = now.plusDays(30);
        return certificationRepository.findCertificationsExpiringBetweenByUserId(userId, now, thirtyDaysFromNow);
    }

    // Find certifications by skills
    public List<Certification> findCertificationsBySkills(String skill) {
        log.info("Finding certifications with skills: {}", skill);
        return certificationRepository.findBySkillsContaining(skill);
    }

    // Find certifications by user and organization
    public List<Certification> findCertificationsByUserAndOrganization(Long userId, String organization) {
        log.info("Finding certifications for user {} from organization: {}", userId, organization);
        return certificationRepository.findByUserProfileIdAndIssuingOrganizationContainingIgnoreCase(userId, organization);
    }

    // Find certifications that don't expire
    public List<Certification> findNonExpiringCertifications() {
        log.info("Finding all non-expiring certifications");
        return certificationRepository.findByDoesNotExpireTrue();
    }

    // Find certifications by issue date range
    public List<Certification> findCertificationsByIssueDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Finding certifications issued between {} and {}", startDate, endDate);
        return certificationRepository.findByIssueDateBetween(startDate, endDate);
    }

    // Check if certification is expired
    public boolean isCertificationExpired(Long certificationId) {
        return certificationRepository.findById(certificationId)
                .map(certification -> {
                    if (certification.isDoesNotExpire()) {
                        return false;
                    }
                    return certification.getExpirationDate() != null && 
                           certification.getExpirationDate().isBefore(LocalDate.now());
                })
                .orElse(false);
    }

    // Get certifications expiring in next 30 days
    public List<Certification> getCertificationsExpiringSoon() {
        LocalDate now = LocalDate.now();
        LocalDate thirtyDaysFromNow = now.plusDays(30);
        return certificationRepository.findCertificationsExpiringBetween(now, thirtyDaysFromNow);
    }

    // Renew certification
    public Certification renewCertification(Long certificationId, LocalDate newExpirationDate) {
        log.info("Renewing certification {} with new expiration date: {}", certificationId, newExpirationDate);
        return certificationRepository.findById(certificationId)
                .map(certification -> {
                    certification.setExpirationDate(newExpirationDate);
                    certification.setDoesNotExpire(false);
                    return certificationRepository.save(certification);
                })
                .orElseThrow(() -> new RuntimeException("Certification not found with ID: " + certificationId));
    }
} 