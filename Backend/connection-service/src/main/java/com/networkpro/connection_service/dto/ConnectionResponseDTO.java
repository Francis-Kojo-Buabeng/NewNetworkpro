package com.networkpro.connection_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConnectionResponseDTO {
    private Long id;
    private Long requesterId;
    private Long receiverId;
    private String status;
}