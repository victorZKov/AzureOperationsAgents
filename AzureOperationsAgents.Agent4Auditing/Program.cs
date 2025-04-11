using AzureOperationsAgents.Agent4Auditing.SignalR;
using AzureOperationsAgents.Core.Interfaces.Auditing;
using AzureOperationsAgents.Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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

// Run the app
app.Run();