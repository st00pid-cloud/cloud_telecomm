package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.entity.TelecomSite;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @GetMapping
    public ResponseEntity<List<TelecomSite>> getAllSites() {
        TelecomSite mockSite = new TelecomSite("ILO-CELL-001", "Region VI", "Iloilo", "Oton", "cellular", "telco", true, "hospital");
        return ResponseEntity.ok(List.of(mockSite));
    }

    @PostMapping
    public ResponseEntity<TelecomSite> createSite(@RequestBody TelecomSite site) {
        return ResponseEntity.status(HttpStatus.CREATED).body(site);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TelecomSite> getSiteById(@PathVariable String id) {
        TelecomSite mockSite = new TelecomSite(id, "Region VI", "Iloilo", "Oton", "cellular", "telco", true, "hospital");
        return ResponseEntity.ok(mockSite);
    }
}