using Azure.Data.Tables;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Application.Services.Execution;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Interfaces.Execution;
using AzureOperationsAgents.Core.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.Functions.Worker;
using System;

public static class Agent3Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent3-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Runner Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        // Configuración de Azure Table Storage
        services.AddSingleton<TableClient>(sp =>
        {
            var connectionString = context.Configuration["AZURE_STORAGE_CONNECTION_STRING"];
            return new TableClient(connectionString, "ScriptExecutions");
        });

        // Configuración del servicio de ejecución
        services.AddScoped<IScriptExecutionService, ScriptExecutionService>();
    })
    .Build();

host.Run();