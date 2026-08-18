package com.accen.disastertelecom.config;

import com.accen.disastertelecom.entity.*;
import com.accen.disastertelecom.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TelecomSiteRepository telecomSiteRepository;
    private final DisasterEventRepository disasterEventRepository;
    private final SiteStatusRepository siteStatusRepository;
    private final ScoreResultRepository scoreResultRepository;
    private final AlertRuleRepository alertRuleRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Executing DataInitializer for local in-memory H2 database...");

        if (telecomSiteRepository.count() > 0) {
            log.info("Database is already populated. Skipping seed initialization.");
            return;
        }

        seedDisasterEvents();
        seedSitesAndTelemetry();
        seedAlertRules();

        log.info("Database auto-seeding completed successfully.");
    }

    private void seedDisasterEvents() {
        List<DisasterEvent> events = List.of(
                DisasterEvent.builder()
                        .eventId("EVT-2026-TY01")
                        .eventName("Typhoon Uwan")
                        .hazardType("typhoon")
                        .affectedRegion("Region VI")
                        .hazardExposure("high")
                        .eventStatus("active")
                        .build(),
                DisasterEvent.builder()
                        .eventId("EVT-2026-FL02")
                        .eventName("Western Visayas Flash Floods")
                        .hazardType("flood")
                        .affectedRegion("Region VI")
                        .hazardExposure("medium")
                        .eventStatus("monitoring")
                        .build()
        );
        disasterEventRepository.saveAll(events);
    }

    private void seedSitesAndTelemetry() {
        // 1. Seed Telecom Sites
        List<TelecomSite> sites = List.of(
                TelecomSite.builder().siteId("ILO-CELL-001").region("Region VI").province("Iloilo").municipality("Oton").connectivityType("cellular").providerType("telco").backupAvailable(true).nearCriticalFacility("hospital").build(),
                TelecomSite.builder().siteId("ILO-CELL-002").region("Region VI").province("Iloilo").municipality("Passi City").connectivityType("cellular").providerType("telco").backupAvailable(false).nearCriticalFacility("none").build(),
                TelecomSite.builder().siteId("ILO-WIFI-003").region("Region VI").province("Iloilo").municipality("Carles").connectivityType("free_wifi").providerType("government").backupAvailable(true).nearCriticalFacility("evacuation_center").build(),
                TelecomSite.builder().siteId("ILO-SAT-004").region("Region VI").province("Iloilo").municipality("Estancia").connectivityType("satellite").providerType("satellite_backup").backupAvailable(true).nearCriticalFacility("hospital").build(),
                TelecomSite.builder().siteId("CAP-CELL-005").region("Region VI").province("Capiz").municipality("Roxas City").connectivityType("cellular").providerType("telco").backupAvailable(true).nearCriticalFacility("hospital").build(),
                TelecomSite.builder().siteId("CAP-RAD-006").region("Region VI").province("Capiz").municipality("Panay").connectivityType("radio").providerType("government").backupAvailable(false).nearCriticalFacility("school").build(),
                TelecomSite.builder().siteId("ANT-CELL-007").region("Region VI").province("Antique").municipality("San Jose").connectivityType("cellular").providerType("telco").backupAvailable(true).nearCriticalFacility("evacuation_center").build(),
                TelecomSite.builder().siteId("ANT-WIFI-008").region("Region VI").province("Antique").municipality("Tibiao").connectivityType("free_wifi").providerType("government").backupAvailable(false).nearCriticalFacility("none").build(),
                TelecomSite.builder().siteId("ILO-CELL-009").region("Region VI").province("Iloilo").municipality("Miagao").connectivityType("cellular").providerType("telco").backupAvailable(true).nearCriticalFacility("school").build(),
                TelecomSite.builder().siteId("ILO-RAD-010").region("Region VI").province("Iloilo").municipality("Barotac Nuevo").connectivityType("radio").providerType("government").backupAvailable(true).nearCriticalFacility("evacuation_center").build(),
                TelecomSite.builder().siteId("CAP-CELL-011").region("Region VI").province("Capiz").municipality("Ivisan").connectivityType("cellular").providerType("telco").backupAvailable(false).nearCriticalFacility("none").build(),
                TelecomSite.builder().siteId("ANT-SAT-012").region("Region VI").province("Antique").municipality("Culasi").connectivityType("satellite").providerType("satellite_backup").backupAvailable(true).nearCriticalFacility("hospital").build(),
                TelecomSite.builder().siteId("ILO-WIFI-013").region("Region VI").province("Iloilo").municipality("Dumangas").connectivityType("free_wifi").providerType("government").backupAvailable(true).nearCriticalFacility("school").build(),
                TelecomSite.builder().siteId("CAP-WIFI-014").region("Region VI").province("Capiz").municipality("Mambusao").connectivityType("free_wifi").providerType("government").backupAvailable(false).nearCriticalFacility("none").build(),
                TelecomSite.builder().siteId("ANT-CELL-015").region("Region VI").province("Antique").municipality("Hamtic").connectivityType("cellular").providerType("telco").backupAvailable(true).nearCriticalFacility("hospital").build()
        );
        telecomSiteRepository.saveAll(sites);

        // 2. Seed Operational Site Statuses
        List<SiteStatus> statuses = List.of(
                SiteStatus.builder().siteId(sites.get(0).getSiteId()).powerStatus("down").backhaulStatus("online").physicalDamage("none").currentStatus("down").affectedUsersEst(3500).build(),
                SiteStatus.builder().siteId(sites.get(1).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(2).getSiteId()).powerStatus("down").backhaulStatus("cut").physicalDamage("major").currentStatus("down").affectedUsersEst(1200).build(),
                SiteStatus.builder().siteId(sites.get(3).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(4).getSiteId()).powerStatus("unstable").backhaulStatus("degraded").physicalDamage("minor").currentStatus("degraded").affectedUsersEst(2100).build(),
                SiteStatus.builder().siteId(sites.get(5).getSiteId()).powerStatus("down").backhaulStatus("online").physicalDamage("none").currentStatus("down").affectedUsersEst(800).build(),
                SiteStatus.builder().siteId(sites.get(6).getSiteId()).powerStatus("down").backhaulStatus("cut").physicalDamage("major").currentStatus("down").affectedUsersEst(4100).build(),
                SiteStatus.builder().siteId(sites.get(7).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(8).getSiteId()).powerStatus("unstable").backhaulStatus("online").physicalDamage("none").currentStatus("degraded").affectedUsersEst(1500).build(),
                SiteStatus.builder().siteId(sites.get(9).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(10).getSiteId()).powerStatus("down").backhaulStatus("cut").physicalDamage("minor").currentStatus("down").affectedUsersEst(2900).build(),
                SiteStatus.builder().siteId(sites.get(11).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(12).getSiteId()).powerStatus("down").backhaulStatus("online").physicalDamage("none").currentStatus("down").affectedUsersEst(1800).build(),
                SiteStatus.builder().siteId(sites.get(13).getSiteId()).powerStatus("online").backhaulStatus("online").physicalDamage("none").currentStatus("up").affectedUsersEst(0).build(),
                SiteStatus.builder().siteId(sites.get(14).getSiteId()).powerStatus("down").backhaulStatus("online").physicalDamage("minor").currentStatus("down").affectedUsersEst(3200).build()
        );
        siteStatusRepository.saveAll(statuses);

        // 3. Seed Score Results
        OffsetDateTime timestamp = OffsetDateTime.now();
        List<ScoreResult> scores = List.of(
                ScoreResult.builder().siteId(sites.get(0).getSiteId()).riskScore(88.5).priorityScore(92.0).rootCause("Power Loss").fallbackStatus("Satellite Fallback Active").severity("CRITICAL").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(1).getSiteId()).riskScore(20.0).priorityScore(15.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(2).getSiteId()).riskScore(95.0).priorityScore(89.5).rootCause("Physical Damage").fallbackStatus("Emergency Radio Link").severity("CRITICAL").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(3).getSiteId()).riskScore(15.0).priorityScore(10.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(4).getSiteId()).riskScore(65.0).priorityScore(71.0).rootCause("Network Congestion").fallbackStatus("Satellite Fallback Active").severity("HIGH").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(5).getSiteId()).riskScore(50.0).priorityScore(45.0).rootCause("Power Loss").fallbackStatus("No Fallback Available").severity("MEDIUM").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(6).getSiteId()).riskScore(92.0).priorityScore(96.5).rootCause("Fiber/Backhaul Cut").fallbackStatus("Satellite Fallback Active").severity("CRITICAL").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(7).getSiteId()).riskScore(18.0).priorityScore(12.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(8).getSiteId()).riskScore(55.0).priorityScore(58.0).rootCause("Power Loss").fallbackStatus("Free Wi-Fi Operational").severity("MEDIUM").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(9).getSiteId()).riskScore(22.0).priorityScore(18.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(10).getSiteId()).riskScore(78.0).priorityScore(81.0).rootCause("Fiber/Backhaul Cut").fallbackStatus("No Fallback Available").severity("HIGH").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(11).getSiteId()).riskScore(12.0).priorityScore(10.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(12).getSiteId()).riskScore(62.0).priorityScore(64.0).rootCause("Power Loss").fallbackStatus("Free Wi-Fi Operational").severity("MEDIUM").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(13).getSiteId()).riskScore(25.0).priorityScore(20.0).rootCause("Operational").fallbackStatus("Primary Link Operational").severity("LOW").processedAt(timestamp).build(),
                ScoreResult.builder().siteId(sites.get(14).getSiteId()).riskScore(89.0).priorityScore(94.0).rootCause("Power Loss").fallbackStatus("Satellite Fallback Active").severity("CRITICAL").processedAt(timestamp).build()
        );
        scoreResultRepository.saveAll(scores);
    }

    private void seedAlertRules() {
        List<AlertRule> rules = List.of(
                AlertRule.builder().severityThreshold(90.0).description("CRITICAL: Priority score >= 90. Immediate site dispatch required for critical facilities.").enabled(true).build(),
                AlertRule.builder().severityThreshold(75.0).description("HIGH: Priority score >= 75. Backhaul cut or major power failure in highly populated zone.").enabled(true).build(),
                AlertRule.builder().severityThreshold(50.0).description("MEDIUM: Priority score >= 50. Unstable power or minor site degradation.").enabled(true).build(),
                AlertRule.builder().severityThreshold(25.0).description("LOW: Priority score < 25. Routine operational status.").enabled(true).build()
        );
        alertRuleRepository.saveAll(rules);
    }
}