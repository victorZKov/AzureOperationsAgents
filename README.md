# Azure Operations Agents

(English, keep scrolling)

## Descripción
Azure Operations Agents es una solución que proporciona cuatro agentes especializados para automatizar, monitorear, clasificar y ejecutar operaciones en Azure:

1. **Agent0ScriptingAPI**: Genera scripts de automatización para recursos de Azure y Azure DevOps
2. **Agent1MonitoringFunction**: Monitorea recursos de Azure y envía notificaciones a través de Azure Service Bus
3. **Agent2EventClassifier**: Clasifica eventos de Azure usando inteligencia artificial
4. **Agent3Runner**: Ejecuta scripts generados y devuelve los resultados
5. **Agent4Auditing**: Registra eventos de auditoría
6. **Agent5Notifier**: Envía notificaciones
7. **Agent6Decision**: Orquesta decisiones
8. **Agent7Learning**: Aprende de eventos pasados

## Arquitectura
La solución está implementada siguiendo los principios de Clean Architecture y consta de las siguientes capas:

- **Core**: Contiene las entidades e interfaces base
- **Application**: Implementa la lógica de negocio
- **Infrastructure**: Proporciona implementaciones concretas para acceso a datos y servicios externos
- **Agents**: Contiene los agentes específicos que exponen la funcionalidad

## Agentes

### Agent0ScriptingAPI
API REST que genera scripts de automatización para:
- Recursos de Azure
- Azure DevOps
- Pipelines
- Repositorios
- Work Items

#### Características
- Generación de scripts usando OpenAI
- Almacenamiento en Azure Table Storage
- Autenticación con Azure AD
- Documentación con Swagger

### Agent1MonitoringFunction
Función de Azure que monitorea:
- Recursos de Azure
- Log Analytics
- Métricas y logs

#### Características
- Consultas a Log Analytics
- Notificaciones a través de Azure Service Bus
- Programación de monitoreo con Timer Trigger
- Procesamiento de eventos con Service Bus Trigger

### Agent2EventClassifier
Función de Azure que clasifica eventos usando IA:
- Clasificación de eventos de Azure
- Análisis de severidad y categoría
- Sugerencias de acciones
- Integración con Azure OpenAI

#### Características
- Procesamiento de eventos en tiempo real
- Clasificación inteligente usando OpenAI
- Envío de resultados a Service Bus
- Análisis de confianza y razonamiento

### Agent3Runner
Función de Azure que ejecuta scripts:
- Ejecución de scripts generados
- Seguimiento de estado y resultados
- Almacenamiento de resultados
- Notificaciones de finalización

#### Características
- Ejecución asíncrona de scripts
- Almacenamiento en Azure Table Storage
- Notificaciones a través de Service Bus
- Seguimiento de estado y duración

### Agent4Auditing
Función de Azure que registra eventos de auditoría:
- Registra eventos para propósitos de auditoría
- Se integra con SignalR para actualizaciones en tiempo real

#### Características
- Registro de auditoría en tiempo real
- Integración con SignalR
- Almacenamiento en Azure Table Storage

### Agent5Notifier
Función de Azure que envía notificaciones:
- Procesa solicitudes de notificación
- Envía notificaciones por correo electrónico, SMS o notificaciones push

#### Características
- Notificaciones multicanal
- Integración con Azure Notification Hubs
- Plantillas de notificación personalizables

### Agent6Decision
Función de Azure que orquesta decisiones:
- Procesa flujos de trabajo de toma de decisiones
- Se integra con otros agentes para datos y acciones

#### Características
- Orquestación de flujos de trabajo
- Integración con otros agentes
- Registro y seguimiento de decisiones

### Agent7Learning
Función de Azure que aprende de eventos pasados:
- Registra experiencias de mensajes de Service Bus
- Proporciona recomendaciones basadas en experiencias registradas

#### Características
- Registro de experiencias en Cosmos DB
- Generación de recomendaciones
- Integración con Azure OpenAI

