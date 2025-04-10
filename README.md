# Azure Operations Agents

(English, keep scrolling)

## Descripción
Azure Operations Agents es una solución que proporciona cuatro agentes especializados para automatizar, monitorear, clasificar y ejecutar operaciones en Azure:

1. **Agent0ScriptingAPI**: Genera scripts de automatización para recursos de Azure y Azure DevOps
2. **Agent1MonitoringFunction**: Monitorea recursos de Azure y envía notificaciones a través de Azure Service Bus
3. **Agent2EventClassifier**: Clasifica eventos de Azure usando inteligencia artificial
4. **Agent3Runner**: Ejecuta scripts generados y devuelve los resultados

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

## Requisitos
- .NET 8.0
- Azure Subscription
- Azure OpenAI Service
- Azure Storage Account
- Azure Service Bus
- Azure Log Analytics Workspace

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

## Despliegue
1. Desplegar Agent0ScriptingAPI:
   ```bash
   cd AzureOperationsAgents.Agent0ScriptingAPI
   dotnet publish -c Release
   ```

2. Desplegar Agent1MonitoringFunction:
   ```bash
   cd AzureOperationsAgents.Agent1MonitoringFunction
   dotnet publish -c Release
   ```

3. Desplegar Agent2EventClassifier:
   ```bash
   cd AzureOperationsAgents.Agent2EventClassifier
   dotnet publish -c Release
   ```

4. Desplegar Agent3Runner:
   ```bash
   cd AzureOperationsAgents.Agent3Runner
   dotnet publish -c Release
   ```

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

## Requirements
- .NET 8.0
- Azure Subscription
- Azure OpenAI Service
- Azure Storage Account
- Azure Service Bus
- Azure Log Analytics Workspace

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

## Deployment
1. Deploy Agent0ScriptingAPI:
   ```bash
   cd AzureOperationsAgents.Agent0ScriptingAPI
   dotnet publish -c Release
   ```

2. Deploy Agent1MonitoringFunction:
   ```bash
   cd AzureOperationsAgents.Agent1MonitoringFunction
   dotnet publish -c Release
   ```

3. Deploy Agent2EventClassifier:
   ```bash
   cd AzureOperationsAgents.Agent2EventClassifier
   dotnet publish -c Release
   ```

4. Deploy Agent3Runner:
   ```bash
   cd AzureOperationsAgents.Agent3Runner
   dotnet publish -c Release
   ```

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

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. 