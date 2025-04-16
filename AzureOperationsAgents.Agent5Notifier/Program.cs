using AzureOperationsAgents.Application.Services.Auditing;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

// Define a static class to hold agent metadata and configuration

var builder = WebApplication.CreateBuilder(args);

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

// Added required classes to the IoC container for the auditing service
builder.Services.AddScoped<AuditEventService>();

var app = builder.Build();

// Removed HTTP-triggered Azure Functions to move them into a separate file

app.Run();