## Requisitos
- .NET 8.0
- Azure Subscription
- Azure OpenAI Service
- Azure Storage Account
- Azure Service Bus
- Azure Log Analytics Workspace
- Azure Cosmos DB (for Agent7Learning)

## Configuración
1. Clonar el repositorio
2. Configurar las variables de entorno:
   ```
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_KEY=your_key
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_SERVICE_BUS_CONNECTION_STRING=your_connection_string
   AZURE_TENANT_ID=your_tenant_id
   AZURE_CLIENT_ID=your_client_id
   AZURE_CLIENT_SECRET=your_client_secret
   ```

## Configuración de Variables de Entorno por Agente

### Agent0ScriptingAPI
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.

### Agent1MonitoringFunction
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnectionString`: Cadena de conexión para Azure Service Bus.
- `ServiceBusQueueName`: Nombre de la cola de Service Bus.

### Agent2EventClassifier
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnection`: Cadena de conexión para Azure Service Bus (entrada y salida).

### Agent3Runner
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnection`: Cadena de conexión para Azure Service Bus (entrada y salida).

### Agent4Auditing
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnection`: Cadena de conexión para Azure Service Bus (suscripción de auditoría).

### Agent5Notifier
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnection`: Cadena de conexión para Azure Service Bus (cola de notificaciones).

### Agent6Decision
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `ServiceBusConnection`: Cadena de conexión para Azure Service Bus (cola de incidentes).

### Agent7Learning
- `OpenAI:Endpoint`: URL del servicio OpenAI.
- `OpenAI:ApiKey`: Clave API para el servicio OpenAI.
- `Azure:StorageConnectionString`: Cadena de conexión para Azure Storage.
- `CosmosDB:AccountEndpoint`: URL del endpoint de Cosmos DB.
- `CosmosDB:AccountKey`: Clave de acceso para Cosmos DB.
- `CosmosDB:DatabaseName`: Nombre de la base de datos en Cosmos DB.

---

## Environment Variables Configuration by Agent

### Agent0ScriptingAPI
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.

### Agent1MonitoringFunction
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnectionString`: Connection string for Azure Service Bus.
- `ServiceBusQueueName`: Name of the Service Bus queue.

### Agent2EventClassifier
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (input and output).

### Agent3Runner
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (input and output).

### Agent4Auditing
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (audit subscription).

### Agent5Notifier
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (notifications queue).

### Agent6Decision
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (incidents queue).

### Agent7Learning
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `CosmosDB:AccountEndpoint`: URL for the Cosmos DB endpoint.
- `CosmosDB:AccountKey`: Access key for Cosmos DB.
- `CosmosDB:DatabaseName`: Name of the database in Cosmos DB.

## Deployment

### Step 1: Deploy Infrastructure
The infrastructure required for the agents can be provisioned using Terraform. Follow these steps:

1. Navigate to the `terraform/` directory:
   ```bash
   cd terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Review the execution plan:
   ```bash
   terraform plan
   ```

4. Apply the Terraform scripts to provision resources:
   ```bash
   terraform apply
   ```

5. (Optional) Destroy resources when no longer needed:
   ```bash
   terraform destroy
   ```

Ensure that your Azure credentials and environment variables are configured before running the scripts.

### Step 2: Build and Deploy Agents
The agents can be deployed using the provided YAML pipelines. Follow these steps:

1. Import the YAML pipeline files into your Azure DevOps project. The pipeline files are located in the `terraform/` directory and are named as follows:
   - `pipeline-agent0.yml`: Deploys Agent0ScriptingAPI.
   - `pipeline-agent1.yml`: Deploys Agent1MonitoringFunction.
   - `pipeline-agent2.yml`: Deploys Agent2EventClassifier.
   - `pipeline-agent3.yml`: Deploys Agent3Runner.
   - `pipeline-agent4.yml`: Deploys Agent4Auditing.
   - `pipeline-agent5.yml`: Deploys Agent5Notifier.
   - `pipeline-agent6.yml`: Deploys Agent6Decision.
   - `pipeline-infrastructure.yml`: Deploys shared infrastructure components.

2. Configure pipeline variables as needed for your environment.

3. Run the pipelines to build, test, and deploy the respective agents or infrastructure.

Each pipeline automates the deployment process, ensuring consistency and efficiency.

## Uso
### Agent0ScriptingAPI
```bash
# Generar script para un recurso de Azure
POST /api/scripts/generate
{
    "resourceType": "Azure",
    "resourceId": "subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Compute/virtualMachines/{vm-name}",
    "operation": "start"
}

