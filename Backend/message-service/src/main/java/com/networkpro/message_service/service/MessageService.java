package com.networkpro.message_service.service;

import com.networkpro.message_service.dto.MessageRequestDTO;
import com.networkpro.message_service.dto.MessageResponseDTO;
import com.networkpro.message_service.model.Message;
import com.networkpro.message_service.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public MessageResponseDTO sendMessage(MessageRequestDTO request) {
        Message message = Message.builder()
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .status("SENT")
                .build();
        Message saved = messageRepository.save(message);
        return toResponseDTO(saved);
    }

    public MessageResponseDTO getMessageById(Long id) {
        Message message = messageRepository.findById(id).orElseThrow(() -> new RuntimeException("Message not found"));
        return toResponseDTO(message);
    }

    public List<MessageResponseDTO> getConversation(Long user1, Long user2) {
        List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
                user1, user2, user2, user1);
        return messages.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public List<MessageResponseDTO> getInbox(Long userId) {
        List<Message> messages = messageRepository.findByReceiverId(userId);
        return messages.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

    private MessageResponseDTO toResponseDTO(Message message) {
        MessageResponseDTO dto = new MessageResponseDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setReceiverId(message.getReceiverId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setStatus(message.getStatus());
        return dto;
    }
}