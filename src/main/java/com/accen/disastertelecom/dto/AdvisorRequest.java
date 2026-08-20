package com.accen.disastertelecom.dto;

import java.util.List;

public record AdvisorRequest(
        Integer affectedCitizens,
        Integer activeOutages,
        Integer connectivityPercent,
        Integer disasterAlerts,
        Integer operationalSites,
        Integer downSites,
        Integer highRiskMunicipalities,
        List<IncidentSnapshot> incidents
) {
    public record IncidentSnapshot(
            String siteId,
            String municipality,
            String region,
            String rootCause,
            String severity,
            Integer priorityScore,
            Integer riskScore,
            String fallbackStatus
    ) {
    }
}