# Generar script para Azure DevOps
POST /api/scripts/generate
{
    "resourceType": "AzureDevOps",
    "organization": "your-org",
    "project": "your-project",
    "operation": "create-pipeline"
}
```

### Agent1MonitoringFunction
La función se ejecuta automáticamente según la programación configurada y envía notificaciones a través de Service Bus cuando se detectan eventos importantes.

### Agent2EventClassifier
La función procesa eventos del topic "events-to-classify" y envía las clasificaciones al topic "classified-events":

```json
// Evento de entrada
{
    "eventId": "event-123",
    "source": "Azure Monitor",
    "timestamp": "2024-03-20T10:00:00Z",
    "eventData": {
        "resourceId": "/subscriptions/...",
        "operationName": "Microsoft.Compute/virtualMachines/start",
        "status": "Succeeded"
    }
}

// Clasificación de salida
{
    "id": "classification-456",
    "eventId": "event-123",
    "category": "Operaciones",
    "severity": "Low",
    "confidence": 0.95,
    "classificationReason": "Operación de inicio de VM completada exitosamente",
    "suggestedActions": [
        "Verificar métricas de rendimiento",
        "Monitorear logs de sistema"
    ]
}
```

### Agent3Runner
La función procesa solicitudes de ejecución del topic "scripts-to-execute" y envía los resultados al topic "script-execution-results":

```json
// Solicitud de ejecución
{
    "scriptId": "script-123",
    "parameters": {
        "resourceGroup": "my-rg",
        "vmName": "my-vm"
    }
}

