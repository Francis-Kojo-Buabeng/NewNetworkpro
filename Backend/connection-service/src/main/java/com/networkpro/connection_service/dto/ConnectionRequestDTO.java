package com.networkpro.connection_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class ConnectionRequestDTO {
    @NotNull(message = "requesterId is required")
    private Long requesterId;
    @NotNull(message = "receiverId is required")
    private Long receiverId;
    private Long connectionId; // Used for accept/reject
}