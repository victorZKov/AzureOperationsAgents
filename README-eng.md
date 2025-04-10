
# Azure Scripting API

Intelligent API for generating automation scripts for Azure and Azure DevOps.

## 🚀 Features

- Script generation for Azure CLI and Azure DevOps CLI  
- Support for PowerShell and Bash  
- Automatic script validation  
- Script refinement based on feedback  
- Storage and retrieval of similar scripts  
- Secure authentication with Azure AD  
- Integration with Azure OpenAI Service  

## 🛠️ Technologies

- .NET 9 (Isolated Process Model)  
- Azure PostgreSQL Flexible Server  
- Azure OpenAI Service  
- Azure Active Directory  
- Clean Architecture  

## 📋 Prerequisites

- .NET 9 SDK  
- Azure Subscription  
- Azure AD Tenant  
- Azure PostgreSQL Flexible Server  
- Azure OpenAI Service  

## ⚙️ Setup

1. Clone the repository  
2. Update the configuration in `appsettings.json`:
   - PostgreSQL connection string  
   - Azure AD configuration  
   - Azure OpenAI endpoint and API key  

3. Run the database migrations:
```bash
dotnet ef database update
```

4. Run the application:
```bash
dotnet run --project AzureScriptingAPI.API
```

## 🔒 Authentication

The API uses Azure AD for authentication. Clients need to:
1. Register an application in Azure AD  
2. Obtain client credentials (Client ID and Client Secret)  
3. Use the OAuth2 Client Credentials flow to acquire tokens  

## 📝 API Usage

### Generate a Script
```http
POST /api/scripts
Content-Type: application/json
Authorization: Bearer {token}

{
    "prompt": "Create a resource group in Azure",
    "preferredType": "PowerShell"
}
```

### Validate a Script
```http
POST /api/scripts/{id}/validate
Authorization: Bearer {token}
```

### Refine a Script
```http
POST /api/scripts/{id}/refine
Content-Type: application/json
Authorization: Bearer {token}

{
    "feedback": "Add error handling"
}
```

## 📚 Project Structure

- **AzureScriptingAPI.Core**: Domain models and interfaces  
- **AzureScriptingAPI.Infrastructure**: Data access and external services  
- **AzureScriptingAPI.Application**: Business logic  
- **AzureScriptingAPI.API**: REST API  
- **AzureScriptingAPI.Tests**: Unit and integration tests  

## 🤝 Contribution

1. Fork the project  
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
