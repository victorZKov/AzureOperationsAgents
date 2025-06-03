namespace AzureOperationsAgents.Application.Services.Chat;

using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;
using AzureOperationsAgents.Core.Interfaces.Chat;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using Microsoft.EntityFrameworkCore;

public class ChatContextHelper
{
    private readonly IEmbeddingService _embeddingService;
    private readonly IWebSearchService _webSearchService;
    private readonly IInstructionConfigurationService _instructionService;
    private readonly IChatService? _chatService;
    private readonly DbContext? _dbContext;
    private readonly IQdrantService _qdrantService;
    private readonly string _initialInstructions = "EG";

    public ChatContextHelper(
        IEmbeddingService embeddingService,
        IWebSearchService webSearchService,
        IInstructionConfigurationService instructionService, IQdrantService qdrantService, IChatService? chatService = null,
        DbContext? dbContext = null)
    {
        _embeddingService = embeddingService;
        _webSearchService = webSearchService;
        _instructionService = instructionService;
        _qdrantService = qdrantService;
        _chatService = chatService;
        _dbContext = dbContext;
    }

    public async Task<List<string>> GetEmbeddingSnippets(string userId, string prompt, CancellationToken cancellationToken)
    {
        try
        {
            var promptEmbedding = await _embeddingService.GetEmbeddingAsync(prompt, cancellationToken);
            var relevantSnippets = await _qdrantService.SearchRelevantSnippetsAsync(userId, promptEmbedding);
            //var relevantSnippets = await _embeddingService.SearchRelevantSnippetsAsync(userId, prompt, cancellationToken);
            //var knowledgeSnippets = relevantSnippets as KnowledgeSnippet[] ?? relevantSnippets.ToArray();
            //if (knowledgeSnippets.Any())
            //{
            //    return knowledgeSnippets.Select(s => s.Content).ToList();
            //}
            if (relevantSnippets.Any())
            {
                return relevantSnippets.Select(s => s.content).ToList();
            }
            return new List<string>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching embedding snippets: {ex.Message}");
            return new List<string>();
        }
    }

    public async Task<List<string>> GetWebSnippets(string prompt, CancellationToken cancellationToken)
    {
        try
        {
            var webResults = await _webSearchService.SearchAsync(prompt, cancellationToken);
            var webSearchResults = webResults as WebSearchResult[] ?? webResults.ToArray();
            if (webSearchResults.Any())
            {
                return webSearchResults.Select(r => r.Snippet).ToList();
            }
            return new List<string>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching web snippets: {ex.Message}");
            return new List<string>();
        }
    }

    public async Task<List<string>> GetRelevantHistory(int chatId, string userId, CancellationToken cancellationToken)
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
            return new List<string>();
        }

    }

    public async Task<string> GetInstructions(string userId, CancellationToken cancellationToken)
    {
        try
        {
            var instructions = await _instructionService.GetInstructionConfigurationAsync(_initialInstructions, cancellationToken);
            return instructions?.Value ?? string.Empty;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching instructions: {ex.Message}");
            return string.Empty;
        }
    }
}

