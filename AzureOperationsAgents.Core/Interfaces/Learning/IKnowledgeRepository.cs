using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IKnowledgeRepository
{
    Task AddSnippetAsync(KnowledgeSnippet snippet);
    Task<List<KnowledgeSnippet>> GetSnippetsByUserAsync(string userId, CancellationToken cancellationToken);
}