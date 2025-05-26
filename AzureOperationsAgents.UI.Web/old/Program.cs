using Microsoft.AspNetCore.SpaServices.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Habilita archivos estáticos
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "dist";
});

var app = builder.Build();

// Sirve los archivos estáticos
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.MapGet("/api/hello", () => "Hello from API!");

// React SPA fallback
app.MapFallbackToFile("index.html");

app.Run();