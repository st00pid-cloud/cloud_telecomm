package com.accen.disastertelecom.service;

public interface PriorityScoringService {
    double calculatePriorityScore(Integer affectedUsers, String nearCriticalFacility, Boolean fallbackAvailable, String currentStatus);
}