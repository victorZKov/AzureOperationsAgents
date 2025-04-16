using AzureOperationsAgents.Agent4Auditing.SignalR;
using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add SignalR
builder.Services.AddSignalR();

// Add other services, repositories, and storage (e.g., IAuditEventRepository)
builder.Services.AddSingleton<IAuditEventRepository, AuditEventRepository>(); // or your actual implementation

var app = builder.Build();

// Map SignalR hub
app.MapHub<AuditHub>("/auditHub");

// Optional: Map a simple health check or root endpoint
app.MapGet("/", () => "Agent 4 Auditing is running");

// Define a static class to hold agent metadata and configuration
public static class Agent4Metadata
{
    public static IAgentMetadata Metadata { get; set; } = new AgentMetadata
    {
        Id = $"Agent4-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Name = $"Auditing Agent-{Guid.NewGuid().ToString().Substring(0, 8)}",
        Version = "1.0.0",
        Status = "Idle",
        LastRunTime = DateTime.MinValue
    };

    public static AgentConfig Config { get; set; } = new AgentConfig();
}

// Run the app
app.Run();