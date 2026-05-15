provider "google" {
  project     = "project-55dcf55b-027c-4122-a45"
  region      = "us-central1"
}

terraform {
  backend "gcs" {
    bucket = "terraform_state_bucket_abdelhak"
    prefix = "terraform/state"
  }
}

resource "google_artifact_registry_repository" "my-repo" {
  location      = "us-central1"
  repository_id = "my-repository"
  description   = "docker repository"
  format        = "DOCKER"

  docker_config {
    immutable_tags = true
  }
}