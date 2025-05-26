using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Application.Services.Learning;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Application.Services.Chat;

public class OllamaService : IStreamChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _modelName;
    public string ConfiguredModelName => _modelName;
    private readonly AzureOperationsDbContext _dbContext;
    private readonly IKnowledgeService _knowledgeService;
    private readonly IEmbeddingService _embeddingService;
    private readonly IWebSearchService _webSearchService;

    public OllamaService(
        IConfiguration configuration,
        AzureOperationsDbContext dbContext,
        IKnowledgeService knowledgeService,
        IEmbeddingService embeddingService,
        IWebSearchService webSearchService)
    {
        _dbContext = dbContext;
        _knowledgeService = knowledgeService;
        _embeddingService = embeddingService;
        _webSearchService = webSearchService;

        _httpClient = new HttpClient();
        _baseUrl = string.IsNullOrEmpty(configuration["OllamaServer"])
            ? "http://localhost:11434/api/generate"
            : $"{configuration["OllamaServer"]}/api/generate";
        _modelName = configuration["OllamaModel"] ?? "mistral:latest";
    }

    public async Task<Stream> StreamChatCompletionAsync(string prompt, string userId, CancellationToken cancellationToken)
    {
        List<string> embeddingSnippets = new List<string>();
        List<string> webSnippets = new List<string>();
        
        // Obtain user memory context
        var memoryContext = await MemoryHelper.GetUserMemoryAsync(_dbContext, userId);
        
        try
        {
            // Search for relevant knowledge snippets
            var relevantSnippets = await _embeddingService.SearchRelevantSnippetsAsync(userId, prompt, cancellationToken);
            var knowledgeSnippets = relevantSnippets as KnowledgeSnippet[] ?? relevantSnippets.ToArray();
            if (knowledgeSnippets.Any())
            {
                embeddingSnippets = knowledgeSnippets.Select(s => s.Content).ToList();
            }

            // Get web search results
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
        
        // Build the full prompt with all context
        var fullPromptBuilder = new StringBuilder();
        
        // Add system instructions
        fullPromptBuilder.AppendLine("You are an assistant combining company knowledge and live web data.");
        
        // Add memory context if available
        if (!string.IsNullOrWhiteSpace(memoryContext))
        {
            fullPromptBuilder.AppendLine("\nUser context:");
            fullPromptBuilder.AppendLine(memoryContext);
        }
        
        // Add embedding snippets if available
        if (embeddingSnippets.Any())
        {
            fullPromptBuilder.AppendLine("\nRelevant company knowledge:");
            fullPromptBuilder.AppendLine(string.Join("\n", embeddingSnippets));
        }
        
        // Add web snippets if available
        if (webSnippets.Any())
        {
            fullPromptBuilder.AppendLine("\nRelevant web search results:");
            fullPromptBuilder.AppendLine(string.Join("\n", webSnippets));
        }
        
        // Add user prompt
        fullPromptBuilder.AppendLine("\nUser query:");
        fullPromptBuilder.AppendLine(prompt);
        
        var fullPrompt = fullPromptBuilder.ToString();

        // Prepare request
        var payload = new
        {
            model = _modelName,
            prompt = fullPrompt,
            stream = true
        };

        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        // Call Ollama API
        var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var reader = new StreamReader(responseStream);
        var collectedResponse = new StringBuilder();

        var passthroughStream = new MemoryStream();
        var passthroughWriter = new StreamWriter(passthroughStream, Encoding.UTF8) { AutoFlush = true };

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line)) continue;

            try
            {
                var jsonDoc = JsonDocument.Parse(line);
                var root = jsonDoc.RootElement;

                if (root.TryGetProperty("response", out var responseElement))
                {
                    var content = responseElement.GetString();
                    if (!string.IsNullOrEmpty(content))
                    {
                        collectedResponse.Append(content);
                        await passthroughWriter.WriteLineAsync(line);
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

        // Save the final response to knowledge base
        var finalText = collectedResponse.ToString();
        if (!string.IsNullOrWhiteSpace(finalText))
        {
            var chatTitle = string.Join(" ", prompt.Split(' ').Take(10));
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

