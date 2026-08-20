package com.accen.disastertelecom.dto;

import java.time.Instant;

public record AdvisorResponse(
        String recommendation,
        String model,
        Instant generatedAt,
        boolean aiGenerated
) {
}