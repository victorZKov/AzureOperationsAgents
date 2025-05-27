using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Context;
using AzureOperationsAgents.Core.Helpers;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using Microsoft.EntityFrameworkCore;
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
    private readonly IChatService _chatService;
    private readonly IUserConfigurationService _configurationService;
    private readonly IInstructionConfigurationService _instructionService;
    private readonly ChatContextHelper _contextHelper;

    public OllamaService(
        IConfiguration configuration,
        AzureOperationsDbContext dbContext,
        IKnowledgeService knowledgeService,
        IEmbeddingService embeddingService,
        IWebSearchService webSearchService,
        IUserConfigurationService configurationService, IInstructionConfigurationService instructionService, IChatService chatService)
    {
        _dbContext = dbContext;
        _knowledgeService = knowledgeService;
        _embeddingService = embeddingService;
        _webSearchService = webSearchService;
        _configurationService = configurationService;
        _instructionService = instructionService;
        _chatService = chatService;
        _httpClient = new HttpClient();
        _baseUrl = string.IsNullOrEmpty(configuration["OllamaServer"])
            ? "http://localhost:11434/api/generate"
            : $"{configuration["OllamaServer"]}/api/generate";
        _modelName = configuration["OllamaModel"] ?? "mistral:latest";
        _contextHelper = new ChatContextHelper(
            embeddingService,
            webSearchService,
            instructionService,
            _chatService,
            dbContext
        );
    }

    public async Task<Stream> StreamChatCompletionAsync(int chatId, string prompt, string ollamaModel, string language, string userId, CancellationToken cancellationToken)
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
        var fullPrompt = fullPromptBuilder.ToString();
        var payload = new
        {
            model = ollamaModel,
            prompt = fullPrompt,
            stream = true
        };
        var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };
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
