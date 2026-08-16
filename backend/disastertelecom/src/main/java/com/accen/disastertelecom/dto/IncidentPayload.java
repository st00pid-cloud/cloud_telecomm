package com.accen.disastertelecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentPayload {
    private String siteId;
    private String powerStatus;
    private String backhaulStatus;
    private String physicalDamage;
    private Integer affectedUsersEst;
}