// Resultado de la ejecución
{
    "id": "execution-456",
    "scriptId": "script-123",
    "executionTime": "2024-03-20T10:00:00Z",
    "status": "Completed",
    "output": "Script ejecutado exitosamente",
    "duration": "00:00:05",
    "parameters": {
        "resourceGroup": "my-rg",
        "vmName": "my-vm"
    }
}
```

### Agent4Auditing
La función registra eventos de auditoría en tiempo real y se integra con SignalR para actualizaciones en vivo.

### Agent5Notifier
La función procesa solicitudes de notificación y envía notificaciones por correo electrónico, SMS o notificaciones push.

### Agent6Decision
La función orquesta flujos de trabajo de toma de decisiones e integra datos y acciones de otros agentes.

### Agent7Learning
La función registra experiencias de mensajes de Service Bus y proporciona recomendaciones basadas en experiencias registradas.

## Documentación de Terraform

El proyecto incluye scripts de Terraform para aprovisionar los recursos de Azure necesarios para los agentes. Estos scripts se encuentran en el directorio `terraform/` y están organizados de la siguiente manera:

- **main.tf**: Define los recursos principales de infraestructura.
- **variables.tf**: Contiene las definiciones de variables para los scripts de Terraform.
- **provider-main.tf**: Configura el proveedor de Azure.
- **provider-variables.tf**: Define las variables específicas del proveedor.
- **locals.tf**: Contiene valores locales utilizados en los scripts.
- **configuration/**: Contiene archivos de configuración adicionales para recursos específicos.

### Explicación de los Archivos de Terraform

El directorio `terraform/` contiene los siguientes archivos y directorios, cada uno con un propósito específico para aprovisionar y gestionar los recursos de Azure:

- **main.tf**: Este es el archivo principal de configuración de Terraform que define los recursos principales de infraestructura, como cuentas de almacenamiento de Azure, Service Bus y otros componentes necesarios.

- **variables.tf**: Contiene todas las definiciones de variables utilizadas en los scripts de Terraform. Estas variables permiten la personalización y reutilización de la configuración de Terraform.

- **provider-main.tf**: Configura el proveedor de Azure, necesario para interactuar con los recursos de Azure. Incluye configuraciones como el ID de suscripción y el ID de inquilino.

- **provider-variables.tf**: Define las variables específicas del proveedor, como los detalles de suscripción e inquilino de Azure, que se utilizan en el archivo `provider-main.tf`.

- **locals.tf**: Contiene valores locales que se utilizan para simplificar y centralizar expresiones o valores repetidos en la configuración de Terraform.

- **configuration/**: Este directorio contiene archivos de configuración adicionales para recursos específicos, como configuraciones de red, configuraciones de almacenamiento u otros componentes modulares.

- **pipeline-agent0.yml**: YAML pipeline for deploying Agent0ScriptingAPI.

- **pipeline-agent1.yml**: YAML pipeline for deploying Agent1MonitoringFunction.

- **pipeline-agent2.yml**: YAML pipeline for deploying Agent2EventClassifier.

- **pipeline-agent3.yml**: YAML pipeline for deploying Agent3Runner.

- **pipeline-agent4.yml**: YAML pipeline for deploying Agent4Auditing.

- **pipeline-agent5.yml**: YAML pipeline for deploying Agent5Notifier.

- **pipeline-agent6.yml**: YAML pipeline for deploying Agent6Decision.

- **pipeline-infrastructure.yml**: YAML pipeline for deploying shared infrastructure components.

Cada archivo está diseñado para trabajar en conjunto y asegurar un despliegue eficiente y sin problemas de los Azure Operations Agents y su infraestructura de soporte.

### Pasos para Usar Terraform

1. Navegar al directorio `terraform/`:
   ```bash
   cd terraform
   ```

2. Inicializar Terraform:
   ```bash
   terraform init
   ```

3. Revisar el plan de ejecución:
   ```bash
   terraform plan
   ```

4. Aplicar los scripts de Terraform para aprovisionar recursos:
   ```bash
   terraform apply
   ```

5. Destruir los recursos cuando ya no sean necesarios:
   ```bash
   terraform destroy
   ```

Asegúrate de haber configurado tus credenciales de Azure y las variables de entorno antes de ejecutar los scripts.

## Pipelines Documentation

The project includes YAML pipeline definitions for automating the deployment and management of agents. These pipelines are located in the `terraform/` directory and are named as follows:

- **pipeline-agent0.yml**: Pipeline for deploying Agent0ScriptingAPI.
- **pipeline-agent1.yml**: Pipeline for deploying Agent1MonitoringFunction.
- **pipeline-agent2.yml**: Pipeline for deploying Agent2EventClassifier.
- **pipeline-agent3.yml**: Pipeline for deploying Agent3Runner.
- **pipeline-agent4.yml**: Pipeline for deploying Agent4Auditing.
- **pipeline-agent5.yml**: Pipeline for deploying Agent5Notifier.
- **pipeline-agent6.yml**: Pipeline for deploying Agent6Decision.
- **pipeline-infrastructure.yml**: Pipeline for deploying shared infrastructure.

### Steps to Use Pipelines

1. Ensure that your Azure DevOps organization is set up and connected to your Azure subscription.
2. Import the YAML pipeline files into your Azure DevOps project.
3. Configure pipeline variables as needed for your environment.
4. Run the pipelines to deploy the respective agents or infrastructure.

Each pipeline is designed to automate the build, test, and deployment processes for its corresponding agent or infrastructure component.

## Contribución
1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está licenciado bajo la Licencia MIT.

---

# Azure Operations Agents

## Description
Azure Operations Agents is a solution that provides four specialized agents for automating, monitoring, classifying, and executing Azure operations:

1. **Agent0ScriptingAPI**: Generates automation scripts for Azure and Azure DevOps resources
2. **Agent1MonitoringFunction**: Monitors Azure resources and sends notifications via Azure Service Bus
3. **Agent2EventClassifier**: Classifies Azure events using artificial intelligence
4. **Agent3Runner**: Executes generated scripts and returns results
5. **Agent4Auditing**: Logs audit events
6. **Agent5Notifier**: Sends notifications
7. **Agent6Decision**: Orchestrates decisions
8. **Agent7Learning**: Learns from past events

## Architecture
The solution is implemented following Clean Architecture principles and consists of the following layers:

- **Core**: Contains base entities and interfaces
- **Application**: Implements business logic
- **Infrastructure**: Provides concrete implementations for data access and external services
- **Agents**: Contains specific agents that expose functionality

## Agents

### Agent0ScriptingAPI
REST API that generates automation scripts for:
- Azure Resources
- Azure DevOps
- Pipelines
- Repositories
- Work Items

#### Features
- Script generation using OpenAI
- Storage in Azure Table Storage
- Authentication with Azure AD
- Documentation with Swagger

### Agent1MonitoringFunction
Azure Function that monitors:
- Azure Resources
- Log Analytics
- Metrics and logs

#### Features
- Log Analytics queries
- Notifications via Azure Service Bus
- Monitoring scheduling with Timer Trigger
- Event processing with Service Bus Trigger

### Agent2EventClassifier
Azure Function that classifies events using AI:
- Azure event classification
- Severity and category analysis
- Action suggestions
- Azure OpenAI integration

#### Features
- Real-time event processing
- Intelligent classification using OpenAI
- Results sent to Service Bus
- Confidence and reasoning analysis

### Agent3Runner
Azure Function that executes scripts:
- Execution of generated scripts
- Status and result tracking
- Result storage
- Completion notifications

#### Features
- Asynchronous script execution
- Storage in Azure Table Storage
- Notifications via Service Bus
- Status and duration tracking

### Agent4Auditing
Azure Function that logs audit events:
- Logs events for auditing purposes
- Integrates with SignalR for real-time updates

#### Features
- Real-time audit logging
- Integration with SignalR
- Storage in Azure Table Storage

### Agent5Notifier
Azure Function that sends notifications:
- Processes notification requests
- Sends notifications via email, SMS, or push notifications

#### Features
- Multi-channel notifications
- Integration with Azure Notification Hubs
- Customizable notification templates

### Agent6Decision
Azure Function that orchestrates decisions:
- Processes decision-making workflows
- Integrates with other agents for data and actions

#### Features
- Workflow orchestration
- Integration with other agents
- Decision logging and tracking

### Agent7Learning
Azure Function that learns from past events:
- Logs experiences from Service Bus messages
- Provides recommendations based on logged experiences

#### Features
- Experience logging in Cosmos DB
- Recommendation generation
- Integration with Azure OpenAI

## Requirements
- .NET 8.0
- Azure Subscription
- Azure OpenAI Service
- Azure Storage Account
- Azure Service Bus
- Azure Log Analytics Workspace
- Azure Cosmos DB (for Agent7Learning)

## Setup
1. Clone the repository
2. Configure environment variables:
   ```
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_KEY=your_key
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_SERVICE_BUS_CONNECTION_STRING=your_connection_string
   AZURE_TENANT_ID=your_tenant_id
   AZURE_CLIENT_ID=your_client_id
   AZURE_CLIENT_SECRET=your_client_secret
   ```

## Environment Variables Configuration by Agent

### Agent0ScriptingAPI
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.

### Agent1MonitoringFunction
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnectionString`: Connection string for Azure Service Bus.
- `ServiceBusQueueName`: Name of the Service Bus queue.

