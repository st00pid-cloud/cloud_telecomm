package com.accen.disastertelecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngineerDashboardResponse {
    private List<Map<String, Object>> siteIncidentTable;
    private Map<String, Integer> rootCauseCounts;
    private Map<String, Object> infrastructureStatusSummary;
}