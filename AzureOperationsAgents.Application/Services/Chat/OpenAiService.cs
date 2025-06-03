// Updated OpenAiService.cs with streaming + final embedding save
using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Application.Services.Chat;

public class OpenAiService : IStreamChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _defaultModel;
    private readonly string _baseUrl;
    private readonly IEmbeddingService _embeddingService;
    private readonly IUserConfigurationService _configurationService;
    private readonly ChatContextHelper _contextHelper;
    private readonly IQdrantService _qdrantService;

    public string ConfiguredModelName => _defaultModel;

    public OpenAiService(
        IConfiguration configuration,
        IKnowledgeService knowledgeService,
        IEmbeddingService embeddingService,
        IWebSearchService webSearchService,
        IUserConfigurationService configurationService,
        IInstructionConfigurationService instructionService,
        IChatService chatService,
        IQdrantService qdrantService)
    {
        _httpClient = new HttpClient();
        _defaultModel = configuration["OpenAIModel"] ?? "gpt-3.5-turbo";
        var defaultUrl = configuration["OpenAIEndpoint"] ?? "https://api.openai.com/v1";
        _baseUrl = $"{defaultUrl}/chat/completions";
        _embeddingService = embeddingService;
        _configurationService = configurationService;
        _qdrantService = qdrantService;
        _contextHelper = new ChatContextHelper(
            embeddingService,
            webSearchService,
            instructionService,
            qdrantService,
            chatService,
            null // no dbContext needed here
        );
    }

    public async Task StreamChatCompletionAsync(
        int chatId, string prompt, string model, string language, string userId,
        CancellationToken cancellationToken, Func<string, Task> onResponse)
    {
        string apiKey = await _configurationService.GetOpenAIKeyForUserAsync(userId);
        string endpoint = await _configurationService.GetOpenAIEndpointForUserAsync(userId);
        string url = $"{endpoint}/chat/completions";

        var requestClient = new HttpClient();
        requestClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var embeddingSnippets = await _contextHelper.GetEmbeddingSnippets(userId, prompt, cancellationToken);
        var webSnippets = await _contextHelper.GetWebSnippets(prompt, cancellationToken);
        var relevantHistory = await _contextHelper.GetRelevantHistory(chatId, userId, cancellationToken);
        var instructions = await _contextHelper.GetInstructions(userId, cancellationToken);

        var requestBody = BuildBody(instructions, relevantHistory, embeddingSnippets, webSnippets, prompt, model, userId);

        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
        };

        var response = await requestClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();
        var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var reader = new StreamReader(responseStream);

        var collectedResponse = new StringBuilder();

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line) || !line.StartsWith("data:")) continue;

            var jsonLine = line["data:".Length..].Trim();
            if (jsonLine == "[DONE]") break;

            try
            {
                var jsonDoc = JsonDocument.Parse(jsonLine);
                var root = jsonDoc.RootElement;

                if (root.TryGetProperty("choices", out var choices) &&
                    choices.GetArrayLength() > 0 &&
                    choices[0].TryGetProperty("delta", out var delta) &&
                    delta.TryGetProperty("content", out var contentElement))
                {
                    var content = contentElement.GetString();
                    if (!string.IsNullOrEmpty(content))
                    {
                        collectedResponse.Append(content);
                        await onResponse(content);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Skipping malformed chunk. Error: {ex.Message}");
                continue;
            }
        }

        var finalText = collectedResponse.ToString();
        if (!string.IsNullOrWhiteSpace(finalText))
        {
            var chatTitle = string.Join(" ", finalText.Split(' ').Take(10));
            if (chatTitle.Length > 200)
            {
                chatTitle = chatTitle.Substring(0, 200);
            }

            try
            {
                var embedding = await _embeddingService.GetEmbeddingAsync(finalText, cancellationToken);
                await _qdrantService.UpsertSnippetAsync(userId, chatTitle, finalText, embedding);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving assistant response snippet: {ex.Message}");
            }
        }
    }

    private object BuildBody(
        string instructions,
        List<string> relevantHistory,
        List<string> embeddingSnippets,
        List<string> webSnippets,
        string prompt,
        string model,
        string userId)
    {
        var messages = new List<Dictionary<string, string>>
        {
            new() { { "role", "system" }, { "content", instructions } }
        };

        if (!string.IsNullOrWhiteSpace(userId))
        {
            messages.Add(new() { { "role", "system" }, { "content", $"User ID: {userId}" } });
        }

        foreach (var message in relevantHistory)
        {
            messages.Add(new() { { "role", "user" }, { "content", message } });
        }

        if (embeddingSnippets.Any())
        {
            messages.Add(new() { { "role", "system" }, { "content", $"Relevant company knowledge: {string.Join("\n", embeddingSnippets)}" } });
        }

        if (webSnippets.Any())
        {
            messages.Add(new() { { "role", "system" }, { "content", $"Relevant web search results: {string.Join("\n", webSnippets)}" } });
        }

        messages.Add(new() { { "role", "user" }, { "content", prompt } });

        return new { model, messages, stream = true, user = userId };
    }
}