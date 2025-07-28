package com.networkpro.job_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;
    private LocalDateTime postedAt;
}