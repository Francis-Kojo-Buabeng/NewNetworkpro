package com.networkpro.user_service.repository;

import com.networkpro.user_service.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    
    // Find work experiences by user profile
    List<WorkExperience> findByUserProfileId(Long userProfileId);
    
    // Find current positions by user profile
    List<WorkExperience> findByUserProfileIdAndCurrentPositionTrue(Long userProfileId);
    
    // Find work experiences by company
    List<WorkExperience> findByCompanyContainingIgnoreCase(String company);
    
    // Find work experiences by position
    List<WorkExperience> findByPositionContainingIgnoreCase(String position);
    
    // Find work experiences by industry
    List<WorkExperience> findByIndustryContainingIgnoreCase(String industry);
    
    // Find work experiences by employment type
    List<WorkExperience> findByEmploymentType(String employmentType);
    
    // Find work experiences with specific skills
    @Query("SELECT w FROM WorkExperience w WHERE w.skillsUsed LIKE %:skill%")
    List<WorkExperience> findBySkillsUsedContaining(@Param("skill") String skill);
    
    // Find work experiences by date range
    @Query("SELECT w FROM WorkExperience w WHERE w.startDate >= :startDate AND w.endDate <= :endDate")
    List<WorkExperience> findByDateRange(@Param("startDate") java.time.LocalDate startDate, 
                                        @Param("endDate") java.time.LocalDate endDate);
    
    // Find current work experiences (no end date)
    @Query("SELECT w FROM WorkExperience w WHERE w.endDate IS NULL")
    List<WorkExperience> findCurrentWorkExperiences();
    
    // Find work experiences by user and company
    List<WorkExperience> findByUserProfileIdAndCompanyContainingIgnoreCase(Long userProfileId, String company);
} 