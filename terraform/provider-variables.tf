################################
## Azure Provider - Variables ##
################################

# Azure authentication variables


variable "deploy-subs" {
  type        = string
  description = "Azure Subscription ID for Subscription"
}

variable "tenant-id" {
  type        = string
  description = "Azure Tenant ID"
}

variable "mgmt-subs" {
  type        = string
  description = "Azure Subscription ID for Management Subscription"
}

