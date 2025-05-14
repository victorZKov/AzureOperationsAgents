using AzureOperationsAgents.Application.Services.Classification;
using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Imfrastructure.Interfaces;

// Define a static class to hold agent metadata and configuration

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {

        services.AddHttpClient();
        
        // Configuración del servicio de clasificación
        services.AddScoped<IEventClassificationService, EventClassificationService>();
        services.AddSingleton<IEventClassificationRepository, SqlServerEventClassificationRepository>();

    })
    .Build();

host.Run();