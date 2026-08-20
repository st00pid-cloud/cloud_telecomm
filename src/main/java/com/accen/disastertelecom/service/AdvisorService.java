package com.accen.disastertelecom.service;

import com.accen.disastertelecom.dto.AdvisorRequest;
import com.accen.disastertelecom.dto.AdvisorResponse;

public interface AdvisorService {

  AdvisorResponse generateRecommendation(AdvisorRequest request);
}