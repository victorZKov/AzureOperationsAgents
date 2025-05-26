using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using AzureOperationsAgents.Application.Services.Chat;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.UI.Backend.Functions;

public class OpenAiFunctions
{
    private readonly OpenAiService _openaiService; // Changed type to OpenAiService
    private readonly string _modelName = "gpt-3.5-turbo"; // Default model name, can be overridden by configuration

    public OpenAiFunctions(OpenAiService openaiService, IConfiguration configuration)
    {
        _openaiService = openaiService;
        _modelName = configuration["OpenAIModel"] ?? _modelName; // Use configured model name if available
    }

    [Function("ChatOpenAI")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chat/openai")]
        HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("OpenAiFunctions");
        logger.LogInformation("OpenAiFunctions function triggered.");

        var reader = new StreamReader(req.Body);
        var body = await reader.ReadToEndAsync();
        var data = JsonSerializer.Deserialize<Dictionary<string, string>>(body);

        if (data is null || !data.TryGetValue("prompt", out var userPrompt))
        {
            logger.LogError("Missing prompt.");
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Missing prompt.");
            return badResponse;
        }

        var userId = JwtUtils.GetSubFromAuthorizationHeader(req);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("User ID not found in token.");
            var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
            await unauthorizedResponse.WriteStringAsync("User ID not found in token.");
            return unauthorizedResponse;
        }

        var stream = await _openaiService.StreamChatCompletionAsync(userPrompt, userId, CancellationToken.None);

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/event-stream");

        await using var writer = new StreamWriter(response.Body);
        using var readerStream = new StreamReader(stream);

        while (!readerStream.EndOfStream)
        {
            var line = await readerStream.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line))
                continue;

            if (line.StartsWith("data: "))
            {
                var jsonPart = line.Substring("data: ".Length).Trim();

                if (jsonPart == "[DONE]")
                    continue;

                try
                {
                    using var jsonDoc = JsonDocument.Parse(jsonPart);
                    var choice = jsonDoc.RootElement.GetProperty("choices")[0];

                    string modelName = _modelName; // Use configured model name

                    string responseContent = "";
                    if (choice.TryGetProperty("delta", out var delta) && delta.TryGetProperty("content", out var contentProp) && contentProp.ValueKind == JsonValueKind.String)
                    {
                        responseContent = contentProp.GetString() ?? "";
                    }

                    bool isDone = false;
                    if (choice.TryGetProperty("finish_reason", out var finishReasonProp) && finishReasonProp.ValueKind != JsonValueKind.Null)
                    {
                        isDone = true;
                    }

                    var streamEvent = new
                    {
                        model = modelName,
                        created_at = DateTime.UtcNow.ToString("o"), // ISO 8601 format
                        response = responseContent ?? "",
                        done = isDone
                    };
                    
                    string newJsonPayload = JsonSerializer.Serialize(streamEvent);
                    await writer.WriteAsync(newJsonPayload + "\n"); // Each JSON object on a new line
                    await writer.FlushAsync();
                }
                catch (JsonException ex)
                {
                    logger.LogWarning($"Skipping invalid JSON chunk: {jsonPart}. Error: {ex.Message}");
                }
            }
        }

        return response;
    }
}
