using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Application.Services.Backend;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddSingleton<AgentRepository>();
        services.AddSingleton<AgentService>();
    })
    .Build();

host.Run();