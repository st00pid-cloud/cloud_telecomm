package com.accen.disastertelecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {
    private String eventId;
    private String eventName;
    private String hazardType;
    private String affectedRegion;
    private String hazardExposure;
    private String eventStatus;
}