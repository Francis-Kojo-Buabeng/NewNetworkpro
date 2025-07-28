package com.networkpro.message_service.controller;

import com.networkpro.message_service.dto.MessageRequestDTO;
import com.networkpro.message_service.dto.MessageResponseDTO;
import com.networkpro.message_service.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    // POST /api/messages - Send a message
    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(@RequestBody MessageRequestDTO request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    // GET /api/messages/{id} - Get a message by ID
    @GetMapping("/{id}")
    public ResponseEntity<MessageResponseDTO> getMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.getMessageById(id));
    }

    // GET /api/messages/conversation?user1={id1}&user2={id2} - Get conversation
    // between two users
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(@RequestParam Long user1,
            @RequestParam Long user2) {
        return ResponseEntity.ok(messageService.getConversation(user1, user2));
    }

    // GET /api/messages/inbox/{userId} - Get all messages received by a user
    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<MessageResponseDTO>> getInbox(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getInbox(userId));
    }

    // DELETE /api/messages/{id} - Delete a message
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}