using Azure.Data.Tables;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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