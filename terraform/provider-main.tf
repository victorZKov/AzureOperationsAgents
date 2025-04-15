###########################
## Azure Provider - Main ##
###########################

# Define Terraform provider
terraform {

  backend "azurerm" {

  }

  required_version = ">= 1.3"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.14.0"
    }

    random = {
      source = "hashicorp/random"
    }

    azuread = {
      source  = "hashicorp/azuread"
      version = "2.47"
    }
  }
}

# Configure the Azure provider
provider "azurerm" {
  environment     = "public"
  subscription_id = var.conn-subs

  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

# Configure the Azure AD provider
provider "azuread" {
}

# Configure the Management and Connectivity Azure providers
provider "azurerm" {
  alias = "mgmt"

  subscription_id = var.mgmt-subs
  tenant_id       = var.tenant-id
  environment     = "public"
  features {}
}

provider "azurerm" {
  alias = "conn"

  subscription_id = var.conn-subs
  tenant_id       = var.tenant-id
  environment     = "public"
  features {}
}