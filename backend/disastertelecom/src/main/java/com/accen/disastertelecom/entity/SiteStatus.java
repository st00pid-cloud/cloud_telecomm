package com.accen.disastertelecom.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "site_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteStatus {

    @Id
    @Column(name = "site_id", length = 50)
    private String siteId;

    @Column(name = "power_status", nullable = false, length = 50)
    private String powerStatus;

    @Column(name = "backhaul_status", nullable = false, length = 50)
    private String backhaulStatus;

    @Column(name = "physical_damage", nullable = false, length = 50)
    private String physicalDamage;

    @Column(name = "current_status", nullable = false, length = 50)
    private String currentStatus;

    @Column(name = "affected_users_est", nullable = false)
    private Integer affectedUsersEst;
}