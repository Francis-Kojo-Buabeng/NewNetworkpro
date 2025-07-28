package com.networkpro.user_service.controller;

import com.networkpro.user_service.dto.user.UserProfileDto;
import com.networkpro.user_service.dto.user.UserProfileUpdateDto;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import com.networkpro.user_service.service.user.UserProfileService;
import com.networkpro.user_service.mapper.UserProfileMapper;
import com.networkpro.user_service.model.UserProfile;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserProfileMapper mapper;

    @PostMapping
    public ResponseEntity<UserProfileDto> createUserProfile(@Valid @RequestBody UserProfileDto userProfileDto) {
        UserProfile userProfile = mapper.toEntity(userProfileDto);
        UserProfile created = userProfileService.createUserProfile(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        return profile.map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserProfileDto> getUserProfileByEmail(@PathVariable String email) {
        Optional<UserProfile> profile = userProfileService.getUserProfileByEmail(email);
        return profile.map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/email/{email}")
    public ResponseEntity<UserProfileDto> createOrGetUserProfile(@PathVariable String email) {
        UserProfile profile = userProfileService.createOrGetUserProfile(email);
        return ResponseEntity.ok(mapper.toDto(profile));
    }

    @GetMapping("/{userId}/public")
    public ResponseEntity<UserProfileDto> getPublicUserProfile(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        if (profile.isPresent() && profile.get().isProfilePublic()) {
            return ResponseEntity.ok(mapper.toDto(profile.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileDto> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileUpdateDto updateDto) {
        UserProfile updatedProfile = mapper.toEntity(updateDto);
        UserProfile updated = userProfileService.updateUserProfile(userId, updatedProfile);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long userId) {
        userProfileService.deleteUserProfile(userId);
        return ResponseEntity.noContent().build();
    }

    // Profile Picture Upload
    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = userProfileService.uploadProfilePicture(userId, file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload profile picture: " + e.getMessage());
        }
    }

    // Profile Picture Delete
    @DeleteMapping("/{userId}/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@PathVariable Long userId) {
        try {
            userProfileService.deleteProfilePicture(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Banner Image Upload
    @PostMapping("/{userId}/banner-image")
    public ResponseEntity<String> uploadBannerImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = userProfileService.uploadBannerImage(userId, file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload banner image: " + e.getMessage());
        }
    }

    // Banner Image Delete
    @DeleteMapping("/{userId}/banner-image")
    public ResponseEntity<Void> deleteBannerImage(@PathVariable Long userId) {
        try {
            userProfileService.deleteBannerImage(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserProfileDto>> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileService.getAllUserProfiles();
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @GetMapping("/public")
    public ResponseEntity<List<UserProfileDto>> getPublicUserProfiles() {
        List<UserProfile> profiles = userProfileService.getPublicUserProfiles();
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @PostMapping("/search")
    public ResponseEntity<List<UserProfileDto>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String company) {
        List<UserProfile> profiles = userProfileService.searchUsers(keyword, location, industry, company);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @PostMapping("/search/skills")
    public ResponseEntity<List<UserProfileDto>> searchUsersBySkills(@RequestBody List<String> skills) {
        List<UserProfile> profiles = userProfileService.getUsersBySkills(skills);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @PostMapping("/search/location")
    public ResponseEntity<List<UserProfileDto>> searchUsersByLocation(@RequestBody String location) {
        List<UserProfile> profiles = userProfileService.getUsersByLocation(location);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @PostMapping("/search/company")
    public ResponseEntity<List<UserProfileDto>> searchUsersByCompany(@RequestBody String company) {
        List<UserProfile> profiles = userProfileService.getUsersByCompany(company);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @PostMapping("/search/industry")
    public ResponseEntity<List<UserProfileDto>> searchUsersByIndustry(@RequestBody String industry) {
        List<UserProfile> profiles = userProfileService.getUsersByIndustry(industry);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    @GetMapping("/completion/{threshold}")
    public ResponseEntity<List<UserProfileDto>> getUsersWithHighCompletion(@PathVariable int threshold) {
        List<UserProfile> profiles = userProfileService.getUsersWithHighCompletion(threshold);
        List<UserProfileDto> profileDtos = profiles.stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(profileDtos);
    }

    // Privacy Settings Endpoints
    @GetMapping("/{userId}/privacy-settings")
    public ResponseEntity<PrivacySettingsDto> getPrivacySettings(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        if (profile.isPresent()) {
            PrivacySettingsDto privacySettings = mapper.toPrivacySettingsDto(profile.get());
            return ResponseEntity.ok(privacySettings);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}/privacy-settings")
    public ResponseEntity<PrivacySettingsDto> updatePrivacySettings(
            @PathVariable Long userId,
            @Valid @RequestBody PrivacySettingsDto privacySettingsDto) {
        UserProfile updatedProfile = userProfileService.updatePrivacySettings(userId, privacySettingsDto);
        PrivacySettingsDto updatedSettings = mapper.toPrivacySettingsDto(updatedProfile);
        return ResponseEntity.ok(updatedSettings);
    }

    // Profile Completion Endpoints
    @GetMapping("/{userId}/completion")
    public ResponseEntity<Map<String, Object>> getProfileCompletion(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        if (profile.isPresent()) {
            Map<String, Object> completionData = new HashMap<>();
            completionData.put("completionPercentage", profile.get().getProfileCompletionPercentage());
            completionData.put("isComplete", profile.get().getProfileCompletionPercentage() >= 80);
            completionData.put("missingFields", userProfileService.getMissingFields(userId));
            return ResponseEntity.ok(completionData);
        }
        return ResponseEntity.notFound().build();
    }
}