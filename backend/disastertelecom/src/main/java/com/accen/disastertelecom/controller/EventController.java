package com.accen.disastertelecom.controller;

import com.accen.disastertelecom.dto.EventRegistration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @GetMapping
    public ResponseEntity<List<EventRegistration>> getAllEvents() {
        EventRegistration mockEvent = new EventRegistration("EVT-2026-01", "Typhoon Uwan", "typhoon", "Region VI", "high", "active");
        return ResponseEntity.ok(List.of(mockEvent));
    }

    @PostMapping
    public ResponseEntity<EventRegistration> registerEvent(@RequestBody EventRegistration event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
}