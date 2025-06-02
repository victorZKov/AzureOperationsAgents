namespace AzureOperationsAgents.Core.Interfaces.Learning;

public interface IQdrantService
{
    Task UpsertSnippetAsync(string userId, string chatTitle, string content, float[] embedding);
    Task<List<(string content, float score)>> SearchRelevantSnippetsAsync(string userId, float[] embedding, int topK = 5);
}