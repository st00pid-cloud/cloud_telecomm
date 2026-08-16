package com.accen.disastertelecom.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "score_result")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreResult {

    @Id
    @Column(name = "site_id", length = 50)
    private String siteId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "site_id")
    private TelecomSite site;

    @Column(name = "risk_score", nullable = false)
    private Double riskScore;

    @Column(name = "priority_score", nullable = false)
    private Double priorityScore;

    @Column(name = "root_cause", nullable = false, length = 100)
    private String rootCause;

    @Column(name = "fallback_status", nullable = false, length = 100)
    private String fallbackStatus;

    @Column(nullable = false, length = 50)
    private String severity;

    @Column(name = "processed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime processedAt;
}