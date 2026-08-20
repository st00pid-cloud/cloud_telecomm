package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.AdvisorRequest;
import com.accen.disastertelecom.dto.AdvisorResponse;
import com.accen.disastertelecom.service.AdvisorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advisor")
public class AdvisorController {

    private final AdvisorService advisorService;

    public AdvisorController(AdvisorService advisorService) {
        this.advisorService = advisorService;
    }

    @GetMapping("/ping")
    public String ping() {
        return "advisor alive";
    }

    @PostMapping("/recommendation")
    public ResponseEntity<AdvisorResponse> generateRecommendation(
            @RequestBody AdvisorRequest request
    ) {
        return ResponseEntity.ok(
                advisorService.generateRecommendation(request)
        );
    }
}