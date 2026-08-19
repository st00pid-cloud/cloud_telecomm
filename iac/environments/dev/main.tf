terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "disastertelecom" {
  source = "../../modules"

  project_id     = var.project_id
  region         = var.region
  environment    = "dev"
  db_password    = var.db_password
  backend_image  = var.backend_image
  frontend_image = var.frontend_image
}
