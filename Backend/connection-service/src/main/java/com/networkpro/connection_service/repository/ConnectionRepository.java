package com.networkpro.connection_service.repository;

import com.networkpro.connection_service.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByRequesterIdOrReceiverId(Long requesterId, Long receiverId);

    List<Connection> findByRequesterIdAndReceiverId(Long requesterId, Long receiverId);
}