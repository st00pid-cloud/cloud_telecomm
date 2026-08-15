package com.accen.disastertelecom.service;

public interface RootCauseClassifierService {
    String classifyRootCause(String powerStatus, String backhaulStatus, String physicalDamage);
}