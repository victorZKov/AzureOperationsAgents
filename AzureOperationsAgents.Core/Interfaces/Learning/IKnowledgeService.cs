using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IKnowledgeService
{
    Task SaveSnippetAsync(string userId, string chatTitle, string content, float[] embedding, CancellationToken cancellationToken);
    Task<List<KnowledgeSnippet>> GetSnippetsForUserAsync(string userId);
}