package com.networkpro.user_service.service.education;

import com.networkpro.user_service.model.Education;
import com.networkpro.user_service.repository.EducationRepository;
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
public class EducationService {

    private final EducationRepository educationRepository;

    // Create new education
    public Education createEducation(Education education) {
        log.info("Creating new education for user: {}", education.getUserProfile().getId());
        return educationRepository.save(education);
    }

    // Get education by ID
    public Optional<Education> getEducationById(Long id) {
        log.info("Fetching education with ID: {}", id);
        return educationRepository.findById(id);
    }

    // Get all education for a user
    public List<Education> getEducationByUserId(Long userId) {
        log.info("Fetching education for user: {}", userId);
        return educationRepository.findByUserProfileId(userId);
    }

    // Update education
    public Education updateEducation(Long id, Education updatedEducation) {
        log.info("Updating education with ID: {}", id);
        return educationRepository.findById(id)
                .map(existingEducation -> {
                    existingEducation.setInstitution(updatedEducation.getInstitution());
                    existingEducation.setDegree(updatedEducation.getDegree());
                    existingEducation.setFieldOfStudy(updatedEducation.getFieldOfStudy());
                    existingEducation.setStartDate(updatedEducation.getStartDate());
                    existingEducation.setEndDate(updatedEducation.getEndDate());
                    existingEducation.setGrade(updatedEducation.getGrade());
                    existingEducation.setDescription(updatedEducation.getDescription());
                    
                    return educationRepository.save(existingEducation);
                })
                .orElseThrow(() -> new RuntimeException("Education not found with ID: " + id));
    }

    // Delete education
    public void deleteEducation(Long id) {
        log.info("Deleting education with ID: {}", id);
        educationRepository.deleteById(id);
    }

    // Find education by institution
    public List<Education> findEducationByInstitution(String institution) {
        log.info("Finding education at institution: {}", institution);
        return educationRepository.findByInstitutionContainingIgnoreCase(institution);
    }

    // Find education by degree
    public List<Education> findEducationByDegree(String degree) {
        log.info("Finding education with degree: {}", degree);
        return educationRepository.findByDegreeContainingIgnoreCase(degree);
    }

    // Find education by field of study
    public List<Education> findEducationByFieldOfStudy(String fieldOfStudy) {
        log.info("Finding education in field: {}", fieldOfStudy);
        return educationRepository.findByFieldOfStudyContainingIgnoreCase(fieldOfStudy);
    }

    // Find education by grade
    public List<Education> findEducationByGrade(String grade) {
        log.info("Finding education with grade: {}", grade);
        return educationRepository.findByGradeContainingIgnoreCase(grade);
    }

    // Find education by date range
    public List<Education> findEducationByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Finding education between {} and {}", startDate, endDate);
        return educationRepository.findByDateRange(startDate, endDate);
    }

    // Find education by user and institution
    public List<Education> findEducationByUserAndInstitution(Long userId, String institution) {
        log.info("Finding education for user {} at institution: {}", userId, institution);
        return educationRepository.findByUserProfileIdAndInstitutionContainingIgnoreCase(userId, institution);
    }

    // Find education by user and degree
    public List<Education> findEducationByUserAndDegree(Long userId, String degree) {
        log.info("Finding education for user {} with degree: {}", userId, degree);
        return educationRepository.findByUserProfileIdAndDegreeContainingIgnoreCase(userId, degree);
    }

    // Find education by user and field of study
    public List<Education> findEducationByUserAndFieldOfStudy(Long userId, String fieldOfStudy) {
        log.info("Finding education for user {} in field: {}", userId, fieldOfStudy);
        return educationRepository.findByUserProfileIdAndFieldOfStudyContainingIgnoreCase(userId, fieldOfStudy);
    }

    // Find completed education (has end date)
    public List<Education> findCompletedEducation() {
        log.info("Finding all completed education");
        return educationRepository.findCurrentEducation();
    }

    // Find ongoing education (no end date)
    public List<Education> findOngoingEducation() {
        log.info("Finding all ongoing education");
        return educationRepository.findCurrentEducation();
    }

    // Find education by completion status
    public List<Education> findEducationByCompletionStatus(boolean completed) {
        log.info("Finding education with completion status: {}", completed);
        if (completed) {
            return educationRepository.findCurrentEducation();
        } else {
            return educationRepository.findCurrentEducation();
        }
    }

    // Find education by grade range
    public List<Education> findEducationByGradeRange(String minGrade, String maxGrade) {
        log.info("Finding education with grades between {} and {}", minGrade, maxGrade);
        return educationRepository.findByGradeContainingIgnoreCase(minGrade);
    }

    // Find education by institution type (university, college, etc.)
    public List<Education> findEducationByInstitutionType(String institutionType) {
        log.info("Finding education at institution type: {}", institutionType);
        return educationRepository.findByInstitutionContainingIgnoreCase(institutionType);
    }

    // Find education by degree level (bachelor's, master's, etc.)
    public List<Education> findEducationByDegreeLevel(String degreeLevel) {
        log.info("Finding education with degree level: {}", degreeLevel);
        return educationRepository.findByDegreeContainingIgnoreCase(degreeLevel);
    }

    // Find education by field category (STEM, humanities, etc.)
    public List<Education> findEducationByFieldCategory(String fieldCategory) {
        log.info("Finding education in field category: {}", fieldCategory);
        return educationRepository.findByFieldOfStudyContainingIgnoreCase(fieldCategory);
    }
} 