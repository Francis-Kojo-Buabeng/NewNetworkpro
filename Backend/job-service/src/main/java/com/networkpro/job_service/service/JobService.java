package com.networkpro.job_service.service;

import com.networkpro.job_service.dto.JobRequestDTO;
import com.networkpro.job_service.dto.JobResponseDTO;
import com.networkpro.job_service.model.Job;
import com.networkpro.job_service.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;

    public List<JobResponseDTO> getAllJobs() {
        return jobRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    public Optional<JobResponseDTO> getJobById(Long id) {
        return jobRepository.findById(id).map(this::toResponseDTO);
    }

    public JobResponseDTO createJob(JobRequestDTO jobRequestDTO) {
        Job job = toEntity(jobRequestDTO);
        Job saved = jobRepository.save(job);
        return toResponseDTO(saved);
    }

    public Optional<JobResponseDTO> updateJob(Long id, JobRequestDTO jobRequestDTO) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(jobRequestDTO.getTitle());
            job.setDescription(jobRequestDTO.getDescription());
            job.setCompany(jobRequestDTO.getCompany());
            job.setLocation(jobRequestDTO.getLocation());
            job.setSalary(jobRequestDTO.getSalary());
            job.setPostedAt(jobRequestDTO.getPostedAt());
            return toResponseDTO(jobRepository.save(job));
        });
    }

    public boolean deleteJob(Long id) {
        return jobRepository.findById(id).map(job -> {
            jobRepository.delete(job);
            return true;
        }).orElse(false);
    }

    // Mapping methods
    private JobResponseDTO toResponseDTO(Job job) {
        JobResponseDTO dto = new JobResponseDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setPostedAt(job.getPostedAt());
        return dto;
    }

    private Job toEntity(JobRequestDTO dto) {
        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setPostedAt(dto.getPostedAt());
        return job;
    }
}