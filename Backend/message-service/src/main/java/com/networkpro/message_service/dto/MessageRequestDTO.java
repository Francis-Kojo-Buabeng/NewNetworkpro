package com.networkpro.message_service.dto;

import lombok.Data;

@Data
public class MessageRequestDTO {
    private Long senderId;
    private Long receiverId;
    private String content;
}