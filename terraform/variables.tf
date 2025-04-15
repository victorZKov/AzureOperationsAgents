#######################
## Azure - Variables ##
#######################

data "azuread_client_config" "currentad" {}

data "azurerm_client_config" "currentrm" {}

#############################
## Application - Variables ##
#############################

# company name 
variable "company" {
  type        = string
  description = "This variable defines thecompany name used to build resources"
}

# application name 
variable "app_name" {
  type        = string
  description = "This variable defines the application name used to build resources"
}

# application name short
variable "app_name_short" {
  type        = string
  description = "This variable defines the application name used to build resources"
}
# application or company environment
variable "environment" {
  type        = string
  description = "This variable defines the environment to be built"
}

# azure region
variable "location" {
  type        = string
  description = "Azure region where the resource group will be created"
  default     = "north europe"
}


################################
# Insights
################################
variable "fd_diag_logs" {
  type = list(string)
  default = [
    "FrontdoorAccessLog",
    "FrontdoorMetrics"
  ]
}

variable "retention_in_days" {
  type = number
}
