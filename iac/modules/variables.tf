variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "dev"
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
  default     = "disastertelecom"
}

variable "db_user" {
  description = "Postgres database user"
  type        = string
  default     = "disastertelecom_app"
}

variable "db_password" {
  description = "Postgres database password"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Container image for the backend (Cloud Run)"
  type        = string
}

variable "frontend_image" {
  description = "Container image for the frontend (Cloud Run)"
  type        = string
}
