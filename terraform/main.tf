###############################
# Azure Functions Resources #
###############################

# Resource group for Azure Functions
resource "azurerm_resource_group" "functions_rg" {
  name     = "${var.app_name_short}-functions-rg"
  location = var.location
}

# Storage account for Azure Functions
resource "azurerm_storage_account" "functions_storage" {
  name                     = "${var.app_name_short}funcstorage"
  resource_group_name      = azurerm_resource_group.functions_rg.name
  location                 = azurerm_resource_group.functions_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Service Bus namespace
resource "azurerm_servicebus_namespace" "functions_servicebus" {
  name                     = "${var.app_name_short}-servicebus"
  location                 = azurerm_resource_group.functions_rg.location
  resource_group_name      = azurerm_resource_group.functions_rg.name
  sku                      = "Standard"
}

# Service Bus Topics, Queues, and Subscriptions for Functions

# Topic for OrchestrationFunction
resource "azurerm_servicebus_topic" "incidents_topic" {
  name                = "incidents"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Queue for ScriptExecutionFunction Trigger
resource "azurerm_servicebus_queue" "scripts_to_execute_queue" {
  name                = "scripts-to-execute"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Queue for NotificationFunction Trigger
resource "azurerm_servicebus_queue" "notifications_queue" {
  name                = "notifications"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Queue for EventClassificationFunction Trigger
resource "azurerm_servicebus_queue" "events_to_classify_queue" {
  name                = "events-to-classify"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Topic and Subscription for AuditEventLogger
resource "azurerm_servicebus_topic" "event_log_topic" {
  name                = "event-log"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

resource "azurerm_servicebus_subscription" "audit_sub" {
  name                = "audit-sub"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
  topic_name          = azurerm_servicebus_topic.event_log_topic.name
}

# Queue for ScriptExecutionFunction Output
resource "azurerm_servicebus_queue" "script_execution_results_queue" {
  name                = "script-execution-results"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Queue for EventClassificationFunction Output
resource "azurerm_servicebus_queue" "classified_events_queue" {
  name                = "classified-events"
  resource_group_name = azurerm_resource_group.functions_rg.name
  namespace_name      = azurerm_servicebus_namespace.functions_servicebus.name
}

# Azure Functions for each agent
resource "azurerm_function_app" "agent0_scripting" {
  name                       = "${var.app_name_short}-agent0-scripting"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.functions_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
}

resource "azurerm_function_app" "agent1_monitoring" {
  name                       = "${var.app_name_short}-agent1-monitoring"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent1_monitoring_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent1_monitoring_plan]
}

resource "azurerm_function_app" "agent2_event_classifier" {
  name                       = "${var.app_name_short}-agent2-event-classifier"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent2_event_classifier_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent2_event_classifier_plan]
}

resource "azurerm_function_app" "agent3_runner" {
  name                       = "${var.app_name_short}-agent3-runner"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent3_runner_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent3_runner_plan]
}

resource "azurerm_function_app" "agent4_auditing" {
  name                       = "${var.app_name_short}-agent4-auditing"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent4_auditing_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent4_auditing_plan]
}

resource "azurerm_function_app" "agent5_notifyer" {
  name                       = "${var.app_name_short}-agent5-notifyer"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent5_notifyer_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent5_notifyer_plan]
}

resource "azurerm_function_app" "agent6_decision" {
  name                       = "${var.app_name_short}-agent6-decision"
  location                   = azurerm_resource_group.functions_rg.location
  resource_group_name        = azurerm_resource_group.functions_rg.name
  storage_account_name       = azurerm_storage_account.functions_storage.name
  storage_account_access_key = azurerm_storage_account.functions_storage.primary_access_key
  app_service_plan_id        = azurerm_app_service_plan.agent6_decision_plan.id
  os_type                    = "Linux"
  runtime_stack              = "dotnet"
  depends_on                 = [azurerm_app_service_plan.agent6_decision_plan]
}

# App Service Plan for Azure Functions
resource "azurerm_app_service_plan" "functions_plan" {
  name                = "${var.app_name_short}-functions-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

# App Service Plans for each Azure Function
resource "azurerm_app_service_plan" "agent1_monitoring_plan" {
  name                = "${var.app_name_short}-agent1-monitoring-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_app_service_plan" "agent2_event_classifier_plan" {
  name                = "${var.app_name_short}-agent2-event-classifier-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_app_service_plan" "agent3_runner_plan" {
  name                = "${var.app_name_short}-agent3-runner-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_app_service_plan" "agent4_auditing_plan" {
  name                = "${var.app_name_short}-agent4-auditing-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_app_service_plan" "agent5_notifyer_plan" {
  name                = "${var.app_name_short}-agent5-notifyer-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_app_service_plan" "agent6_decision_plan" {
  name                = "${var.app_name_short}-agent6-decision-plan"
  location            = azurerm_resource_group.functions_rg.location
  resource_group_name = azurerm_resource_group.functions_rg.name
  kind                = "FunctionApp"
  reserved            = true
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}