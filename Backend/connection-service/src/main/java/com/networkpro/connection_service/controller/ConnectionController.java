package com.networkpro.connection_service.controller;

import com.networkpro.connection_service.dto.ConnectionRequestDTO;
import com.networkpro.connection_service.dto.ConnectionResponseDTO;
import com.networkpro.connection_service.dto.ApiResponse;
import com.networkpro.connection_service.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/connections")
public class ConnectionController {
    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/request")
    public ApiResponse<ConnectionResponseDTO> sendRequest(@Valid @RequestBody ConnectionRequestDTO requestDTO) {
        return new ApiResponse<>("Connection request sent", connectionService.sendRequest(requestDTO), "success");
    }

    @PostMapping("/accept")
    public ApiResponse<ConnectionResponseDTO> acceptRequest(@Valid @RequestBody ConnectionRequestDTO requestDTO) {
        return new ApiResponse<>("Connection request accepted", connectionService.acceptRequest(requestDTO), "success");
    }

    @PostMapping("/reject")
    public ApiResponse<ConnectionResponseDTO> rejectRequest(@Valid @RequestBody ConnectionRequestDTO requestDTO) {
        return new ApiResponse<>("Connection request rejected", connectionService.rejectRequest(requestDTO), "success");
    }

    @GetMapping
    public ApiResponse<List<ConnectionResponseDTO>> listConnections(@RequestParam Long userId) {
        return new ApiResponse<>("Connections fetched", connectionService.listConnections(userId), "success");
    }

    @DeleteMapping("/{connectionId}")
    public ApiResponse<Void> removeConnection(@PathVariable Long connectionId) {
        connectionService.removeConnection(connectionId);
        return new ApiResponse<>("Connection removed", null, "success");
    }

    @GetMapping("/status")
    public ApiResponse<String> getConnectionStatus(@RequestParam Long requesterId, @RequestParam Long receiverId) {
        return new ApiResponse<>("Connection status fetched",
                connectionService.getConnectionStatus(requesterId, receiverId), "success");
    }
}