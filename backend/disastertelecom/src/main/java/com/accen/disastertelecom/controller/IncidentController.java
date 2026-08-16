package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.entity.ScoreResult;
import com.accen.disastertelecom.service.IncidentProcessingOrchestrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentProcessingOrchestrationService incidentProcessingService;

    @PostMapping("/process")
    public ResponseEntity<ScoreResult> processIncident(@RequestBody IncidentPayload payload) {
        ScoreResult result = incidentProcessingService.processIncident(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    public ResponseEntity<List<IncidentPayload>> getAllIncidents() {
        IncidentPayload mockPayload = new IncidentPayload("ILO-CELL-001", "down", "online", "none", 1500);
        return ResponseEntity.ok(List.of(mockPayload));
    }
}