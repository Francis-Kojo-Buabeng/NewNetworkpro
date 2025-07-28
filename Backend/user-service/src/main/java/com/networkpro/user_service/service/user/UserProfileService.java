package com.networkpro.user_service.service.user;

import com.networkpro.user_service.model.UserProfile;
import com.networkpro.user_service.repository.UserProfileRepository;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private static final String UPLOAD_DIR = "uploads/profile-pictures/";
    private static final String BANNER_UPLOAD_DIR = "uploads/banner-images/";

    // Create new user profile
    public UserProfile createUserProfile(UserProfile userProfile) {
        log.info("Creating new user profile");
        return userProfileRepository.save(userProfile);
    }

    // Get user profile by ID
    public Optional<UserProfile> getUserProfileById(Long id) {
        log.info("Fetching user profile with ID: {}", id);
        return userProfileRepository.findById(id);
    }

    // Get user profile by email
    public Optional<UserProfile> getUserProfileByEmail(String email) {
        log.info("Fetching user profile with email: {}", email);
        return userProfileRepository.findByEmail(email);
    }

    // Check if user profile exists by email
    public boolean existsByEmail(String email) {
        log.info("Checking if user profile exists for email: {}", email);
        return userProfileRepository.existsByEmail(email);
    }

    // Create or get user profile by email
    public UserProfile createOrGetUserProfile(String email) {
        log.info("Creating or getting user profile for email: {}", email);

        Optional<UserProfile> existingProfile = userProfileRepository.findByEmail(email);
        if (existingProfile.isPresent()) {
            log.info("Found existing profile for email: {}", email);
            return existingProfile.get();
        }

        // Create new profile for authenticated user
        UserProfile newProfile = UserProfile.builder()
                .email(email)
                .fullName("") // Will be set during profile setup
                .profilePublic(false)
                .contactInfoPublic(false)
                .workExperiencePublic(false)
                .educationPublic(false)
                .skillsPublic(false)
                .build();

        log.info("Creating new profile for email: {}", email);
        return userProfileRepository.save(newProfile);
    }

    // Update user profile
    public UserProfile updateUserProfile(Long userId, UserProfile updatedProfile) {
        log.info("Updating user profile with ID: {}", userId);
        Optional<UserProfile> existingProfile = userProfileRepository.findById(userId);
        if (existingProfile.isPresent()) {
            UserProfile profile = existingProfile.get();
            // Update fields
            if (updatedProfile.getFullName() != null)
                profile.setFullName(updatedProfile.getFullName());
            if (updatedProfile.getBio() != null)
                profile.setBio(updatedProfile.getBio());
            if (updatedProfile.getLocation() != null)
                profile.setLocation(updatedProfile.getLocation());
            if (updatedProfile.getCurrentPosition() != null)
                profile.setCurrentPosition(updatedProfile.getCurrentPosition());
            if (updatedProfile.getCurrentCompany() != null)
                profile.setCurrentCompany(updatedProfile.getCurrentCompany());
            if (updatedProfile.getIndustry() != null)
                profile.setIndustry(updatedProfile.getIndustry());
            if (updatedProfile.getHeadline() != null)
                profile.setHeadline(updatedProfile.getHeadline());
            if (updatedProfile.getPhoneNumber() != null)
                profile.setPhoneNumber(updatedProfile.getPhoneNumber());
            if (updatedProfile.getWebsite() != null)
                profile.setWebsite(updatedProfile.getWebsite());
            if (updatedProfile.getSkills() != null)
                profile.setSkills(updatedProfile.getSkills());

            return userProfileRepository.save(profile);
        }
        throw new RuntimeException("User profile not found with ID: " + userId);
    }

    // Delete user profile
    public void deleteUserProfile(Long userId) {
        log.info("Deleting user profile with ID: {}", userId);
        userProfileRepository.deleteById(userId);
    }

    // Get all user profiles
    public List<UserProfile> getAllUserProfiles() {
        log.info("Fetching all user profiles");
        return userProfileRepository.findAll();
    }

    // Get public user profiles
    public List<UserProfile> getPublicUserProfiles() {
        log.info("Fetching public user profiles");
        return userProfileRepository.findByProfilePublicTrue();
    }

    // Search users
    public List<UserProfile> searchUsers(String keyword, String location, String industry, String company) {
        log.info("Searching users with keyword: {}, location: {}, industry: {}, company: {}", keyword, location,
                industry, company);
        return userProfileRepository.searchUsers(keyword, location, industry, company);
    }

    // Get users by skills
    public List<UserProfile> getUsersBySkills(List<String> skills) {
        log.info("Fetching users with skills: {}", skills);
        return userProfileRepository.findBySkillsIn(skills);
    }

    // Get users by location
    public List<UserProfile> getUsersByLocation(String location) {
        log.info("Fetching users in location: {}", location);
        return userProfileRepository.findByLocationContainingIgnoreCase(location);
    }

    // Get users by company
    public List<UserProfile> getUsersByCompany(String company) {
        log.info("Fetching users in company: {}", company);
        return userProfileRepository.findByCurrentCompanyContainingIgnoreCase(company);
    }

    // Get users by industry
    public List<UserProfile> getUsersByIndustry(String industry) {
        log.info("Fetching users in industry: {}", industry);
        return userProfileRepository.findByIndustryContainingIgnoreCase(industry);
    }

    // Get users with high completion percentage
    public List<UserProfile> getUsersWithHighCompletion(int threshold) {
        log.info("Fetching users with completion percentage > {}", threshold);
        return userProfileRepository.findByProfileCompletionPercentageGreaterThan(threshold);
    }

    // Upload profile picture
    public String uploadProfilePicture(Long userId, MultipartFile file) throws IOException {
        log.info("Uploading profile picture for user: {}", userId);
        Path uploadPath = Paths.get(UPLOAD_DIR + userId);
        Files.createDirectories(uploadPath);
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            // Store relative path for consistency
            String imageUrl = "/profile-pictures/" + userId + "/" + filename;
            profile.setProfilePictureUrl(imageUrl);
            userProfileRepository.save(profile);
            log.info("Profile picture uploaded successfully: {}", imageUrl);
            return imageUrl;
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }

    // Delete profile picture
    public void deleteProfilePicture(Long userId) {
        log.info("Deleting profile picture for user: {}", userId);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            if (profile.getProfilePictureUrl() != null) {
                // Delete file from filesystem
                try {
                    // Extract filename from relative path
                    String imageUrl = profile.getProfilePictureUrl();
                    String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                    Path fullPath = Paths.get(UPLOAD_DIR + userId + "/" + filename);
                    Files.deleteIfExists(fullPath);
                } catch (IOException e) {
                    log.warn("Could not delete profile picture file: {}", e.getMessage());
                }

                // Clear URL from database
                profile.setProfilePictureUrl(null);
                userProfileRepository.save(profile);
                log.info("Profile picture deleted successfully");
            }
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }

    // Upload banner image
    public String uploadBannerImage(Long userId, MultipartFile file) throws IOException {
        log.info("Uploading banner image for user: {}", userId);
        Path uploadPath = Paths.get(BANNER_UPLOAD_DIR + userId);
        Files.createDirectories(uploadPath);
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            // Store relative path for consistency
            String imageUrl = "/banner-images/" + userId + "/" + filename;
            profile.setHeaderImage(imageUrl);
            userProfileRepository.save(profile);
            log.info("Banner image uploaded successfully: {}", imageUrl);
            return imageUrl;
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }

    // Delete banner image
    public void deleteBannerImage(Long userId) {
        log.info("Deleting banner image for user: {}", userId);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            if (profile.getHeaderImage() != null) {
                // Delete file from filesystem
                try {
                    // Extract filename from relative path
                    String imageUrl = profile.getHeaderImage();
                    String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                    Path fullPath = Paths.get(BANNER_UPLOAD_DIR + userId + "/" + filename);
                    Files.deleteIfExists(fullPath);
                } catch (IOException e) {
                    log.warn("Could not delete banner image file: {}", e.getMessage());
                }

                // Clear URL from database
                profile.setHeaderImage(null);
                userProfileRepository.save(profile);
                log.info("Banner image deleted successfully");
            }
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }

    // Privacy Settings Methods
    public UserProfile updatePrivacySettings(Long userId, PrivacySettingsDto privacySettingsDto) {
        log.info("Updating privacy settings for user: {}", userId);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();

            // Update privacy settings
            profile.setProfilePublic(privacySettingsDto.isProfileVisible());
            profile.setContactInfoPublic(privacySettingsDto.isShowEmail() || privacySettingsDto.isShowPhone());
            profile.setWorkExperiencePublic(privacySettingsDto.isShowWorkExperience());
            profile.setEducationPublic(privacySettingsDto.isShowEducation());
            profile.setSkillsPublic(privacySettingsDto.isShowCertifications());

            log.info("Privacy settings updated successfully for user: {}", userId);
            return userProfileRepository.save(profile);
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }

    // Profile Completion Methods
    public List<String> getMissingFields(Long userId) {
        log.info("Getting missing fields for user: {}", userId);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userId);
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            List<String> missingFields = new ArrayList<>();

            if (profile.getFullName() == null || profile.getFullName().trim().isEmpty()) {
                missingFields.add("fullName");
            }
            if (profile.getBio() == null || profile.getBio().trim().isEmpty()) {
                missingFields.add("bio");
            }
            if (profile.getLocation() == null || profile.getLocation().trim().isEmpty()) {
                missingFields.add("location");
            }
            if (profile.getProfilePictureUrl() == null || profile.getProfilePictureUrl().trim().isEmpty()) {
                missingFields.add("profilePicture");
            }
            if (profile.getCurrentPosition() == null || profile.getCurrentPosition().trim().isEmpty()) {
                missingFields.add("currentPosition");
            }
            if (profile.getCurrentCompany() == null || profile.getCurrentCompany().trim().isEmpty()) {
                missingFields.add("currentCompany");
            }
            if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
                missingFields.add("skills");
            }
            if (profile.getWorkExperiences() == null || profile.getWorkExperiences().isEmpty()) {
                missingFields.add("workExperience");
            }
            if (profile.getEducation() == null || profile.getEducation().isEmpty()) {
                missingFields.add("education");
            }

            log.info("Missing fields for user {}: {}", userId, missingFields);
            return missingFields;
        } else {
            throw new RuntimeException("User profile not found with ID: " + userId);
        }
    }
}