package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.entity.ScoreResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @PostMapping("/process")
    public ResponseEntity<ScoreResult> processIncident(@RequestBody IncidentPayload payload) {
        ScoreResult mockResult = ScoreResult.builder()
                .siteId(payload.getSiteId())
                .riskScore(78.5)
                .priorityScore(85.0)
                .rootCause("power outage")
                .fallbackStatus("satellite_fallback")
                .severity("Critical")
                .processedAt(OffsetDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(mockResult);
    }

    @GetMapping
    public ResponseEntity<List<IncidentPayload>> getAllIncidents() {
        IncidentPayload mockPayload = new IncidentPayload("ILO-CELL-001", "down", "online", "none", 1500);
        return ResponseEntity.ok(List.of(mockPayload));
    }
}