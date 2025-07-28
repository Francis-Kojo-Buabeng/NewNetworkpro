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
        List<Connection> connections = connectionRepository.findByRequesterIdOrReceiverId(userId, userId);
        return connections.stream().map(this::toResponseDTO).toList();
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