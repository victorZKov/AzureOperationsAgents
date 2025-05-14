using AzureOperationsAgents.Application;
using AzureOperationsAgents.Infrastructure;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        var config = context.Configuration;

        // Register app + db layers
        services.AddApplication();
        services.AddInfrastructure(config);

        // Add HttpClient for Ollama
        services.AddHttpClient<IScriptGenerationService, ScriptGenerationService>(client =>
        {
            client.BaseAddress = new Uri("http://ollama:11434"); // Docker-internal host
        });
    })
    .Build();

host.Run();