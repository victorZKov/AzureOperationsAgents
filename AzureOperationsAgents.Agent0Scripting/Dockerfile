# Imagen base de Azure Functions para producción
FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0 AS base
WORKDIR /home/site/wwwroot
EXPOSE 8080

# Imagen intermedia para compilar el proyecto
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copiamos solo los proyectos requeridos
COPY AzureOperationsAgents.Agent0Scripting/ AzureOperationsAgents.Agent0Scripting/
COPY AzureOperationsAgents.Application/ AzureOperationsAgents.Application/
COPY AzureOperationsAgents.Core/ AzureOperationsAgents.Core/
COPY AzureOperationsAgents.Infrastructure/ AzureOperationsAgents.Infrastructure/

# Restauramos y compilamos
WORKDIR /src/AzureOperationsAgents.Agent0Scripting
RUN dotnet restore
RUN dotnet build -c $BUILD_CONFIGURATION -o /app/build

# Publicamos
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Imagen final para ejecución
FROM base AS final
WORKDIR /home/site/wwwroot
COPY --from=publish /app/publish .

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true