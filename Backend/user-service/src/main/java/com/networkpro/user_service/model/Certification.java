package com.networkpro.user_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    private UserProfile userProfile;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String issuingOrganization;
    
    private String credentialId;
    private String credentialUrl;
    
    @Column(nullable = false)
    private LocalDate issueDate;
    
    private LocalDate expirationDate;
    private boolean doesNotExpire;
    
    // Additional fields
    private String description;
    private String skills;
} 