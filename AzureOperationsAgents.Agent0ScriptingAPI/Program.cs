using Azure.AI.OpenAI;
using AzureOperationsAgents.Core.Interfaces.Scripting;
using AzureOperationsAgents.Application.Services.Scripting;
using AzureOperationsAgents.Infrastructure.Repositories;
using AzureOperationsAgents.Core.Interfaces;
using AzureOperationsAgents.Core.Models;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register OpenAI client
builder.Services.AddSingleton(sp => new OpenAIClient(
    new Uri(builder.Configuration["OpenAI:Endpoint"] ?? throw new InvalidOperationException("OpenAI:Endpoint is not configured")),
    new Azure.AzureKeyCredential(builder.Configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured"))));

// Register application services
builder.Services.AddScoped<IScriptGenerationService, ScriptGenerationService>();
builder.Services.AddScoped<IScriptRepository>(sp => new ScriptRepository(
    builder.Configuration["Azure:StorageConnectionString"] ?? throw new InvalidOperationException("Azure:StorageConnectionString is not configured")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Removed HTTP-triggered Azure Functions to move them into a separate file

app.Run();