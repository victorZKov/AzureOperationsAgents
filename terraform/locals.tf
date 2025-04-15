############
## Locals ##
############

locals {
  // name for all resources
  app_name = lower(replace(var.app_name_short, " ", "-"))

  
}
