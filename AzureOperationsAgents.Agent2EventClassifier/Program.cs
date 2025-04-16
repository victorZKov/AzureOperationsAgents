using Azure.AI.OpenAI;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Application.Services.Classification;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Interfaces.Classification;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Core.Models;
using System;

// Define a static class to hold agent metadata and configuration
public static class Agent2Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent2-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Event Classifier Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
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
        // Configuración de OpenAI
        services.AddSingleton<OpenAIClient>(sp =>
        {
            var endpoint = context.Configuration["AZURE_OPENAI_ENDPOINT"];
            var key = context.Configuration["AZURE_OPENAI_KEY"];
            return new OpenAIClient(new Uri(endpoint), new Azure.AzureKeyCredential(key));
        });

        // Configuración del servicio de clasificación
        services.AddScoped<IEventClassificationService, EventClassificationService>();
        services.Configure<EventClassificationServiceOptions>(options =>
        {
            options.DeploymentName = context.Configuration["AZURE_OPENAI_DEPLOYMENT_NAME"];
        });
    })
    .Build();

host.Run();