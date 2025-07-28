package com.networkpro.user_service.controller;

import com.networkpro.user_service.dto.work.WorkExperienceDto;
import com.networkpro.user_service.mapper.WorkExperienceMapper;
import com.networkpro.user_service.model.WorkExperience;
import com.networkpro.user_service.service.work.WorkExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users/{userId}/work-experience")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkExperienceController {

    private final WorkExperienceService workExperienceService;
    private final WorkExperienceMapper mapper;
    private final com.networkpro.user_service.service.user.UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<WorkExperienceDto> addWorkExperience(
            @PathVariable Long userId,
            @RequestBody WorkExperienceDto workExperienceDto) {
        Optional<com.networkpro.user_service.model.UserProfile> userProfileOpt = userProfileService
                .getUserProfileById(userId);
        if (userProfileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a custom error message DTO
        }
        WorkExperience workExperience = mapper.toEntity(workExperienceDto);
        workExperience.setUserProfile(userProfileOpt.get());
        WorkExperience created = workExperienceService.createWorkExperience(workExperience);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<WorkExperienceDto>> getUserWorkExperience(@PathVariable Long userId) {
        List<WorkExperience> workExperiences = workExperienceService.getWorkExperiencesByUserId(userId);
        List<WorkExperienceDto> dtos = workExperiences.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{experienceId}")
    public ResponseEntity<WorkExperienceDto> getWorkExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId) {
        Optional<WorkExperience> workExperience = workExperienceService.getWorkExperienceById(experienceId);
        return workExperience.map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{experienceId}")
    public ResponseEntity<WorkExperienceDto> updateWorkExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId,
            @RequestBody WorkExperienceDto workExperienceDto) {
        WorkExperience updatedExperience = mapper.toEntity(workExperienceDto);
        WorkExperience updated = workExperienceService.updateWorkExperience(experienceId, updatedExperience);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{experienceId}")
    public ResponseEntity<String> deleteWorkExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId) {
        workExperienceService.deleteWorkExperience(experienceId);
        return ResponseEntity.ok("Work experience deleted successfully.");
    }

    @GetMapping("/company/{company}")
    public ResponseEntity<List<WorkExperienceDto>> getWorkExperienceByCompany(
            @PathVariable Long userId,
            @PathVariable String company) {
        List<WorkExperience> workExperiences = workExperienceService.findWorkExperiencesByUserAndCompany(userId,
                company);
        List<WorkExperienceDto> dtos = workExperiences.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/current")
    public ResponseEntity<List<WorkExperienceDto>> getCurrentWorkExperience(@PathVariable Long userId) {
        List<WorkExperience> currentExperiences = workExperienceService.getCurrentWorkExperiencesByUserId(userId);
        List<WorkExperienceDto> dtos = currentExperiences.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{experienceId}/mark-current")
    public ResponseEntity<WorkExperienceDto> markAsCurrentPosition(@PathVariable Long experienceId) {
        WorkExperience updated = workExperienceService.markAsCurrentPosition(experienceId);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @PutMapping("/{experienceId}/end-position")
    public ResponseEntity<WorkExperienceDto> endCurrentPosition(
            @PathVariable Long experienceId,
            @RequestParam String endDate) {
        WorkExperience updated = workExperienceService.endCurrentPosition(experienceId,
                java.time.LocalDate.parse(endDate));
        return ResponseEntity.ok(mapper.toDto(updated));
    }
}