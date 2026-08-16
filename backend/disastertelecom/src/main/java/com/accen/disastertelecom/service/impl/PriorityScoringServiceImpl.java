package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.service.PriorityScoringService;
import org.springframework.stereotype.Service;

@Service
public class PriorityScoringServiceImpl implements PriorityScoringService {

    @Override
    public double calculatePriorityScore(Integer affectedUsers, String nearCriticalFacility, Boolean fallbackAvailable, String currentStatus) {
        double score = 0.0;

        // Affected Population Impact
        if (affectedUsers != null) {
            score += Math.min((affectedUsers / 5000.0) * 40.0, 40.0);
        }

        // Critical Infrastructure Proximity
        if (nearCriticalFacility != null && !"none".equalsIgnoreCase(nearCriticalFacility)) {
            score += 30.0;
        }

        // Lack of Fallback Connectivity Increases Restoration Urgency
        if (Boolean.FALSE.equals(fallbackAvailable)) {
            score += 20.0;
        }

        // Outage Status Weight
        if ("down".equalsIgnoreCase(currentStatus)) {
            score += 10.0;
        }

        return Math.min(score, 100.0);
    }
}