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
        ScoreResult mockResult = new ScoreResult(
                payload.getSiteId(), 78.5, 85.0, "power outage", "satellite_fallback", "Critical", OffsetDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(mockResult);
    }

    @GetMapping
    public ResponseEntity<List<IncidentPayload>> getAllIncidents() {
        IncidentPayload mockPayload = new IncidentPayload("ILO-CELL-001", "down", "online", "none", 1500);
        return ResponseEntity.ok(List.of(mockPayload));
    }
}