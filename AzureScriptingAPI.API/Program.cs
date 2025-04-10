using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Azure.AI.OpenAI;
using AzureScriptingAPI.Core.Interfaces;
using AzureScriptingAPI.Infrastructure.Repositories;
using AzureScriptingAPI.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuración de autenticación con Azure AD
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Configuración de servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de servicios personalizados
builder.Services.AddSingleton(new OpenAIClient(
    builder.Configuration["OpenAI:Endpoint"],
    new Azure.AzureKeyCredential(builder.Configuration["OpenAI:ApiKey"])));

builder.Services.AddScoped<IScriptRepository>(sp => 
    new PostgresScriptRepository(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IScriptGenerationService, ScriptGenerationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
