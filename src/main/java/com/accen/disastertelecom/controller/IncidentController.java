package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.entity.ScoreResult;
import com.accen.disastertelecom.service.IncidentProcessingOrchestrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentProcessingOrchestrationService incidentProcessingOrchestrationService;

    @PostMapping("/process")
    public ResponseEntity<ScoreResult> processIncident(@RequestBody IncidentPayload payload) {
        ScoreResult result = incidentProcessingOrchestrationService.processIncident(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
