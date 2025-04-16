using AzureOperationsAgents.Application.Services.Classification;
using AzureOperationsAgents.Application.Services.Execution;
using AzureOperationsAgents.Application.Services.Monitoring;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Application.Services.Orchestration;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Core.Interfaces.Execution;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

// Define a static class to hold agent metadata and configuration
public static class Agent6Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent6-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Decision Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}

var builder = FunctionsApplication.CreateBuilder(args);

// Register services
builder.Services.AddScoped<IMonitoringService, MonitoringService>();
builder.Services.AddScoped<IEventClassificationService, EventClassificationService>();
builder.Services.AddScoped<IScriptGenerationService, ScriptGenerationService>();
builder.Services.AddScoped<IScriptExecutionService, ScriptExecutionService>();
builder.Services.AddScoped<IAuditEventRepository, AuditEventRepository>();
builder.Services.AddScoped<OrchestrationService>();

builder.ConfigureFunctionsWebApplication();

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

var app = builder.Build();

// Removed HTTP-triggered Azure Functions to move them into a separate file

app.Run();