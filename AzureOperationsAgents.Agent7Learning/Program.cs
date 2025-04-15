using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Application.Interfaces;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Infrastructure.Repositories;
using Microsoft.Azure.Cosmos;

var builder = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        // Register Cosmos DB client
        services.AddSingleton(s => new CosmosClient(context.Configuration["CosmosDbConnection"]));

        // Register repositories
        services.AddScoped<IExperienceLogRepository, ExperienceLogRepository>();

        // Register handlers
        services.AddScoped<ILogExperienceCommandHandler, LogExperienceCommandHandler>();
        services.AddScoped<IGetExperienceRecommendationsQueryHandler, GetExperienceRecommendationsQueryHandler>();
    });

var host = builder.Build();
await host.RunAsync();