package com.accen.disastertelecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrrmDashboardResponse {
    private String disasterStatus;
    private List<String> highRiskMunicipalities;
    private Map<String, String> connectivityFallbackAvailability;
    private List<String> criticalFacilitiesAffected;
    private List<Map<String, Object>> priorityRestorationQueue;
}