FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0 AS base
WORKDIR /home/site/wwwroot
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY AzureOperationsAgents.UI.Backend/ AzureOperationsAgents.UI.Backend/
COPY AzureOperationsAgents.Application/ AzureOperationsAgents.Application/
COPY AzureOperationsAgents.Core/ AzureOperationsAgents.Core/
COPY AzureOperationsAgents.Infrastructure/ AzureOperationsAgents.Infrastructure/

WORKDIR /src/AzureOperationsAgents.UI.Backend
RUN dotnet restore "./AzureOperationsAgents.UI.Backend.csproj"
RUN dotnet publish "./AzureOperationsAgents.UI.Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /home/site/wwwroot
COPY --from=build /app/publish .

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true