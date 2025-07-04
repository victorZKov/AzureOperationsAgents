using AzureOperationsAgents.Application.Services.Chat;
using AzureOperationsAgents.Application.Services.Configuration;
using AzureOperationsAgents.Application.Services.Learning;
using AzureOperationsAgents.Application.Services;
using AzureOperationsAgents.Application.Services.Files; // Added for ModelService
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Interfaces.Projects;
using AzureOperationsAgents.Application.Services.Projects;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Interfaces.Files; // Added for IModelRepository and IModelService
using Qdrant.Client;

var host = Host.CreateDefaultBuilder()
    .ConfigureAppConfiguration(config =>
    {
        config
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        // Carga la cadena de conexión a SQL Server desde local.settings.json
        var connectionString = configuration["SqlConnection"];
        services.AddDbContext<AzureOperationsDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Repositorio y servicio de proyectos
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<IProjectsService, ProjectsService>();
        
        // Repositorio y servicio de chats
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IChatService, ChatService>();
        
        // ChatService de Ollama
        services.AddScoped<OllamaService>();
        services.AddScoped<OpenAiService>();
        
        // Repositorio y servicio de snippets
        services.AddScoped<IKnowledgeRepository, KnowledgeRepository>();
        services.AddScoped<IKnowledgeService, KnowledgeService>();
        
        // Servicio de búsqueda web
        services.AddScoped<IWebSearchService, SerperWebSearchService>();
        
        // Servicio de embedding
        services.AddScoped<IEmbeddingService, EmbeddingService>();
        services.AddScoped<IQdrantService, QdrantService>();
        
        // Repositorio y servicio de configuración
        services.AddScoped<IUserConfigurationRepository, UserConfigurationRepository>();
        services.AddScoped<IUserConfigurationService, UserConfigurationService>();
        
        // Repositorio y servicio de modelos LLM
        services.AddScoped<IModelRepository, ModelRepository>();
        services.AddScoped<IModelService, ModelService>();
        
        // Repositorio y servicio de configuración de instrucciones
        services.AddScoped<IInstructionConfigurationRepository, InstructionConfigurationRepository>();
        services.AddScoped<IInstructionConfigurationService, InstructionConfigurationService>();
        
        // Repositorio y servicio de archivos
        services.AddScoped<IFilesService, FilesService>();
        
        
        // // Servicio de generación de scripts (LLM)
        // services.AddHttpClient<IScriptGenerationService, ScriptGenerationService>(client =>
        // {
        //     client.BaseAddress = new Uri("http://ollama:11434");
        // });

        // CORS
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
    })
    .ConfigureFunctionsWebApplication()
    .Build();

// Asegura la creación de la base de datos/tables al arrancar
using (var scope = host.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AzureOperationsDbContext>();
    db.Database.EnsureCreated();
}

host.Run();

using (var scope = host.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AzureOperationsDbContext>();
    db.Database.EnsureCreated(); 
}
