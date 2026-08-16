package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.dto.IncidentPayload;
import com.accen.disastertelecom.service.DataTransformationService;
import org.springframework.stereotype.Service;

@Service
public class DataTransformationServiceImpl implements DataTransformationService {

    @Override
    public IncidentPayload normalizeIncidentData(IncidentPayload rawPayload) {
        if (rawPayload.getPowerStatus() == null) rawPayload.setPowerStatus("unknown");
        if (rawPayload.getBackhaulStatus() == null) rawPayload.setBackhaulStatus("unknown");
        if (rawPayload.getPhysicalDamage() == null) rawPayload.setPhysicalDamage("none");
        if (rawPayload.getAffectedUsersEst() == null) rawPayload.setAffectedUsersEst(0);

        rawPayload.setPowerStatus(rawPayload.getPowerStatus().trim().toLowerCase());
        rawPayload.setBackhaulStatus(rawPayload.getBackhaulStatus().trim().toLowerCase());
        rawPayload.setPhysicalDamage(rawPayload.getPhysicalDamage().trim().toLowerCase());

        return rawPayload;
    }
}