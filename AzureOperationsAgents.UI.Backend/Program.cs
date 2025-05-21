using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;

var host = Host.CreateDefaultBuilder()
  .ConfigureAppConfiguration(config =>
  {
      config
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
          .AddEnvironmentVariables();
  })
  .ConfigureServices(services =>
  {
      services.AddApplicationInsightsTelemetryWorkerService();

      services.AddHttpClient<IScriptGenerationService, ScriptGenerationService>(client =>
      {
          client.BaseAddress = new Uri("http://ollama:11434");
      });

      //services.AddTransient<IScriptRepository, ScriptRepository>();

      // Agrega CORS    
      services.AddCors(options =>
      {
          options.AddDefaultPolicy(policy =>
          {
              policy
                  .AllowAnyOrigin()   // O usa .WithOrigins("http://localhost:3000") si prefieres limitar    
                  .AllowAnyMethod()
                  .AllowAnyHeader();
          });
      });
  })
  .ConfigureFunctionsWebApplication() // Updated to use ASP.NET Core Integration  
  .Build();

host.Run();
