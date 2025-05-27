using AzureOperationsAgents.Core.Interfaces.Chat;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using AzureOperationsAgents.Core.Interfaces.Configuration;

namespace AzureOperationsAgents.Application.Services.Chat;

public class OpenAiService : IStreamChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _defaultModel;
    private readonly string _baseUrl = "https://api.openai.com/v1";
    private readonly IKnowledgeService _knowledgeService;
    private readonly IEmbeddingService _embeddingService;
    private readonly IWebSearchService _webSearchService;
    private readonly IChatService _chatService;
    private readonly IUserConfigurationService _configurationService;
    private readonly IInstructionConfigurationService _instructionService;
    
    public string ConfiguredModelName => _defaultModel;

    public OpenAiService(IConfiguration configuration, IKnowledgeService knowledgeService, IEmbeddingService embeddingService, 
                       IWebSearchService webSearchService, IUserConfigurationService configurationService, IInstructionConfigurationService instructionService, IChatService chatService)
    {
        _httpClient = new HttpClient();
        _defaultModel = configuration["OpenAIModel"] ?? "gpt-3.5-turbo";
        var defaultUrl = configuration["OpenAIEndpoint"] ?? _baseUrl;
        _baseUrl = $"{defaultUrl}/chat/completions";
        _knowledgeService = knowledgeService;
        _embeddingService = embeddingService;
        _webSearchService = webSearchService;
        _configurationService = configurationService;
        _instructionService = instructionService;
        _chatService = chatService;
    }

    public async Task<Stream> StreamChatCompletionAsync(int chatId, string prompt, string model, string language, string userId, CancellationToken cancellationToken)
    {
        // Get user-specific configuration
        string apiKey = await _configurationService.GetOpenAIKeyForUserAsync(userId);
        string endpoint = await _configurationService.GetOpenAIEndpointForUserAsync(userId);
        string url = $"{endpoint}/chat/completions";
        
        // Set up HttpClient with the user's API key
        var requestClient = new HttpClient();
        requestClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var embeddingSnippets = await GetEmbeddingSnippets(userId, prompt, cancellationToken);
        var webSnippets = await GetWebSnippets(prompt, cancellationToken);
        var relevantHistory = await GetRelevantHistory(chatId, userId, cancellationToken);
        var instructions = await GetInstructions(userId, cancellationToken);
        
        var requestBody = BuildBody(
            instructions,
            relevantHistory,
            embeddingSnippets,
            webSnippets,
            prompt,
            model,
            userId
        );
        
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            )
        };

        var response = await requestClient.SendAsync(
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
    
    private async Task<List<string>> GetEmbeddingSnippets(string userId, string prompt, CancellationToken cancellationToken)
    {
        try
        {
            var relevantSnippets = await _embeddingService.SearchRelevantSnippetsAsync(userId, prompt, cancellationToken);
            var knowledgeSnippets = relevantSnippets as KnowledgeSnippet[] ?? relevantSnippets.ToArray();
            if (knowledgeSnippets.Any())
            {
                var embeddingSnippets = knowledgeSnippets.Select(s => s.Content).ToList();
                return embeddingSnippets;
            }

            return [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching embedding snippets: {ex.Message}");
            return [];
        }
    }
    
    private async Task<List<string>> GetWebSnippets(string prompt, CancellationToken cancellationToken)
    {
        try
        {
            var webResults = await _webSearchService.SearchAsync(prompt, cancellationToken);
            var webSearchResults = webResults as WebSearchResult[] ?? webResults.ToArray();
            if (webSearchResults.Any())
            {
                var webSnippets = webSearchResults.Select(r => r.Snippet).ToList();
                return webSnippets;
            }
            return [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching web snippets: {ex.Message}");
            return [];
        }
    }
    
    private async Task<List<string>> GetRelevantHistory(int chatId, string userId, CancellationToken cancellationToken)
    {
        try
        {
            var memoryContext = await _chatService.GetMessagesByChatAsync(chatId, userId);
            var relevantMessages = await _chatService.GetRelevantMessages(userId, cancellationToken);
            var result = new List<string>();
            result.AddRange(memoryContext.Select(m => m.Message));
            result.AddRange(relevantMessages.Select(m => m.Message));
            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching user memory context: {ex.Message}");
            return [];
        }
    }
    
    private async Task<string> GetInstructions(string userId, CancellationToken cancellationToken)
    {
        try
        {
            var instructions = await _instructionService.GetInstructionConfigurationAsync("DefaultInitialInstruction", cancellationToken);
            return instructions?.Value ?? string.Empty;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching instructions: {ex.Message}");
            return string.Empty;
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
        var messages = new List<Dictionary<string, string>>();

        // Add system instructions
        messages.Add(new Dictionary<string, string>
        {
            { "role", "system" },
            { "content", instructions }
        });

        // Add user context
        if (!string.IsNullOrWhiteSpace(userId))
        {
            messages.Add(new Dictionary<string, string>
            {
                { "role", "system" },
                { "content", $"User ID: {userId}" }
            });
        }

        // Add relevant history
        foreach (var message in relevantHistory)
        {
            messages.Add(new Dictionary<string, string>
            {
                { "role", "user" },
                { "content", message }
            });
        }

        // Add embedding snippets
        if (embeddingSnippets.Any())
        {
            messages.Add(new Dictionary<string, string>
            {
                { "role", "system" },
                { "content", $"Relevant company knowledge: {string.Join("\n", embeddingSnippets)}" }
            });
        }

        // Add web snippets
        if (webSnippets.Any())
        {
            messages.Add(new Dictionary<string, string>
            {
                { "role", "system" },
                { "content", $"Relevant web search results: {string.Join("\n", webSnippets)}" }
            });
        }

        // Add user prompt
        messages.Add(new Dictionary<string, string>
        {
            { "role", "user" },
            { "content", prompt }
        });

        var requestBody = new
        {
            model = model,
            messages = messages,
            stream = true,
            user = userId
        };

        return requestBody;
    }
}

