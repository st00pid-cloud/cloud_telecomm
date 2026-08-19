package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.entity.DisasterEvent;
import com.accen.disastertelecom.repository.DisasterEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final DisasterEventRepository disasterEventRepository;

    @GetMapping
    public ResponseEntity<List<DisasterEvent>> getAllEvents() {
        return ResponseEntity.ok(disasterEventRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<DisasterEvent> registerEvent(@RequestBody DisasterEvent event) {
        DisasterEvent saved = disasterEventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
