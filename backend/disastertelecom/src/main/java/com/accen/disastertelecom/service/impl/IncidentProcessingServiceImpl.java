package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.entity.ScoreResult;
import com.accen.disastertelecom.entity.SiteStatus;
import com.accen.disastertelecom.entity.TelecomSite;
import com.accen.disastertelecom.repository.ScoreResultRepository;
import com.accen.disastertelecom.repository.SiteStatusRepository;
import com.accen.disastertelecom.repository.TelecomSiteRepository;
import com.accen.disastertelecom.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class IncidentProcessingServiceImpl implements IncidentProcessingService {

    private final DataTransformationService transformationService;
    private final RiskScoringService riskScoringService;
    private final PriorityScoringService priorityScoringService;
    private final RootCauseClassifierService rootCauseClassifierService;
    private final TelecomSiteRepository telecomSiteRepository;
    private final SiteStatusRepository siteStatusRepository;
    private final ScoreResultRepository scoreResultRepository;

    @Override
    @Transactional
    public ScoreResult processIncident(IncidentPayload payload) {
        // 1. Normalize payload data
        IncidentPayload normalized = transformationService.normalizeIncidentData(payload);

        // 2. Retrieve telecom site context
        TelecomSite site = telecomSiteRepository.findById(normalized.getSiteId())
                .orElse(new TelecomSite(normalized.getSiteId(), "Region VI", "Iloilo", "Oton", "cellular", "telco", false, "none"));

        // 3. Classify Root Cause
        String rootCause = rootCauseClassifierService.classifyRootCause(
                normalized.getPowerStatus(), normalized.getBackhaulStatus(), normalized.getPhysicalDamage()
        );

        // 4. Compute Risk and Priority Scores
        double riskScore = riskScoringService.calculateRiskScore("high", site.getBackupAvailable(), site.getNearCriticalFacility());
        double priorityScore = priorityScoringService.calculatePriorityScore(
                normalized.getAffectedUsersEst(), site.getNearCriticalFacility(), site.getBackupAvailable(), normalized.getPowerStatus()
        );

        // 5. Update Operational Site Status
        SiteStatus status = new SiteStatus(
                normalized.getSiteId(), normalized.getPowerStatus(), normalized.getBackhaulStatus(),
                normalized.getPhysicalDamage(), "down", normalized.getAffectedUsersEst()
        );
        siteStatusRepository.save(status);

        // 6. Persist and return computed decision result
        String severity = priorityScore > 75.0 ? "Critical" : priorityScore > 50.0 ? "High" : "Medium";
        String fallbackStatus = site.getBackupAvailable() ? "satellite_fallback" : "none_available";

        ScoreResult result = new ScoreResult(
                normalized.getSiteId(), riskScore, priorityScore, rootCause, fallbackStatus, severity, OffsetDateTime.now()
        );

        return scoreResultRepository.save(result);
    }
}