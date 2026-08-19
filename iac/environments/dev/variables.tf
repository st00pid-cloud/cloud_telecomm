variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "db_password" {
  description = "Postgres database password"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Backend container image (set by CI/CD or manually)"
  type        = string
}

variable "frontend_image" {
  description = "Frontend container image (set by CI/CD or manually)"
  type        = string
}
