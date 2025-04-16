using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Application.Services.Monitoring;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

// Define a static class to hold agent metadata and configuration
public static class Agent1Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent1-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Monitoring Function Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}

// Add HTTP-triggered Azure Functions
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        // Get configuration values
        var serviceBusConnection = context.Configuration["ServiceBusConnectionString"];
        var queueName = context.Configuration["ServiceBusQueueName"];

        // Register services
        services.AddSingleton<IMonitoringService>(sp => 
            new MonitoringService(serviceBusConnection, queueName));
    })
    .Build();

await host.RunAsync();