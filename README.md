# Azure Operations Agents

(English, keep scrolling)

## Descripción
Azure Operations Agents es una solución que proporciona dos agentes especializados para automatizar y monitorear operaciones en Azure:

1. **Agent0ScriptingAPI**: Genera scripts de automatización para recursos de Azure y Azure DevOps
2. **Agent1MonitoringFunction**: Monitorea recursos de Azure y envía notificaciones a través de Azure Service Bus

## Arquitectura
La solución está implementada siguiendo los principios de Clean Architecture y consta de las siguientes capas:

- **Core**: Contiene las entidades y interfaces base
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

## Requisitos
- .NET 9.0
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
Azure Operations Agents is a solution that provides two specialized agents for automating and monitoring Azure operations:

1. **Agent0ScriptingAPI**: Generates automation scripts for Azure and Azure DevOps resources
2. **Agent1MonitoringFunction**: Monitors Azure resources and sends notifications via Azure Service Bus

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

## Requirements
- .NET 9.0
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

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. 