package com.accen.disastertelecom.repository;

import com.example.disastertelecom.entity.TelecomSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelecomSiteRepository extends JpaRepository<TelecomSite, String> {
    List<TelecomSite> findByRegion(String region);
    List<TelecomSite> findByMunicipality(String municipality);
}