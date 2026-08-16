
--Core Table: Base Telecom Site Inventory
CREATE TABLE IF NOT EXISTS telecom_site (
    site_id VARCHAR(50) PRIMARY KEY,
    region VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    connectivity_type VARCHAR(50) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    backup_available BOOLEAN NOT NULL DEFAULT FALSE,
    near_critical_facility VARCHAR(100)
);
--Core Table: Disaster Event Registry
CREATE TABLE IF NOT EXISTS disaster_event(
    event_id VARCHAR(50) PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    hazard_type VARCHAR(50) NOT NULL,
    affected_region VARCHAR(100) NOT NULL,
    hazard_exposure VARCHAR(50) NOT NULL,
    event_status VARCHAR(50) NOT NULL
);

-- Core Table: Operational Site Status
CREATE TABLE IF NOT EXISTS site_status (
    site_id VARCHAR(50) PRIMARY KEY REFERENCES telecom_site(site_id) ON DELETE CASCADE,
    power_status VARCHAR(50) NOT NULL,
    backhaul_status VARCHAR(50) NOT NULL,
    physical_damage VARCHAR(50) NOT NULL,
    current_status VARCHAR(50) NOT NULL,
    affected_users_est INT NOT NULL DEFAULT 0
    );

-- Core Table: Computed Decision Intelligence Scores
CREATE TABLE IF NOT EXISTS score_result (
                                            site_id VARCHAR(50) PRIMARY KEY REFERENCES telecom_site(site_id) ON DELETE CASCADE,
    risk_score DOUBLE PRECISION NOT NULL,
    priority_score DOUBLE PRECISION NOT NULL,
    root_cause VARCHAR(100) NOT NULL,
    fallback_status VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                                                                 );

-- Core Table: Configurable Alert Rules
CREATE TABLE IF NOT EXISTS alert_rule (
    rule_id BIGSERIAL PRIMARY KEY,
    severity_threshold DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);