terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# Enable required GCP APIs
resource "google_project_service" "run_api" {
  project = var.project_id
  service = "run.googleapis.com"
}

resource "google_project_service" "sql_api" {
  project = var.project_id
  service = "sqladmin.googleapis.com"
}

# Cloud SQL (Postgres) instance
resource "google_sql_database_instance" "postgres_instance" {
  name             = "${var.environment}-disastertelecom-db"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id

  settings {
    tier = "db-f1-micro"
  }

  deletion_protection = false

  depends_on = [google_project_service.sql_api]
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres_instance.name
  project  = var.project_id
}

resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres_instance.name
  password = var.db_password
  project  = var.project_id
}

# Backend Cloud Run service
resource "google_cloud_run_v2_service" "backend" {
  name     = "${var.environment}-disastertelecom-backend"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = var.backend_image

      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.postgres_instance.public_ip_address
      }
      env {
        name  = "DB_NAME"
        value = var.db_name
      }
      env {
        name  = "DB_USER"
        value = var.db_user
      }
      env {
        name  = "DB_PASSWORD"
        value = var.db_password
      }
    }
  }

  depends_on = [google_project_service.run_api, google_sql_database_instance.postgres_instance]
}

resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Frontend Cloud Run service
resource "google_cloud_run_v2_service" "frontend" {
  name     = "${var.environment}-disastertelecom-frontend"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = var.frontend_image
    }
  }

  depends_on = [google_project_service.run_api]
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
