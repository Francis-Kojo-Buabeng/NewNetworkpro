package com.networkpro.user_service.service.work;

import com.networkpro.user_service.model.WorkExperience;
import com.networkpro.user_service.repository.WorkExperienceRepository;
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
public class WorkExperienceService {

    private final WorkExperienceRepository workExperienceRepository;

    // Create new work experience
    public WorkExperience createWorkExperience(WorkExperience workExperience) {
        log.info("Creating new work experience for user: {}", workExperience.getUserProfile().getId());
        return workExperienceRepository.save(workExperience);
    }

    // Get work experience by ID
    public Optional<WorkExperience> getWorkExperienceById(Long id) {
        log.info("Fetching work experience with ID: {}", id);
        return workExperienceRepository.findById(id);
    }

    // Get all work experiences for a user
    public List<WorkExperience> getWorkExperiencesByUserId(Long userId) {
        log.info("Fetching work experiences for user: {}", userId);
        return workExperienceRepository.findByUserProfileId(userId);
    }

    // Get current work experiences for a user
    public List<WorkExperience> getCurrentWorkExperiencesByUserId(Long userId) {
        log.info("Fetching current work experiences for user: {}", userId);
        return workExperienceRepository.findByUserProfileIdAndCurrentPositionTrue(userId);
    }

    // Update work experience
    public WorkExperience updateWorkExperience(Long id, WorkExperience updatedExperience) {
        log.info("Updating work experience with ID: {}", id);
        return workExperienceRepository.findById(id)
                .map(existingExperience -> {
                    existingExperience.setCompany(updatedExperience.getCompany());
                    existingExperience.setPosition(updatedExperience.getPosition());
                    existingExperience.setLocation(updatedExperience.getLocation());
                    existingExperience.setDescription(updatedExperience.getDescription());
                    existingExperience.setStartDate(updatedExperience.getStartDate());
                    existingExperience.setEndDate(updatedExperience.getEndDate());
                    existingExperience.setCurrentPosition(updatedExperience.isCurrentPosition());
                    existingExperience.setIndustry(updatedExperience.getIndustry());
                    existingExperience.setEmploymentType(updatedExperience.getEmploymentType());
                    existingExperience.setSkillsUsed(updatedExperience.getSkillsUsed());
                    
                    return workExperienceRepository.save(existingExperience);
                })
                .orElseThrow(() -> new RuntimeException("Work experience not found with ID: " + id));
    }

    // Delete work experience
    public void deleteWorkExperience(Long id) {
        log.info("Deleting work experience with ID: {}", id);
        workExperienceRepository.deleteById(id);
    }

    // Find work experiences by company
    public List<WorkExperience> findWorkExperiencesByCompany(String company) {
        log.info("Finding work experiences at company: {}", company);
        return workExperienceRepository.findByCompanyContainingIgnoreCase(company);
    }

    // Find work experiences by position
    public List<WorkExperience> findWorkExperiencesByPosition(String position) {
        log.info("Finding work experiences with position: {}", position);
        return workExperienceRepository.findByPositionContainingIgnoreCase(position);
    }

    // Find work experiences by industry
    public List<WorkExperience> findWorkExperiencesByIndustry(String industry) {
        log.info("Finding work experiences in industry: {}", industry);
        return workExperienceRepository.findByIndustryContainingIgnoreCase(industry);
    }

    // Find work experiences by employment type
    public List<WorkExperience> findWorkExperiencesByEmploymentType(String employmentType) {
        log.info("Finding work experiences with employment type: {}", employmentType);
        return workExperienceRepository.findByEmploymentType(employmentType);
    }

    // Find work experiences with specific skills
    public List<WorkExperience> findWorkExperiencesBySkills(String skill) {
        log.info("Finding work experiences with skills: {}", skill);
        return workExperienceRepository.findBySkillsUsedContaining(skill);
    }

    // Find current work experiences (no end date)
    public List<WorkExperience> findCurrentWorkExperiences() {
        log.info("Finding all current work experiences");
        return workExperienceRepository.findCurrentWorkExperiences();
    }

    // Find work experiences by date range
    public List<WorkExperience> findWorkExperiencesByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Finding work experiences between {} and {}", startDate, endDate);
        return workExperienceRepository.findByDateRange(startDate, endDate);
    }

    // Find work experiences by user and company
    public List<WorkExperience> findWorkExperiencesByUserAndCompany(Long userId, String company) {
        log.info("Finding work experiences for user {} at company: {}", userId, company);
        return workExperienceRepository.findByUserProfileIdAndCompanyContainingIgnoreCase(userId, company);
    }

    // Mark work experience as current
    public WorkExperience markAsCurrentPosition(Long experienceId) {
        log.info("Marking work experience {} as current position", experienceId);
        return workExperienceRepository.findById(experienceId)
                .map(experience -> {
                    experience.setCurrentPosition(true);
                    experience.setEndDate(null); // Clear end date for current position
                    return workExperienceRepository.save(experience);
                })
                .orElseThrow(() -> new RuntimeException("Work experience not found with ID: " + experienceId));
    }

    // End current position
    public WorkExperience endCurrentPosition(Long experienceId, LocalDate endDate) {
        log.info("Ending current position {} on date: {}", experienceId, endDate);
        return workExperienceRepository.findById(experienceId)
                .map(experience -> {
                    experience.setCurrentPosition(false);
                    experience.setEndDate(endDate);
                    return workExperienceRepository.save(experience);
                })
                .orElseThrow(() -> new RuntimeException("Work experience not found with ID: " + experienceId));
    }
} 