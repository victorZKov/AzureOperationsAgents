using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Learning;
using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Application.Services.Learning;


public class KnowledgeService : IKnowledgeService
{
    private readonly IKnowledgeRepository _repository;

    public KnowledgeService(IKnowledgeRepository repository)
    {
        _repository = repository;
    }

    public async Task SaveSnippetAsync(string userId, string chatTitle, string content, float[] embedding, CancellationToken cancellationToken)
    {
        var snippet = new KnowledgeSnippet
        {
            UserId = userId,
            ChatTitle = chatTitle,
            Content = content,
            EmbeddingJson = JsonSerializer.Serialize(embedding),
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddSnippetAsync(snippet);
    }

    public async Task<List<KnowledgeSnippet>> GetSnippetsForUserAsync(string userId)
    {
        return await _repository.GetSnippetsByUserAsync(userId, CancellationToken.None);
    }
}