using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Application.Services.Backend;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureAppConfiguration((context, config) =>
    {
        // Load settings from local.settings.json
        config.SetBasePath(Directory.GetCurrentDirectory());
        config.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
        config.AddEnvironmentVariables();
    })
    .ConfigureServices(services =>
    {
        // Solo si lo necesitas
        //services.AddSingleton<AgentRepository>();
        //services.AddSingleton<AgentService>();
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.AllowCredentials()
                    .WithOrigins( "http://localhost:8032", "https://home.kovimatic.ie")
                    .AllowAnyHeader()
                    .WithHeaders("Authorization", "idToken", "Ocp-Apim-Subscription-Key")
                    .AllowAnyMethod();
            });
        });
    })
    .Build();

host.Run();