### Agent2EventClassifier
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (input and output).

### Agent3Runner
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (input and output).

### Agent4Auditing
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (audit subscription).

### Agent5Notifier
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (notifications queue).

### Agent6Decision
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `ServiceBusConnection`: Connection string for Azure Service Bus (incidents queue).

### Agent7Learning
- `OpenAI:Endpoint`: URL for the OpenAI service.
- `OpenAI:ApiKey`: API key for the OpenAI service.
- `Azure:StorageConnectionString`: Connection string for Azure Storage.
- `CosmosDB:AccountEndpoint`: URL for the Cosmos DB endpoint.
- `CosmosDB:AccountKey`: Access key for Cosmos DB.
- `CosmosDB:DatabaseName`: Name of the database in Cosmos DB.

## Deployment

### Step 1: Deploy Infrastructure
The infrastructure required for the agents can be provisioned using Terraform. Follow these steps:

1. Navigate to the `terraform/` directory:
   ```bash
   cd terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Review the execution plan:
   ```bash
   terraform plan
   ```

4. Apply the Terraform scripts to provision resources:
   ```bash
   terraform apply
   ```

5. (Optional) Destroy resources when no longer needed:
   ```bash
   terraform destroy
   ```

Ensure that your Azure credentials and environment variables are configured before running the scripts.

### Step 2: Build and Deploy Agents
The agents can be deployed using the provided YAML pipelines. Follow these steps:

1. Import the YAML pipeline files into your Azure DevOps project. The pipeline files are located in the `terraform/` directory and are named as follows:
   - `pipeline-agent0.yml`: Deploys Agent0ScriptingAPI.
   - `pipeline-agent1.yml`: Deploys Agent1MonitoringFunction.
   - `pipeline-agent2.yml`: Deploys Agent2EventClassifier.
   - `pipeline-agent3.yml`: Deploys Agent3Runner.
   - `pipeline-agent4.yml`: Deploys Agent4Auditing.
   - `pipeline-agent5.yml`: Deploys Agent5Notifier.
   - `pipeline-agent6.yml`: Deploys Agent6Decision.
   - `pipeline-infrastructure.yml`: Deploys shared infrastructure components.

2. Configure pipeline variables as needed for your environment.

3. Run the pipelines to build, test, and deploy the respective agents or infrastructure.

Each pipeline automates the deployment process, ensuring consistency and efficiency.

## Usage
### Agent0ScriptingAPI
```bash
# Generate script for an Azure resource
POST /api/scripts/generate
{
    "resourceType": "Azure",
    "resourceId": "subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.Compute/virtualMachines/{vm-name}",
    "operation": "start"
}

