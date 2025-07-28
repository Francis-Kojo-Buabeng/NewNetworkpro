package com.networkpro.user_service.controller;

import com.networkpro.user_service.dto.certification.CertificationDto;
import com.networkpro.user_service.mapper.CertificationMapper;
import com.networkpro.user_service.model.Certification;
import com.networkpro.user_service.service.certification.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users/{userId}/certifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificationController {

        private final CertificationService certificationService;
        private final CertificationMapper mapper;
        private final com.networkpro.user_service.service.user.UserProfileService userProfileService;

        @PostMapping
        public ResponseEntity<CertificationDto> addCertification(
                        @PathVariable Long userId,
                        @RequestBody CertificationDto certificationDto) {
                Optional<com.networkpro.user_service.model.UserProfile> userProfileOpt = userProfileService
                                .getUserProfileById(userId);
                if (userProfileOpt.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a custom error message DTO
                }
                Certification certification = mapper.toEntity(certificationDto);
                certification.setUserProfile(userProfileOpt.get());
                Certification created = certificationService.createCertification(certification);
                return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
        }

        @GetMapping
        public ResponseEntity<List<CertificationDto>> getUserCertifications(@PathVariable Long userId) {
                List<Certification> certifications = certificationService.getCertificationsByUserId(userId);
                List<CertificationDto> dtos = certifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/{certificationId}")
        public ResponseEntity<CertificationDto> getCertification(
                        @PathVariable Long userId,
                        @PathVariable Long certificationId) {
                Optional<Certification> certification = certificationService.getCertificationById(certificationId);
                return certification.map(mapper::toDto)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PutMapping("/{certificationId}")
        public ResponseEntity<CertificationDto> updateCertification(
                        @PathVariable Long userId,
                        @PathVariable Long certificationId,
                        @RequestBody CertificationDto certificationDto) {
                Certification updatedCertification = mapper.toEntity(certificationDto);
                Certification updated = certificationService.updateCertification(certificationId, updatedCertification);
                return ResponseEntity.ok(mapper.toDto(updated));
        }

        @DeleteMapping("/{certificationId}")
        public ResponseEntity<String> deleteCertification(
                        @PathVariable Long userId,
                        @PathVariable Long certificationId) {
                certificationService.deleteCertification(certificationId);
                return ResponseEntity.ok("Certification deleted successfully.");
        }

        @GetMapping("/organization/{organization}")
        public ResponseEntity<List<CertificationDto>> getCertificationsByOrganization(
                        @PathVariable Long userId,
                        @PathVariable String organization) {
                List<Certification> certifications = certificationService.findCertificationsByUserAndOrganization(
                                userId,
                                organization);
                List<CertificationDto> dtos = certifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/name/{name}")
        public ResponseEntity<List<CertificationDto>> getCertificationsByName(
                        @PathVariable Long userId,
                        @PathVariable String name) {
                List<Certification> certifications = certificationService.findCertificationsByName(name);
                List<CertificationDto> dtos = certifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/valid")
        public ResponseEntity<List<CertificationDto>> getValidCertifications(@PathVariable Long userId) {
                List<Certification> validCertifications = certificationService.findActiveCertificationsByUserId(userId);
                List<CertificationDto> dtos = validCertifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/expired")
        public ResponseEntity<List<CertificationDto>> getExpiredCertifications(@PathVariable Long userId) {
                List<Certification> expiredCertifications = certificationService
                                .findExpiredCertificationsByUserId(userId);
                List<CertificationDto> dtos = expiredCertifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/expiring-soon")
        public ResponseEntity<List<CertificationDto>> getExpiringSoonCertifications(@PathVariable Long userId) {
                List<Certification> expiringSoonCertifications = certificationService
                                .findCertificationsExpiringSoonByUserId(userId);
                List<CertificationDto> dtos = expiringSoonCertifications.stream()
                                .map(mapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
        }
}