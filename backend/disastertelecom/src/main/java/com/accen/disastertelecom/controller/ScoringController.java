package com.accen.disastertelecom.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scoring")
public class ScoringController {

    @PostMapping("/risk")
    public ResponseEntity<Map<String, Object>> calculateRiskScore(@RequestBody Map<String, Object> riskRequest) {
        return ResponseEntity.ok(Map.of(
                "siteId", riskRequest.getOrDefault("siteId", "UNKNOWN"),
                "riskScore", 75.0,
                "status", "calculated"
        ));
    }

    @PostMapping("/priority")
    public ResponseEntity<Map<String, Object>> calculatePriorityScore(@RequestBody Map<String, Object> priorityRequest) {
        return ResponseEntity.ok(Map.of(
                "siteId", priorityRequest.getOrDefault("siteId", "UNKNOWN"),
                "priorityScore", 88.5,
                "status", "calculated"
        ));
    }
}