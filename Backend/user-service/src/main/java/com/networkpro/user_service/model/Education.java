package com.networkpro.user_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    private UserProfile userProfile;
    
    @Column(nullable = false)
    private String institution;
    
    @Column(nullable = false)
    private String degree;
    
    @Column(nullable = false)
    private String fieldOfStudy;
    
    private String location;
    private String description;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    private LocalDate endDate;
    private boolean currentEducation;
    
    // Additional fields
    private String grade;
    private String activities;
    private String achievements;
} 