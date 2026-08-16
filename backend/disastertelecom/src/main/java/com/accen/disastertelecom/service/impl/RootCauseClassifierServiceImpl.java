package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.service.RootCauseClassifierService;
import org.springframework.stereotype.Service;

@Service
public class RootCauseClassifierServiceImpl implements RootCauseClassifierService {

    @Override
    public String classifyRootCause(String powerStatus, String backhaulStatus, String physicalDamage) {
        if ("major".equalsIgnoreCase(physicalDamage) || "minor".equalsIgnoreCase(physicalDamage)) {
            return "physical damage";
        }
        if ("down".equalsIgnoreCase(powerStatus) || "unstable".equalsIgnoreCase(powerStatus)) {
            return "power outage";
        }
        if ("cut".equalsIgnoreCase(backhaulStatus) || "degraded".equalsIgnoreCase(backhaulStatus)) {
            return "fiber/backhaul cut";
        }
        if ("online".equalsIgnoreCase(powerStatus) && "online".equalsIgnoreCase(backhaulStatus)) {
            return "network congestion";
        }
        return "unknown";
    }
}