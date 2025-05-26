using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.IO;
using AzureOperationsAgents.Application.Services.Chat;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class OllamaFunctions
{
    private readonly ILogger<OllamaFunctions> _logger;
    private readonly IStreamChatService _ollamaService;

    public OllamaFunctions(ILogger<OllamaFunctions> logger, OllamaService ollamaService)
    {
        _logger = logger;
        _ollamaService = ollamaService;
    }

    [Function("ChatOllama")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chat/ollama")]
        HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("OllamaFunctions");
        logger.LogInformation("OllamaFunctions function triggered.");

        var reader = new StreamReader(req.Body);
        var body = await reader.ReadToEndAsync();
        var data = JsonSerializer.Deserialize<Dictionary<string, string>>(body);

        if (data is null || !data.TryGetValue("prompt", out var userPrompt))
        {
            logger.LogError("Missing prompt.");
            var badResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Missing prompt.");
            return badResponse;
        }

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);

        var stream = await _ollamaService.StreamChatCompletionAsync(userPrompt, userId, CancellationToken.None);

        var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/event-stream");

        await using var writer = new StreamWriter(response.Body);
        using var readerStream = new StreamReader(stream);

        while (!readerStream.EndOfStream)
        {
            var line = await readerStream.ReadLineAsync();
            if (!string.IsNullOrWhiteSpace(line))
            {
                await writer.WriteLineAsync(line);
                await writer.FlushAsync();
            }
        }

        return response;
    }
}