package com.accen.disastertelecom.service;

public interface RiskScoringService {
    double calculateRiskScore(String hazardExposure, Boolean backupAvailable, String nearCriticalFacility);
}