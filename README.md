# Azure Scripting API

API inteligente para la generación de scripts de automatización para Azure y Azure DevOps.

## 🚀 Características

- Generación de scripts para Azure CLI y Azure DevOps CLI
- Soporte para PowerShell y Bash
- Validación automática de scripts
- Refinamiento de scripts basado en feedback
- Almacenamiento y recuperación de scripts similares
- Autenticación segura con Azure AD
- Integración con Azure OpenAI Service

## 🛠️ Tecnologías

- .NET 9 (Isolated Process Model)
- Azure PostgreSQL Flexible Server
- Azure OpenAI Service
- Azure Active Directory
- Clean Architecture

## 📋 Requisitos Previos

- .NET 9 SDK
- Azure Subscription
- Azure AD Tenant
- Azure PostgreSQL Flexible Server
- Azure OpenAI Service

## ⚙️ Configuración

1. Clona el repositorio
2. Actualiza las configuraciones en `appsettings.json`:
   - Cadena de conexión de PostgreSQL
   - Configuración de Azure AD
   - Endpoint y API Key de Azure OpenAI

3. Ejecuta las migraciones de la base de datos:
```bash
dotnet ef database update
```

4. Ejecuta la aplicación:
```bash
dotnet run --project AzureScriptingAPI.API
```

## 🔒 Autenticación

La API utiliza Azure AD para la autenticación. Los clientes necesitan:
1. Registrar una aplicación en Azure AD
2. Obtener credenciales de cliente (Client ID y Client Secret)
3. Usar el flujo de OAuth2 Client Credentials para obtener tokens

## 📝 Uso de la API

### Generar un Script
```http
POST /api/scripts
Content-Type: application/json
Authorization: Bearer {token}

{
    "prompt": "Crear un grupo de recursos en Azure",
    "preferredType": "PowerShell"
}
```

### Validar un Script
```http
POST /api/scripts/{id}/validate
Authorization: Bearer {token}
```

### Refinar un Script
```http
POST /api/scripts/{id}/refine
Content-Type: application/json
Authorization: Bearer {token}

{
    "feedback": "Agregar manejo de errores"
}
```

## 📚 Estructura del Proyecto

- **AzureScriptingAPI.Core**: Modelos de dominio e interfaces
- **AzureScriptingAPI.Infrastructure**: Acceso a datos y servicios externos
- **AzureScriptingAPI.Application**: Lógica de negocio
- **AzureScriptingAPI.API**: API REST
- **AzureScriptingAPI.Tests**: Pruebas unitarias e integración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 