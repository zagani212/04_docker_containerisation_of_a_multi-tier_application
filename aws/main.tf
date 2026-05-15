terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-west-3"
}

terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket-775698064297-eu-west-3"
    key    = "project4/terraform.tfstate"
    region = "eu-west-3"
    use_lockfile = true
  }
}


resource "aws_ecr_repository" "example" {
  name                 = "my-repository"
  image_tag_mutability = "IMMUTABLE_WITH_EXCLUSION"

  image_tag_mutability_exclusion_filter {
    filter      = "latest*"
    filter_type = "WILDCARD"
  }
}