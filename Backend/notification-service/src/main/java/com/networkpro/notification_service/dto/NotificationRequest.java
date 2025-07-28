package com.networkpro.notification_service.dto;

public class NotificationRequest {
    private String userId;
    private String message;

    public NotificationRequest() {
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}