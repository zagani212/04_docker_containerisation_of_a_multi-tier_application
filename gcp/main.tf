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


resource "google_service_account" "vm_sa" {
  account_id   = "my-vm-service-account"
  display_name = "Custom SA for VM Instance"
}

resource "google_project_iam_member" "storage_access" {
  project = "project-55dcf55b-027c-4122-a45"
  role    = "roles/registry.writer"
  member  = "serviceAccount:${google_service_account.vm_sa.email}"
}

resource "google_compute_instance" "app_server" {
  name         = "app-server"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  service_account {
    email  = google_service_account.vm_sa.email
    scopes = ["cloud-platform"]
  }
}
