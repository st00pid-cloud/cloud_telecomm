package com.accen.disastertelecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutiveDashboardResponse {
    private Integer totalAffectedUsers;
    private Integer activeOutagesCount;
    private Double regionConnectivityPercentage;
    private Map<String, Object> highLevelAreaStatus;
}