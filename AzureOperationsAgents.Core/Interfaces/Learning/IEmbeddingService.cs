using AzureOperationsAgents.Core.Models.Learning;

namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IEmbeddingService
{
    Task<float[]> GetEmbeddingAsync(string text, CancellationToken cancellationToken);
    Task<IEnumerable<KnowledgeSnippet>> SearchRelevantSnippetsAsync(string userId, string prompt, CancellationToken cancellationToken);
}