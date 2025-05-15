using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Application;
using AzureOperationsAgents.Infrastructure;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;


var builder = FunctionsApplication.CreateBuilder(args);

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
