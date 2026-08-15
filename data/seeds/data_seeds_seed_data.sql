-- Base Telecom Site Inventory
INSERT INTO telecom_site (site_id, region, province, municipality, connectivity_type, provider_type, backup_available, near_critical_facility) VALUES
('SITE-VI-001', 'Region VI', 'Iloilo', 'Estancia', 'cellular', 'telco', TRUE, 'hospital'),
('SITE-VI-002', 'Region VI', 'Iloilo', 'Carles', 'cellular', 'telco', FALSE, 'evacuation_center'),
('SITE-VI-003', 'Region VI', 'Capiz', 'Roxas City', 'cellular', 'telco', TRUE, 'hospital'),
('SITE-VI-004', 'Region VI', 'Iloilo', 'Passi City', 'cellular', 'telco', FALSE, 'evacuation_center'),
('SITE-VI-005', 'Region VI', 'Antique', 'San Jose', 'cellular', 'telco', FALSE, 'hospital'),
('SITE-VI-006', 'Region VI', 'Capiz', 'Panay', 'satellite', 'satellite_backup', TRUE, 'evacuation_center'),
('SITE-VI-007', 'Region VI', 'Iloilo', 'Oton', 'free_wifi', 'government', TRUE, 'school'),
('SITE-VI-008', 'Region VI', 'Antique', 'Culasi', 'radio', 'government', TRUE, 'evacuation_center'),
('SITE-VI-009', 'Region VI', 'Iloilo', 'Balasan', 'cellular', 'telco', TRUE, 'school'),
('SITE-VI-010', 'Region VI', 'Capiz', 'Dao', 'cellular', 'telco', FALSE, 'none'),
('SITE-VI-011', 'Region VI', 'Antique', 'Sibalom', 'free_wifi', 'government', FALSE, 'school'),
('SITE-VI-012', 'Region VI', 'Iloilo', 'Ajuy', 'cellular', 'telco', FALSE, 'none'),
('SITE-VI-013', 'Region VI', 'Capiz', 'Tapaz', 'radio', 'government', TRUE, 'none'),
('SITE-VI-014', 'Region VI', 'Antique', 'Hamtic', 'satellite', 'satellite_backup', TRUE, 'hospital'),
('SITE-VI-015', 'Region VI', 'Iloilo', 'Sara', 'cellular', 'telco', TRUE, 'hospital');

-- Disaster Event Registry
INSERT INTO disaster_event (event_id, event_name, hazard_type, affected_region, hazard_exposure, event_status) VALUES
('EVT-2026-001', 'Typhoon Uwan', 'typhoon', 'Region VI', 'high', 'active'),
('EVT-2026-002', 'Super Typhoon Landfall', 'typhoon', 'Region VI', 'high', 'monitoring');

-- Operational Site Status
INSERT INTO site_status (site_id, power_status, backhaul_status, physical_damage, current_status, affected_users_est) VALUES
('SITE-VI-001', 'down', 'online', 'none', 'down', 4500),
('SITE-VI-002', 'online', 'cut', 'minor', 'down', 3200),
('SITE-VI-003', 'unstable', 'degraded', 'major', 'down', 2800),
('SITE-VI-004', 'down', 'online', 'none', 'down', 2100),
('SITE-VI-005', 'down', 'cut', 'minor', 'down', 1500),
('SITE-VI-006', 'unstable', 'degraded', 'none', 'degraded', 1200),
('SITE-VI-007', 'down', 'online', 'none', 'degraded', 800),
('SITE-VI-008', 'online', 'cut', 'minor', 'down', 1800),
('SITE-VI-009', 'down', 'online', 'none', 'down', 1400),
('SITE-VI-010', 'online', 'cut', 'none', 'down', 3100),
('SITE-VI-011', 'online', 'degraded', 'none', 'degraded', 500),
('SITE-VI-012', 'online', 'online', 'none', 'up', 0),
('SITE-VI-013', 'online', 'online', 'none', 'up', 0),
('SITE-VI-014', 'online', 'online', 'none', 'up', 0),
('SITE-VI-015', 'down', 'online', 'none', 'down', 5200);

-- Computed Decision Intelligence Scores
INSERT INTO score_result (site_id, risk_score, priority_score, root_cause, fallback_status, severity, processed_at) VALUES
('SITE-VI-001', 88.5, 94.2, 'Power Loss', 'Satellite Fallback Active', 'CRITICAL', '2026-08-16 05:00:00+00'),
('SITE-VI-002', 85.0, 91.0, 'Fiber/Backhaul Cut', 'No Fallback Available', 'CRITICAL', '2026-08-16 05:00:00+00'),
('SITE-VI-003', 92.0, 96.5, 'Physical Damage', 'Emergency Radio Link', 'CRITICAL', '2026-08-16 05:00:00+00'),
('SITE-VI-004', 78.0, 83.5, 'Power Loss', 'No Fallback Available', 'CRITICAL', '2026-08-16 05:00:00+00'),
('SITE-VI-005', 74.5, 72.0, 'Fiber/Backhaul Cut', 'No Fallback Available', 'HIGH', '2026-08-16 05:00:00+00'),
('SITE-VI-006', 62.0, 65.0, 'Network Congestion', 'Satellite Fallback Active', 'HIGH', '2026-08-16 05:00:00+00'),
('SITE-VI-007', 55.0, 58.0, 'Power Loss', 'Free Wi-Fi Operational', 'MEDIUM', '2026-08-16 05:00:00+00'),
('SITE-VI-008', 68.0, 76.0, 'Fiber/Backhaul Cut', 'Emergency Radio Link', 'HIGH', '2026-08-16 05:00:00+00'),
('SITE-VI-009', 60.0, 62.5, 'Power Loss', 'Satellite Fallback Active', 'MEDIUM', '2026-08-16 05:00:00+00'),
('SITE-VI-010', 71.0, 69.0, 'Fiber/Backhaul Cut', 'No Fallback Available', 'HIGH', '2026-08-16 05:00:00+00'),
('SITE-VI-011', 42.0, 38.0, 'Network Congestion', 'No Fallback Available', 'MEDIUM', '2026-08-16 05:00:00+00'),
('SITE-VI-012', 12.0, 15.0, 'Operational', 'Free Wi-Fi Operational', 'LOW', '2026-08-16 05:00:00+00'),
('SITE-VI-013', 18.0, 10.0, 'Operational', 'Emergency Radio Link', 'LOW', '2026-08-16 05:00:00+00'),
('SITE-VI-014', 22.0, 25.0, 'Operational', 'Satellite Fallback Active', 'LOW', '2026-08-16 05:00:00+00'),
('SITE-VI-015', 95.0, 98.0, 'Power Loss', 'Satellite Fallback Active', 'CRITICAL', '2026-08-16 05:00:00+00');

-- Configurable Alert Rules
INSERT INTO alert_rule (rule_id, severity_threshold, description, enabled) VALUES
(1, 80.0, 'CRITICAL OUTAGE: Trigger immediate emergency deployment for down sites near critical facilities affecting >2,000 users.', TRUE),
(2, 65.0, 'HIGH PRIORITY: Alert regional backhaul and power response teams for degraded or offline infrastructure.', TRUE),
(3, 40.0, 'MEDIUM WARNING: Monitor congestion and backup battery draw on non-critical local links.', TRUE),
(4, 20.0, 'LOW ADVISORY: Routine telemetry audit and minor variance logging.', FALSE);
