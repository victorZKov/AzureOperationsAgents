using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using AzureOperationsAgents.Core.Interfaces.Monitoring;
using AzureOperationsAgents.Application.Services.Monitoring;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        // Get configuration values
        var serviceBusConnection = context.Configuration["ServiceBusConnectionString"];
        var queueName = context.Configuration["ServiceBusQueueName"];

        // Register services
        services.AddSingleton<IMonitoringService>(sp => 
            new MonitoringService(serviceBusConnection, queueName));
    })
    .Build();

await host.RunAsync(); 