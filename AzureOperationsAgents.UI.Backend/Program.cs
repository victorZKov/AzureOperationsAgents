using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using AzureOperationsAgents.Application;
using AzureOperationsAgents.Infrastructure;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;

var builder = FunctionsApplication.CreateBuilder(args);

// Configuración adicional si es necesario
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Services.AddHttpClient<IScriptGenerationService, ScriptGenerationService>(client =>
{
    client.BaseAddress = new Uri("http://ollama:11434"); // Docker-internal host
});

builder.Services.AddTransient<IScriptRepository, ScriptRepository>();

builder.Build().Run();
