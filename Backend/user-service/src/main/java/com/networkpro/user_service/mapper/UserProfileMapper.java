package com.networkpro.user_service.mapper;

import com.networkpro.user_service.dto.user.UserProfileDto;
import com.networkpro.user_service.dto.user.UserProfileUpdateDto;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import com.networkpro.user_service.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

        public UserProfileDto toDto(UserProfile userProfile) {
                if (userProfile == null)
                        return null;
                String firstName = null;
                String lastName = null;
                if (userProfile.getFullName() != null) {
                        String[] parts = userProfile.getFullName().trim().split(" ", 2);
                        firstName = parts[0];
                        lastName = parts.length > 1 ? parts[1] : null;
                }
                return UserProfileDto.builder()
                                .id(userProfile.getId())
                                .email(userProfile.getEmail())
                                .firstName(firstName)
                                .lastName(lastName)
                                .headline(userProfile.getHeadline())
                                .summary(userProfile.getBio())
                                .location(userProfile.getLocation())
                                .industry(userProfile.getIndustry())
                                .profilePictureUrl(userProfile.getProfilePictureUrl())
                                .headerImage(userProfile.getHeaderImage())
                                .website(userProfile.getWebsite())
                                .phoneNumber(userProfile.getPhoneNumber())
                                .profilePublic(userProfile.isProfilePublic())
                                .contactInfoPublic(userProfile.isContactInfoPublic())
                                .workExperiencePublic(userProfile.isWorkExperiencePublic())
                                .educationPublic(userProfile.isEducationPublic())
                                .skillsPublic(userProfile.isSkillsPublic())
                                .currentPosition(userProfile.getCurrentPosition())
                                .currentCompany(userProfile.getCurrentCompany())
                                .skills(userProfile.getSkills() != null
                                                ? new java.util.ArrayList<>(userProfile.getSkills())
                                                : null)
                                .isProfileComplete(userProfile.getProfileCompletionPercentage() >= 100)
                                .createdAt(userProfile.getProfileCreatedAt())
                                .updatedAt(userProfile.getProfileUpdatedAt())
                                .build();
        }

        public UserProfile toEntity(UserProfileDto dto) {
                if (dto == null)
                        return null;
                UserProfile userProfile = new UserProfile();
                userProfile.setEmail(dto.getEmail());
                userProfile.setFullName(dto.getFirstName() + " " + dto.getLastName());
                userProfile.setHeadline(dto.getHeadline());
                userProfile.setBio(dto.getSummary());
                userProfile.setLocation(dto.getLocation());
                userProfile.setIndustry(dto.getIndustry());
                userProfile.setProfilePictureUrl(dto.getProfilePictureUrl());
                userProfile.setHeaderImage(dto.getHeaderImage());
                userProfile.setWebsite(dto.getWebsite());
                userProfile.setPhoneNumber(dto.getPhoneNumber());
                userProfile.setProfilePublic(dto.isProfilePublic());
                userProfile.setContactInfoPublic(dto.isContactInfoPublic());
                userProfile.setWorkExperiencePublic(dto.isWorkExperiencePublic());
                userProfile.setEducationPublic(dto.isEducationPublic());
                userProfile.setSkillsPublic(dto.isSkillsPublic());
                userProfile.setCurrentPosition(dto.getCurrentPosition());
                userProfile.setCurrentCompany(dto.getCurrentCompany());
                if (dto.getSkills() != null)
                        userProfile.setSkills(new java.util.HashSet<>(dto.getSkills()));
                return userProfile;
        }

        public UserProfile toEntity(UserProfileUpdateDto dto) {
                if (dto == null)
                        return null;
                UserProfile userProfile = new UserProfile();
                userProfile.setFullName(dto.getFirstName() + " " + dto.getLastName());
                userProfile.setHeadline(dto.getHeadline());
                userProfile.setBio(dto.getSummary());
                userProfile.setLocation(dto.getLocation());
                userProfile.setIndustry(dto.getIndustry());
                userProfile.setProfilePictureUrl(null); // No field in update DTO
                userProfile.setWebsite(dto.getWebsite());
                userProfile.setPhoneNumber(dto.getPhoneNumber());
                userProfile.setProfilePublic(dto.isProfilePublic());
                userProfile.setContactInfoPublic(dto.isContactInfoPublic());
                userProfile.setWorkExperiencePublic(dto.isWorkExperiencePublic());
                userProfile.setEducationPublic(dto.isEducationPublic());
                userProfile.setSkillsPublic(dto.isSkillsPublic());
                userProfile.setCurrentPosition(dto.getCurrentPosition());
                userProfile.setCurrentCompany(dto.getCurrentCompany());
                if (dto.getSkills() != null)
                        userProfile.setSkills(new java.util.HashSet<>(dto.getSkills()));
                return userProfile;
        }

        public PrivacySettingsDto toPrivacySettingsDto(UserProfile userProfile) {
                if (userProfile == null)
                        return null;

                return PrivacySettingsDto.builder()
                                .id(userProfile.getId())
                                .profileVisible(userProfile.isProfilePublic())
                                .showEmail(userProfile.isContactInfoPublic())
                                .showPhone(userProfile.isContactInfoPublic())
                                .showWorkExperience(userProfile.isWorkExperiencePublic())
                                .showEducation(userProfile.isEducationPublic())
                                .build();
        }
}