# Generate script for Azure DevOps
POST /api/scripts/generate
{
    "resourceType": "AzureDevOps",
    "organization": "your-org",
    "project": "your-project",
    "operation": "create-pipeline"
}
```

### Agent1MonitoringFunction
The function runs automatically according to the configured schedule and sends notifications through Service Bus when important events are detected.

### Agent2EventClassifier
The function processes events from the "events-to-classify" topic and sends classifications to the "classified-events" topic:

```json
// Input event
{
    "eventId": "event-123",
    "source": "Azure Monitor",
    "timestamp": "2024-03-20T10:00:00Z",
    "eventData": {
        "resourceId": "/subscriptions/...",
        "operationName": "Microsoft.Compute/virtualMachines/start",
        "status": "Succeeded"
    }
}

// Output classification
{
    "id": "classification-456",
    "eventId": "event-123",
    "category": "Operations",
    "severity": "Low",
    "confidence": 0.95,
    "classificationReason": "VM start operation completed successfully",
    "suggestedActions": [
        "Check performance metrics",
        "Monitor system logs"
    ]
}
```

### Agent3Runner
The function processes execution requests from the "scripts-to-execute" topic and sends results to the "script-execution-results" topic:

```json
// Execution request
{
    "scriptId": "script-123",
    "parameters": {
        "resourceGroup": "my-rg",
        "vmName": "my-vm"
    }
}

