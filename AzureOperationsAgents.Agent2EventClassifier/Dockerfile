# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY AzureOperationsAgents.Agent2EventClassifier/ AzureOperationsAgents.Agent2EventClassifier/
COPY AzureOperationsAgents.Application/ AzureOperationsAgents.Application/
COPY AzureOperationsAgents.Core/ AzureOperationsAgents.Core/
COPY AzureOperationsAgents.Infrastructure/ AzureOperationsAgents.Infrastructure/

WORKDIR /source/AzureOperationsAgents.Agent2EventClassifier
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENV AzureWebJobsScriptRoot=/app \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

ENTRYPOINT ["dotnet", "AzureOperationsAgents.Agent2EventClassifier.dll"]