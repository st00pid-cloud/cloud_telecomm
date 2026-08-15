package com.accen.disastertelecom.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "disaster_event")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisasterEvent {

    @Id
    @Column(name = "event_id", length = 50)
    private String eventId;

    @Column(name = "event_name", nullable = false, length = 100)
    private String eventName;

    @Column(name = "hazard_type", nullable = false, length = 50)
    private String hazardType;

    @Column(name = "affected_region", nullable = false, length = 100)
    private String affectedRegion;

    @Column(name = "hazard_exposure", nullable = false, length = 50)
    private String hazardExposure;

    @Column(name = "event_status", nullable = false, length = 50)
    private String eventStatus;
}