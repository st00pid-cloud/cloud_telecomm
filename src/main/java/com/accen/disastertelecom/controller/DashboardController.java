package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.DrrmDashboardResponse;
import com.accen.disastertelecom.dto.EngineerDashboardResponse;
import com.accen.disastertelecom.dto.ExecutiveDashboardResponse;
import com.accen.disastertelecom.entity.DisasterEvent;
import com.accen.disastertelecom.entity.SiteStatus;
import com.accen.disastertelecom.entity.TelecomSite;
import com.accen.disastertelecom.repository.DisasterEventRepository;
import com.accen.disastertelecom.repository.SiteStatusRepository;
import com.accen.disastertelecom.repository.TelecomSiteRepository;
import com.accen.disastertelecom.service.PriorityScoringService;
import com.accen.disastertelecom.service.RiskScoringService;
import com.accen.disastertelecom.service.RootCauseClassifierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TelecomSiteRepository telecomSiteRepository;
    private final SiteStatusRepository siteStatusRepository;
    private final DisasterEventRepository disasterEventRepository;
    private final RiskScoringService riskScoringService;
    private final PriorityScoringService priorityScoringService;
    private final RootCauseClassifierService rootCauseClassifierService;

    /**
     * Internal computed-score row. Replaces reliance on pre-seeded ScoreResult
     * table — everything here is calculated live from current site/status/event data
     * on every dashboard request, using the real scoring services.
     */
    private record LiveScore(
            String siteId,
            String municipality,
            String nearCriticalFacility,
            double riskScore,
            double priorityScore,
            String rootCause,
            String fallbackStatus,
            String severity
    ) {}

    private List<LiveScore> computeLiveScores() {
        List<TelecomSite> sites = telecomSiteRepository.findAll();
        List<SiteStatus> statuses = siteStatusRepository.findAll();
        List<DisasterEvent> activeEvents = disasterEventRepository.findByEventStatus("active");

        Map<String, SiteStatus> statusBySite = statuses.stream()
                .collect(Collectors.toMap(SiteStatus::getSiteId, s -> s, (a, b) -> b));

        // Derive a hazard exposure level per region from active disaster events.
        // Falls back to "medium" if no active event covers that region.
        Map<String, String> hazardExposureByRegion = new HashMap<>();
        for (DisasterEvent ev : activeEvents) {
            hazardExposureByRegion.put(ev.getAffectedRegion(), ev.getHazardExposure());
        }

        List<LiveScore> results = new ArrayList<>();
        for (TelecomSite site : sites) {
            SiteStatus status = statusBySite.get(site.getSiteId());
            if (status == null) {
                continue; // no operational data for this site yet, skip
            }

            String hazardExposure = hazardExposureByRegion.getOrDefault(site.getRegion(), "medium");

            String rootCause = rootCauseClassifierService.classifyRootCause(
                    status.getPowerStatus(), status.getBackhaulStatus(), status.getPhysicalDamage()
            );

            double riskScore = riskScoringService.calculateRiskScore(
                    hazardExposure, site.getBackupAvailable(), site.getNearCriticalFacility()
            );

            double priorityScore = priorityScoringService.calculatePriorityScore(
                    status.getAffectedUsersEst(), site.getNearCriticalFacility(),
                    site.getBackupAvailable(), status.getCurrentStatus()
            );

            String severity = priorityScore >= 75.0 ? "CRITICAL"
                    : priorityScore >= 50.0 ? "HIGH"
                    : priorityScore >= 25.0 ? "MEDIUM"
                    : "LOW";

            String fallbackStatus = Boolean.TRUE.equals(site.getBackupAvailable())
                    ? "satellite_fallback" : "none_available";

            results.add(new LiveScore(
                    site.getSiteId(), site.getMunicipality(), site.getNearCriticalFacility(),
                    riskScore, priorityScore, rootCause, fallbackStatus, severity
            ));
        }

        results.sort((a, b) -> Double.compare(b.priorityScore(), a.priorityScore()));
        return results;
    }

    @GetMapping("/drrm")
    public ResponseEntity<DrrmDashboardResponse> getDrrmDashboard() {
        List<LiveScore> scores = computeLiveScores();

        List<String> highRiskMunicipalities = scores.stream()
                .filter(sc -> "CRITICAL".equals(sc.severity()) || "HIGH".equals(sc.severity()))
                .map(LiveScore::municipality)
                .distinct()
                .collect(Collectors.toList());

        Map<String, String> connectivityFallbackAvailability = new LinkedHashMap<>();
        for (LiveScore sc : scores) {
            connectivityFallbackAvailability.putIfAbsent(sc.municipality(), sc.fallbackStatus());
        }

        List<String> criticalFacilitiesAffected = scores.stream()
                .filter(sc -> sc.nearCriticalFacility() != null && !"none".equalsIgnoreCase(sc.nearCriticalFacility()))
                .filter(sc -> "CRITICAL".equals(sc.severity()) || "HIGH".equals(sc.severity()))
                .map(sc -> sc.municipality() + " - " + sc.nearCriticalFacility())
                .collect(Collectors.toList());

        List<Map<String, Object>> priorityRestorationQueue = scores.stream()
                .limit(10)
                .map(sc -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("siteId", sc.siteId());
                    m.put("priorityScore", sc.priorityScore());
                    m.put("riskScore", sc.riskScore());
                    m.put("severity", sc.severity());
                    m.put("rootCause", sc.rootCause());
                    m.put("fallbackStatus", sc.fallbackStatus());
                    return m;
                })
                .collect(Collectors.toList());

        DrrmDashboardResponse response = new DrrmDashboardResponse(
                "Active Disaster Response",
                highRiskMunicipalities,
                connectivityFallbackAvailability,
                criticalFacilitiesAffected,
                priorityRestorationQueue
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/engineer")
    public ResponseEntity<EngineerDashboardResponse> getEngineerDashboard() {
        List<LiveScore> scores = computeLiveScores();

        List<Map<String, Object>> siteIncidentTable = scores.stream()
                .map(sc -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("siteId", sc.siteId());
                    m.put("rootCause", sc.rootCause());
                    m.put("severity", sc.severity());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Integer> rootCauseCounts = new LinkedHashMap<>();
        for (LiveScore sc : scores) {
            rootCauseCounts.merge(sc.rootCause(), 1, Integer::sum);
        }

        List<SiteStatus> statuses = siteStatusRepository.findAll();
        long activeSites = statuses.stream().filter(s -> "up".equalsIgnoreCase(s.getCurrentStatus())).count();
        long downSites = statuses.stream().filter(s -> "down".equalsIgnoreCase(s.getCurrentStatus())).count();

        Map<String, Object> infrastructureStatusSummary = new LinkedHashMap<>();
        infrastructureStatusSummary.put("activeSites", activeSites);
        infrastructureStatusSummary.put("downSites", downSites);

        EngineerDashboardResponse response = new EngineerDashboardResponse(
                siteIncidentTable,
                rootCauseCounts,
                infrastructureStatusSummary
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/executive")
    public ResponseEntity<ExecutiveDashboardResponse> getExecutiveDashboard() {
        List<LiveScore> scores = computeLiveScores();
        List<SiteStatus> statuses = siteStatusRepository.findAll();
        List<DisasterEvent> activeEvents = disasterEventRepository.findByEventStatus("active");

        int totalAffectedUsers = statuses.stream()
                .mapToInt(SiteStatus::getAffectedUsersEst)
                .sum();

        long activeOutagesCount = statuses.stream()
                .filter(s -> "down".equalsIgnoreCase(s.getCurrentStatus()))
                .count();

        long totalSites = statuses.size();
        long upSites = statuses.stream().filter(s -> "up".equalsIgnoreCase(s.getCurrentStatus())).count();
        double regionConnectivityPercentage = totalSites == 0 ? 0.0 :
                Math.round((upSites * 10000.0 / totalSites)) / 100.0;

        long highVulnerabilitySiteCount = scores.stream()
                .filter(sc -> "CRITICAL".equals(sc.severity()) || "HIGH".equals(sc.severity()))
                .count();

        double averageRestorationPriorityIndex = scores.stream()
                .mapToDouble(LiveScore::priorityScore)
                .average()
                .orElse(0.0);
        averageRestorationPriorityIndex = Math.round(averageRestorationPriorityIndex * 100.0) / 100.0;

        Map<String, Object> highLevelAreaStatus = new LinkedHashMap<>();
        highLevelAreaStatus.put("Region VI Status", activeOutagesCount > totalSites / 2 ? "Severely Affected" : "Partially Operational");
        highLevelAreaStatus.put("Active Disaster Alerts", activeEvents.size());
        highLevelAreaStatus.put("High-Vulnerability Site Count", highVulnerabilitySiteCount);
        highLevelAreaStatus.put("Average Restoration Priority Index", averageRestorationPriorityIndex);

        ExecutiveDashboardResponse response = new ExecutiveDashboardResponse(
                totalAffectedUsers,
                (int) activeOutagesCount,
                regionConnectivityPercentage,
                highLevelAreaStatus
        );
        return ResponseEntity.ok(response);
    }
}
