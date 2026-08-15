package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.DrrmDashboardResponse;
import com.accen.disastertelecom.dto.EngineerDashboardResponse;
import com.accen.disastertelecom.dto.ExecutiveDashboardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/drrm")
    public ResponseEntity<DrrmDashboardResponse> getDrrmDashboard() {
        DrrmDashboardResponse response = new DrrmDashboardResponse(
                "Active Disaster Response",
                List.of("Oton", "Tigbauan"),
                Map.of("Oton", "satellite", "Tigbauan", "free_wifi"),
                List.of("Oton Provincial Hospital"),
                List.of(Map.of("siteId", "ILO-CELL-001", "priorityScore", 88.5))
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/engineer")
    public ResponseEntity<EngineerDashboardResponse> getEngineerDashboard() {
        EngineerDashboardResponse response = new EngineerDashboardResponse(
                List.of(Map.of("siteId", "ILO-CELL-001", "rootCause", "power outage", "severity", "Critical")),
                Map.of("power outage", 12, "fiber cut", 4, "physical damage", 2),
                Map.of("activeSites", 45, "downSites", 18)
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/executive")
    public ResponseEntity<ExecutiveDashboardResponse> getExecutiveDashboard() {
        ExecutiveDashboardResponse response = new ExecutiveDashboardResponse(
                12500,
                18,
                72.4,
                Map.of("Region VI Status", "Partially Operational")
        );
        return ResponseEntity.ok(response);
    }
}