package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.entity.TelecomSite;
import com.accen.disastertelecom.repository.TelecomSiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final TelecomSiteRepository telecomSiteRepository;

    @GetMapping
    public ResponseEntity<List<TelecomSite>> getAllSites() {
        return ResponseEntity.ok(telecomSiteRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<TelecomSite> createSite(@RequestBody TelecomSite site) {
        TelecomSite saved = telecomSiteRepository.save(site);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TelecomSite> getSiteById(@PathVariable String id) {
        return telecomSiteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
