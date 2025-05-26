using AzureOperationsAgents.Core.Interfaces.Chat;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Application.Services.Learning;
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Application.Services.Chat;

public class OpenAiService : IStreamChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _model;
    public string ConfiguredModelName => _model;
    private readonly string _baseUrl = "https://api.openai.com/v1";
    private readonly IKnowledgeService _knowledgeService;
    private readonly IEmbeddingService _embeddingService;
    private readonly IWebSearchService _webSearchService;

    public OpenAiService(IConfiguration configuration, IKnowledgeService knowledgeService, IEmbeddingService embeddingService, IWebSearchService webSearchService)
    {
        var apiKey = configuration["OpenAIKey"] ?? throw new ArgumentNullException(nameof(configuration), "OpenAI:ApiKey configuration is missing");
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        _model = configuration["OpenAIModel"] ?? "gpt-3.5-turbo";
        var url = configuration["OpenAIEndpoint"] ?? _baseUrl;
        _baseUrl = $"{url}/chat/completions";
        _knowledgeService = knowledgeService;
        _embeddingService = embeddingService;
        _webSearchService = webSearchService;
    }

    public async Task<Stream> StreamChatCompletionAsync(string prompt, string userId, CancellationToken cancellationToken)
    {
        List<string> embeddingSnippets = new List<string>();
        List<string> webSnippets = new List<string>();

        try
        {
            var relevantSnippets = await _embeddingService.SearchRelevantSnippetsAsync(userId, prompt, cancellationToken);
            var knowledgeSnippets = relevantSnippets as KnowledgeSnippet[] ?? relevantSnippets.ToArray();
            if (knowledgeSnippets.Any())
            {
                embeddingSnippets = knowledgeSnippets.Select(s => s.Content).ToList();
            }

            var webResults = await _webSearchService.SearchAsync(prompt, cancellationToken);
            var webSearchResults = webResults as WebSearchResult[] ?? webResults.ToArray();
            if (webSearchResults.Any())
            {
                webSnippets = webSearchResults.Select(r => r.Snippet).ToList();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during embedding or web search: {ex.Message}");
        }

        var systemInstructions = "You are an assistant combining company knowledge and live web data.";
        var messages = new List<object>
        {
            new { role = "system", content = systemInstructions }
        };

        if (embeddingSnippets.Any())
        {
            messages.Add(new { role = "system", content = $"Relevant company knowledge:\n{string.Join("\n", embeddingSnippets)}" });
        }

        if (webSnippets.Any())
        {
            messages.Add(new { role = "system", content = $"Relevant web search results:\n{string.Join("\n", webSnippets)}" });
        }

        messages.Add(new { role = "user", content = prompt });

        var requestBody = new
        {
            model = _model,
            messages = messages,
            stream = true,
            user = userId
        };

        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            )
        };

        var response = await _httpClient.SendAsync(
            request,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken
        );

        response.EnsureSuccessStatusCode();

        var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var reader = new StreamReader(responseStream);
        var collectedResponse = new StringBuilder();

        var passthroughStream = new MemoryStream();
        var passthroughWriter = new StreamWriter(passthroughStream, Encoding.UTF8) { AutoFlush = true };

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
                        await passthroughWriter.WriteLineAsync($"data: {jsonLine}");
                        await passthroughWriter.FlushAsync(cancellationToken);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Skipping malformed chunk. Error: {ex.Message}");
                continue;
            }
        }

        passthroughStream.Position = 0;

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
                await _knowledgeService.SaveSnippetAsync(userId, chatTitle, finalText, embedding, cancellationToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving assistant response snippet: {ex.Message}");
            }
        }

        return passthroughStream;
    }
}