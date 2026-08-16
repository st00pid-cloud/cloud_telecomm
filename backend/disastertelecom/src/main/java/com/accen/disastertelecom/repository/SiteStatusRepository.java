package com.accen.disastertelecom.repository;

import com.accen.disastertelecom.entity.SiteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteStatusRepository extends JpaRepository<SiteStatus, String> {
    List<SiteStatus> findByCurrentStatus(String currentStatus);
}