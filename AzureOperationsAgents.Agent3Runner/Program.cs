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