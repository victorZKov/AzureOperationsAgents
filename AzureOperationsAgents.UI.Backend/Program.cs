using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Core.Models;
using System.Text.Json;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddSingleton<AgentRepository>();
        services.AddSingleton<AgentService>();
    })
    .Build();

host.Run();