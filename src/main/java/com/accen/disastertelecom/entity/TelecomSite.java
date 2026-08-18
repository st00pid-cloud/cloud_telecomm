package com.accen.disastertelecom.entity;

import lombok.Builder;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "telecom_site")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelecomSite {

    @Id
    @Column(name = "site_id", length = 50)
    private String siteId;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(nullable = false, length = 100)
    private String province;

    @Column(nullable = false, length = 100)
    private String municipality;

    @Column(name = "connectivity_type", nullable = false, length = 50)
    private String connectivityType;

    @Column(name = "provider_type", nullable = false, length = 50)
    private String providerType;

    @Column(name = "backup_available", nullable = false)
    private Boolean backupAvailable;

    @Column(name = "near_critical_facility", length = 100)
    private String nearCriticalFacility;
}