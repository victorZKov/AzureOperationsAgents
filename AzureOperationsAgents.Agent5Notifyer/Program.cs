using AzureOperationsAgents.Application.Services.Auditing;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// var host = new HostBuilder()
//     .ConfigureFunctionsWebApplication()
//     .ConfigureServices((context, services) =>
//     {
//         services.AddScoped<AuditEventService>();
//     })
//     .Build();
// host.Run();

        
var builder = WebApplication.CreateBuilder(args);


// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

// Added required classes to the IoC container for the auditing service
builder.Services.AddScoped<AuditEventService>();

builder.Build().Run();