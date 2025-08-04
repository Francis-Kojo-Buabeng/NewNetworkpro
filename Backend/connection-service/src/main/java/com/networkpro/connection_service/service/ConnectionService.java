package com.networkpro.connection_service.service;

import com.networkpro.connection_service.model.Connection;
import com.networkpro.connection_service.repository.ConnectionRepository;
import com.networkpro.connection_service.dto.ConnectionRequestDTO;
import com.networkpro.connection_service.dto.ConnectionResponseDTO;
import com.networkpro.connection_service.exception.ConnectionNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {
    @Autowired
    private ConnectionRepository connectionRepository;

    public ConnectionResponseDTO sendRequest(ConnectionRequestDTO requestDTO) {
        // Validate that requester and receiver are different
        if (requestDTO.getRequesterId().equals(requestDTO.getReceiverId())) {
            throw new IllegalArgumentException("Cannot send connection request to yourself");
        }

        // Check if connection already exists
        List<Connection> existingConnections = connectionRepository.findByRequesterIdAndReceiverId(
                requestDTO.getRequesterId(), requestDTO.getReceiverId());

        if (!existingConnections.isEmpty()) {
            Connection existing = existingConnections.get(0);
            if ("PENDING".equals(existing.getStatus())) {
                throw new IllegalArgumentException("Connection request already sent");
            } else if ("ACCEPTED".equals(existing.getStatus())) {
                throw new IllegalArgumentException("Already connected with this user");
            }
        }

        // Check reverse connection
        List<Connection> reverseConnections = connectionRepository.findByRequesterIdAndReceiverId(
                requestDTO.getReceiverId(), requestDTO.getRequesterId());

        if (!reverseConnections.isEmpty()) {
            Connection existing = reverseConnections.get(0);
            if ("PENDING".equals(existing.getStatus())) {
                throw new IllegalArgumentException("This user has already sent you a connection request");
            } else if ("ACCEPTED".equals(existing.getStatus())) {
                throw new IllegalArgumentException("Already connected with this user");
            }
        }

        Connection connection = new Connection();
        connection.setRequesterId(requestDTO.getRequesterId());
        connection.setReceiverId(requestDTO.getReceiverId());
        connection.setStatus("PENDING");
        return toResponseDTO(connectionRepository.save(connection));
    }

    public ConnectionResponseDTO acceptRequest(ConnectionRequestDTO requestDTO) {
        Optional<Connection> optional = connectionRepository.findById(requestDTO.getConnectionId());
        if (optional.isPresent()) {
            Connection connection = optional.get();
            connection.setStatus("ACCEPTED");
            return toResponseDTO(connectionRepository.save(connection));
        }
        throw new ConnectionNotFoundException("Connection not found");
    }

    public ConnectionResponseDTO rejectRequest(ConnectionRequestDTO requestDTO) {
        Optional<Connection> optional = connectionRepository.findById(requestDTO.getConnectionId());
        if (optional.isPresent()) {
            Connection connection = optional.get();
            connection.setStatus("REJECTED");
            return toResponseDTO(connectionRepository.save(connection));
        }
        throw new ConnectionNotFoundException("Connection not found");
    }

    public List<ConnectionResponseDTO> listConnections(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        List<Connection> connections = connectionRepository.findByRequesterIdOrReceiverId(userId, userId);
        return connections.stream()
                .filter(conn -> "PENDING".equals(conn.getStatus()) || "ACCEPTED".equals(conn.getStatus()))
                .map(this::toResponseDTO)
                .toList();
    }

    public void removeConnection(Long connectionId) {
        connectionRepository.deleteById(connectionId);
    }

    public String getConnectionStatus(Long requesterId, Long receiverId) {
        List<Connection> connections = connectionRepository.findByRequesterIdAndReceiverId(requesterId, receiverId);
        if (connections.isEmpty())
            return "NONE";
        return connections.get(0).getStatus();
    }

    private ConnectionResponseDTO toResponseDTO(Connection connection) {
        ConnectionResponseDTO dto = new ConnectionResponseDTO();
        dto.setId(connection.getId());
        dto.setRequesterId(connection.getRequesterId());
        dto.setReceiverId(connection.getReceiverId());
        dto.setStatus(connection.getStatus());
        return dto;
    }
}