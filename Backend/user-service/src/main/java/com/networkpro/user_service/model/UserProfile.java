package com.networkpro.user_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.networkpro.user_service.model.WorkExperience;
import com.networkpro.user_service.model.Education;
import com.networkpro.user_service.model.Certification;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Add email field to connect with authentication service
    @Column(unique = true)
    private String email;

    // Removed email and passwordHash fields as they are not needed in user-service
    private String fullName;
    private String bio;
    private String location;
    private String profilePictureUrl;
    private String headerImage;

    // Profile completion tracking
    private int profileCompletionPercentage;
    private LocalDateTime profileCreatedAt;
    private LocalDateTime profileUpdatedAt;

    // Contact information
    private String phoneNumber;
    private String website;
    private String linkedinUrl;
    private String githubUrl;

    // Privacy settings
    private boolean profilePublic;
    private boolean contactInfoPublic;
    private boolean workExperiencePublic;
    private boolean educationPublic;
    private boolean skillsPublic;

    // Professional information
    private String currentPosition;
    private String currentCompany;
    private String industry;
    private String headline;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    @Builder.Default
    private Set<String> skills = new HashSet<>();

    // Relationships
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<WorkExperience> workExperiences = new HashSet<>();

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Education> education = new HashSet<>();

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Certification> certifications = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        profileCreatedAt = LocalDateTime.now();
        profileUpdatedAt = LocalDateTime.now();
        calculateProfileCompletion();
    }

    @PreUpdate
    protected void onUpdate() {
        profileUpdatedAt = LocalDateTime.now();
        calculateProfileCompletion();
    }

    private void calculateProfileCompletion() {
        int completion = 0;
        if (fullName != null && !fullName.trim().isEmpty())
            completion += 20;
        if (bio != null && !bio.trim().isEmpty())
            completion += 15;
        if (location != null && !location.trim().isEmpty())
            completion += 10;
        if (profilePictureUrl != null && !profilePictureUrl.trim().isEmpty())
            completion += 15;
        if (currentPosition != null && !currentPosition.trim().isEmpty())
            completion += 10;
        if (currentCompany != null && !currentCompany.trim().isEmpty())
            completion += 10;
        if (!skills.isEmpty())
            completion += 10;
        if (!workExperiences.isEmpty())
            completion += 10;
        this.profileCompletionPercentage = Math.min(completion, 100);
    }
}