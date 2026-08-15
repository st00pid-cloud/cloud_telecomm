package com.accen.disastertelecom.repository;

import com.accen.disastertelecom.entity.DisasterEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterEventRepository extends JpaRepository<DisasterEvent, String> {
    List<DisasterEvent> findByEventStatus(String eventStatus);
}