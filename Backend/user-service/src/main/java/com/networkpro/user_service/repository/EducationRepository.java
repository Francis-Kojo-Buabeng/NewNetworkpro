package com.networkpro.user_service.repository;

import com.networkpro.user_service.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    
    // Find education by user profile
    List<Education> findByUserProfileId(Long userProfileId);
    
    // Find current education by user profile
    List<Education> findByUserProfileIdAndCurrentEducationTrue(Long userProfileId);
    
    // Find education by institution
    List<Education> findByInstitutionContainingIgnoreCase(String institution);
    
    // Find education by degree
    List<Education> findByDegreeContainingIgnoreCase(String degree);
    
    // Find education by field of study
    List<Education> findByFieldOfStudyContainingIgnoreCase(String fieldOfStudy);
    
    // Find education by location
    List<Education> findByLocationContainingIgnoreCase(String location);
    
    // Find education by grade
    List<Education> findByGradeContainingIgnoreCase(String grade);
    
    // Find current education (no end date)
    @Query("SELECT e FROM Education e WHERE e.endDate IS NULL")
    List<Education> findCurrentEducation();
    
    // Find education by date range
    @Query("SELECT e FROM Education e WHERE e.startDate >= :startDate AND e.endDate <= :endDate")
    List<Education> findByDateRange(@Param("startDate") java.time.LocalDate startDate, 
                                   @Param("endDate") java.time.LocalDate endDate);
    
    // Find education by user and institution
    List<Education> findByUserProfileIdAndInstitutionContainingIgnoreCase(Long userProfileId, String institution);
    
    // Find education by degree type
    @Query("SELECT e FROM Education e WHERE LOWER(e.degree) LIKE LOWER(CONCAT('%', :degreeType, '%'))")
    List<Education> findByDegreeType(@Param("degreeType") String degreeType);

    // Find education by user and degree
    List<Education> findByUserProfileIdAndDegreeContainingIgnoreCase(Long userProfileId, String degree);

    // Find education by user and field of study
    List<Education> findByUserProfileIdAndFieldOfStudyContainingIgnoreCase(Long userProfileId, String fieldOfStudy);
} 