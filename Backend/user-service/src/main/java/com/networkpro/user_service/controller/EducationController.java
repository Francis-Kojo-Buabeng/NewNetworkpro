package com.networkpro.user_service.controller;

import com.networkpro.user_service.dto.education.EducationDto;
import com.networkpro.user_service.mapper.EducationMapper;
import com.networkpro.user_service.model.Education;
import com.networkpro.user_service.service.education.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users/{userId}/education")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EducationController {

    private final EducationService educationService;
    private final EducationMapper mapper;
    private final com.networkpro.user_service.service.user.UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<EducationDto> addEducation(
            @PathVariable Long userId,
            @RequestBody EducationDto educationDto) {
        Optional<com.networkpro.user_service.model.UserProfile> userProfileOpt = userProfileService
                .getUserProfileById(userId);
        if (userProfileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a custom error message DTO
        }
        Education education = mapper.toEntity(educationDto);
        education.setUserProfile(userProfileOpt.get());
        Education created = educationService.createEducation(education);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<EducationDto>> getUserEducation(@PathVariable Long userId) {
        List<Education> educations = educationService.getEducationByUserId(userId);
        List<EducationDto> dtos = educations.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{educationId}")
    public ResponseEntity<EducationDto> getEducation(
            @PathVariable Long userId,
            @PathVariable Long educationId) {
        Optional<Education> education = educationService.getEducationById(educationId);
        return education.map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{educationId}")
    public ResponseEntity<EducationDto> updateEducation(
            @PathVariable Long userId,
            @PathVariable Long educationId,
            @RequestBody EducationDto educationDto) {
        Education updatedEducation = mapper.toEntity(educationDto);
        Education updated = educationService.updateEducation(educationId, updatedEducation);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<String> deleteEducation(
            @PathVariable Long userId,
            @PathVariable Long educationId) {
        educationService.deleteEducation(educationId);
        return ResponseEntity.ok("Education deleted successfully.");
    }

    @GetMapping("/institution/{institution}")
    public ResponseEntity<List<EducationDto>> getEducationByInstitution(
            @PathVariable Long userId,
            @PathVariable String institution) {
        List<Education> educations = educationService.findEducationByUserAndInstitution(userId, institution);
        List<EducationDto> dtos = educations.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/degree/{degree}")
    public ResponseEntity<List<EducationDto>> getEducationByDegree(
            @PathVariable Long userId,
            @PathVariable String degree) {
        List<Education> educations = educationService.findEducationByUserAndDegree(userId, degree);
        List<EducationDto> dtos = educations.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/field/{fieldOfStudy}")
    public ResponseEntity<List<EducationDto>> getEducationByFieldOfStudy(
            @PathVariable Long userId,
            @PathVariable String fieldOfStudy) {
        List<Education> educations = educationService.findEducationByUserAndFieldOfStudy(userId, fieldOfStudy);
        List<EducationDto> dtos = educations.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}