// Execution result
{
    "id": "execution-456",
    "scriptId": "script-123",
    "executionTime": "2024-03-20T10:00:00Z",
    "status": "Completed",
    "output": "Script executed successfully",
    "duration": "00:00:05",
    "parameters": {
        "resourceGroup": "my-rg",
        "vmName": "my-vm"
    }
}
```

### Agent4Auditing
The function logs audit events in real-time and integrates with SignalR for live updates.

### Agent5Notifier
The function processes notification requests and sends notifications via email, SMS, or push notifications.

### Agent6Decision
The function orchestrates decision-making workflows and integrates data and actions from other agents.

### Agent7Learning
The function logs experiences from Service Bus messages and provides recommendations based on logged experiences.

## Terraform Documentation

The project includes Terraform scripts for provisioning Azure resources required by the agents. These scripts are located in the `terraform/` directory and are organized as follows:

- **main.tf**: Defines the main infrastructure resources.
- **variables.tf**: Contains variable definitions for the Terraform scripts.
- **provider-main.tf**: Configures the Azure provider.
- **provider-variables.tf**: Defines provider-specific variables.
- **locals.tf**: Contains local values used across the scripts.
- **configuration/**: Contains additional configuration files for specific resources.

### Explanation of Terraform Files

The `terraform/` directory contains the following files and directories, each serving a specific purpose in provisioning and managing Azure resources:

- **main.tf**: This is the primary Terraform configuration file that defines the main infrastructure resources, such as Azure Storage Accounts, Service Bus, and other required components.

- **variables.tf**: Contains all the variable definitions used across the Terraform scripts. These variables allow for customization and reusability of the Terraform configuration.

- **provider-main.tf**: Configures the Azure provider, which is required to interact with Azure resources. It includes settings like subscription ID and tenant ID.

- **provider-variables.tf**: Defines provider-specific variables, such as Azure subscription and tenant details, to be used in the `provider-main.tf` file.

- **locals.tf**: Contains local values that are used to simplify and centralize repeated expressions or values across the Terraform configuration.

- **configuration/**: This directory contains additional configuration files for specific resources, such as network settings, storage configurations, or other modular components.

- **pipeline-agent0.yml**: YAML pipeline for deploying Agent0ScriptingAPI.

- **pipeline-agent1.yml**: YAML pipeline for deploying Agent1MonitoringFunction.

- **pipeline-agent2.yml**: YAML pipeline for deploying Agent2EventClassifier.

- **pipeline-agent3.yml**: YAML pipeline for deploying Agent3Runner.

- **pipeline-agent4.yml**: YAML pipeline for deploying Agent4Auditing.

- **pipeline-agent5.yml**: YAML pipeline for deploying Agent5Notifier.

- **pipeline-agent6.yml**: YAML pipeline for deploying Agent6Decision.

- **pipeline-infrastructure.yml**: YAML pipeline for deploying shared infrastructure components.

Each file is designed to work together to ensure a seamless and efficient deployment of the Azure Operations Agents and their supporting infrastructure.

### Steps to Use Terraform

1. Navigate to the `terraform/` directory:
   ```bash
   cd terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Review the execution plan:
   ```bash
   terraform plan
   ```

4. Apply the Terraform scripts to provision resources:
   ```bash
   terraform apply
   ```

5. Destroy resources when no longer needed:
   ```bash
   terraform destroy
   ```

Ensure that you have configured your Azure credentials and environment variables before running the scripts.

## Pipelines Documentation

The project includes YAML pipeline definitions for automating the deployment and management of agents. These pipelines are located in the `terraform/` directory and are named as follows:

- **pipeline-agent0.yml**: Pipeline for deploying Agent0ScriptingAPI.
- **pipeline-agent1.yml**: Pipeline for deploying Agent1MonitoringFunction.
- **pipeline-agent2.yml**: Pipeline for deploying Agent2EventClassifier.
- **pipeline-agent3.yml**: Pipeline for deploying Agent3Runner.
- **pipeline-agent4.yml**: Pipeline for deploying Agent4Auditing.
- **pipeline-agent5.yml**: Pipeline for deploying Agent5Notifier.
- **pipeline-agent6.yml**: Pipeline for deploying Agent6Decision.
- **pipeline-infrastructure.yml**: Pipeline for deploying shared infrastructure.

### Steps to Use Pipelines

1. Ensure that your Azure DevOps organization is set up and connected to your Azure subscription.
2. Import the YAML pipeline files into your Azure DevOps project.
3. Configure pipeline variables as needed for your environment.
4. Run the pipelines to deploy the respective agents or infrastructure.

Each pipeline is designed to automate the build, test, and deployment processes for its corresponding agent or infrastructure component.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.