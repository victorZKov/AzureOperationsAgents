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

builder.Build().Run();