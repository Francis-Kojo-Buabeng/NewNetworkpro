package com.networkpro.user_service.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileCompletionDto {
    private Long userId;
    private int completionPercentage;
    private boolean isComplete;
    private List<String> missingFields;
    private List<String> completedFields;
    private int totalFields;
    private int completedFieldsCount;
} 