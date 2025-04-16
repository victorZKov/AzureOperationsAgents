using AzureOperationsAgents.Application.Services.Auditing;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

// Define a static class to hold agent metadata and configuration
public static class Agent5Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent5-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Notifier Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}

var builder = WebApplication.CreateBuilder(args);

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

// Added required classes to the IoC container for the auditing service
builder.Services.AddScoped<AuditEventService>();

var app = builder.Build();

// Removed HTTP-triggered Azure Functions to move them into a separate file

app.Run();