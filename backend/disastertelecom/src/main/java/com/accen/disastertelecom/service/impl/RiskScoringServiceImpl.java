package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.service.RiskScoringService;
import org.springframework.stereotype.Service;

@Service
public class RiskScoringServiceImpl implements RiskScoringService {

    @Override
    public double calculateRiskScore(String hazardExposure, Boolean backupAvailable, String nearCriticalFacility) {
        double score = 0.0;

        // Hazard Exposure Weight
        if ("high".equalsIgnoreCase(hazardExposure)) score += 40.0;
        else if ("medium".equalsIgnoreCase(hazardExposure)) score += 25.0;
        else score += 10.0;

        // Backup Power Vulnerability Weight
        if (Boolean.FALSE.equals(backupAvailable)) score += 30.0;

        // Proximity to Critical Infrastructure
        if (nearCriticalFacility != null && !"none".equalsIgnoreCase(nearCriticalFacility)) {
            score += 30.0;
        }

        return Math.min(score, 100.0);
    }
}