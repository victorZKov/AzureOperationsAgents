// OllamaService.cs
using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Interfaces.Learning;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AzureOperationsAgents.Application.Services.Chat;

public class OllamaService : IStreamChatService
{
    private readonly HttpClient _httpClient;
    private readonly ChatContextHelper _contextHelper;
    private readonly IEmbeddingService _embeddingService;
    private readonly IUserConfigurationService _configurationService;
    private readonly IQdrantService _qdrantService;

    public OllamaService(
        IConfiguration configuration,
        AzureOperationsDbContext dbContext,
        IKnowledgeService knowledgeService,
        IEmbeddingService embeddingService,
        IWebSearchService webSearchService,
        IUserConfigurationService configurationService,
        IInstructionConfigurationService instructionService,
        IChatService chatService,
        IQdrantService qdrantService)
    {
        _embeddingService = embeddingService;
        _configurationService = configurationService;
        _qdrantService = qdrantService;
        _httpClient = new HttpClient();
        _contextHelper = new ChatContextHelper(
            embeddingService,
            webSearchService,
            instructionService,
            qdrantService,
            chatService,
            dbContext
        );
    }

    public async Task StreamChatCompletionAsync(
        int chatId, string prompt, string ollamaModel, string language, string userId,
        CancellationToken cancellationToken, Func<string, Task> onResponse)
    {
        string ollamaServer = await _configurationService.GetOllamaServerForUserAsync(userId);
        string apiUrl = $"{ollamaServer}/api/generate";

        var embeddingSnippets = await _contextHelper.GetEmbeddingSnippets(userId, prompt, cancellationToken);
        var webSnippets = await _contextHelper.GetWebSnippets(prompt, cancellationToken);
        var relevantHistory = await _contextHelper.GetRelevantHistory(chatId, userId, cancellationToken);
        var instructions = await _contextHelper.GetInstructions(userId, cancellationToken);

        var fullPromptBuilder = new StringBuilder();
        if (!string.IsNullOrWhiteSpace(instructions))
        {
            fullPromptBuilder.AppendLine(instructions);
        }
        fullPromptBuilder.AppendLine("You are an assistant combining company knowledge and live web data.");
        if (relevantHistory.Any())
        {
            fullPromptBuilder.AppendLine("\nRelevant chat history:");
            fullPromptBuilder.AppendLine(string.Join("\n", relevantHistory));
        }
        if (embeddingSnippets.Any())
        {
            fullPromptBuilder.AppendLine("\nRelevant company knowledge:");
            fullPromptBuilder.AppendLine(string.Join("\n", embeddingSnippets));
        }
        if (webSnippets.Any())
        {
            fullPromptBuilder.AppendLine("\nRelevant web search results:");
            fullPromptBuilder.AppendLine(string.Join("\n", webSnippets));
        }
        fullPromptBuilder.AppendLine("\nUser query:");
        fullPromptBuilder.AppendLine(prompt);
        if (!string.IsNullOrWhiteSpace(language))
        {
            fullPromptBuilder.AppendLine($"\nPlease respond in {language}.");
        }

        var payload = new { model = ollamaModel, prompt = fullPromptBuilder.ToString(), stream = true };

        var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();
        var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var reader = new StreamReader(responseStream);

        var collectedResponse = new StringBuilder();

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line)) continue;

            try
            {
                //Console.WriteLine($"Received line: {line}");
                var jsonDoc = JsonDocument.Parse(line);
                var root = jsonDoc.RootElement;
                if (root.TryGetProperty("response", out var responseElement))
                {
                    var content = responseElement.GetString();
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

        // After streaming, save embedding + snippet
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
                await _qdrantService.UpsertSnippetAsync(userId, chatTitle, finalText, embedding);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving assistant response snippet: {ex.Message}");
            }
        }
    }

    
}