using Azure.AI.OpenAI;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        // Configuración de OpenAI
        services.AddSingleton<OpenAIClient>(sp =>
        {
            var endpoint = context.Configuration["AZURE_OPENAI_ENDPOINT"];
            var key = context.Configuration["AZURE_OPENAI_KEY"];
            return new OpenAIClient(new Uri(endpoint), new Azure.AzureKeyCredential(key));
        });

        // Configuración del servicio de clasificación
        services.AddScoped<IEventClassificationService, EventClassificationService>();
        services.Configure<EventClassificationServiceOptions>(options =>
        {
            options.DeploymentName = context.Configuration["AZURE_OPENAI_DEPLOYMENT_NAME"];
        });
    })
    .Build();

host.Run(); 