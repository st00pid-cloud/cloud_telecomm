package com.accen.disastertelecom.service;

import com.accen.disastertelecom.dto.IncidentPayload;

public interface DataTransformationService {
    IncidentPayload normalizeIncidentData(IncidentPayload rawPayload);
}