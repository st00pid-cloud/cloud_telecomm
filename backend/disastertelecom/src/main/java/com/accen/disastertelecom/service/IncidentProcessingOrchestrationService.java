package com.accen.disastertelecom.service;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.entity.ScoreResult;

public interface IncidentProcessingOrchestrationService {
    ScoreResult processIncident(IncidentPayload payload);
}