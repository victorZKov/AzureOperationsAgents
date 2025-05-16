using System.Security.Claims;
using AzureOperationsAgents.Core.Models.Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class OllamaFunctions
{
    private readonly ILogger<OllamaFunctions> _logger;

    private readonly string _baseUrl; 

    public OllamaFunctions(ILogger<OllamaFunctions> logger, IConfiguration configuration)
    {
        if (string.IsNullOrEmpty(configuration["OllamaServer"]))
            _baseUrl = "http://localhost:11434/api/generate";
        else
            _baseUrl = $"{configuration["OllamaServer"]}/api/generate";
        _logger = logger;
    }

    [Function("GenerateFromOllama")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")]
        HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("OllamaFunctions");

        logger.LogInformation("***************** OllamaFunctions function processed a request.");

        var reader = new StreamReader(req.Body);
        var body = await reader.ReadToEndAsync();
        var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(body);

        if (data is null
            || !data.TryGetValue("prompt", out var userPrompt)
            || !data.TryGetValue("model", out var model)
            || !data.TryGetValue("agent", out var agent))
        {
            logger.LogError("Missing prompt, model, or agent.");
            var badResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
            badResponse.WriteString("Missing prompt, model, or agent.");
            return badResponse;
        }

        var systemPrompt = AgentPrompts.GetPrompt(agent);
        var fullPrompt = $"{systemPrompt}\n\n{userPrompt}";

        var requestContent = new StringContent(
            System.Text.Json.JsonSerializer.Serialize(new
            {
                model = model,
                prompt = fullPrompt,
                stream = true // activamos el stream
            }),
            System.Text.Encoding.UTF8,
            "application/json"
        );

        logger.LogInformation($"Request to Ollama: {requestContent}");

        var httpClient = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl)
        {
            Content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(new
                {
                    model = model,
                    prompt = fullPrompt,
                    stream = true // activamos el stream
                }),
                System.Text.Encoding.UTF8,
                "application/json")
        };

        var response =
            await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, CancellationToken.None);

        if (!response.IsSuccessStatusCode)
        {
            var errorResponse = req.CreateResponse((System.Net.HttpStatusCode)response.StatusCode);
            errorResponse.WriteString("Failed to stream from Ollama.");
            return errorResponse;
        }

        var streamResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
        streamResponse.Headers.Add("Content-Type", "text/plain");

        await using var responseStream = await response.Content.ReadAsStreamAsync();
        await using var writer = new StreamWriter(streamResponse.Body);

        using var readerStream = new StreamReader(responseStream);
        while (!readerStream.EndOfStream)
        {
            var line = await readerStream.ReadLineAsync();
            if (!string.IsNullOrWhiteSpace(line))
            {
                await writer.WriteLineAsync(line);
                await writer.FlushAsync(); // <-- forza a que el chunk se mande
            }
        }

        return streamResponse;
    }



}

