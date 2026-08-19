package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.service.PriorityScoringService;
import com.accen.disastertelecom.service.RiskScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final RiskScoringService riskScoringService;
    private final PriorityScoringService priorityScoringService;

    @PostMapping("/risk")
    public ResponseEntity<Map<String, Object>> calculateRiskScore(@RequestBody Map<String, Object> req) {
        String hazardExposure = (String) req.getOrDefault("hazardExposure", "medium");
        Boolean backupAvailable = (Boolean) req.getOrDefault("backupAvailable", false);
        String nearCriticalFacility = (String) req.getOrDefault("nearCriticalFacility", "none");

        double score = riskScoringService.calculateRiskScore(hazardExposure, backupAvailable, nearCriticalFacility);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("siteId", req.getOrDefault("siteId", "UNKNOWN"));
        response.put("riskScore", score);
        response.put("status", "calculated");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/priority")
    public ResponseEntity<Map<String, Object>> calculatePriorityScore(@RequestBody Map<String, Object> req) {
        Integer affectedUsers = req.get("affectedUsers") != null
                ? ((Number) req.get("affectedUsers")).intValue() : 0;
        String nearCriticalFacility = (String) req.getOrDefault("nearCriticalFacility", "none");
        Boolean fallbackAvailable = (Boolean) req.getOrDefault("fallbackAvailable", false);
        String currentStatus = (String) req.getOrDefault("currentStatus", "up");

        double score = priorityScoringService.calculatePriorityScore(
                affectedUsers, nearCriticalFacility, fallbackAvailable, currentStatus);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("siteId", req.getOrDefault("siteId", "UNKNOWN"));
        response.put("priorityScore", score);
        response.put("status", "calculated");
        return ResponseEntity.ok(response);
    }
}
