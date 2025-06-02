using AzureOperationsAgents.Core.Interfaces.Learning;
using Qdrant.Client;
using Qdrant.Client.Grpc;

namespace AzureOperationsAgents.Application.Services.Learning;

public class QdrantService : IQdrantService
{
    private readonly QdrantClient _client = new("localhost:6334");
    private const string CollectionName = "user-private-embeddings";

    public async Task UpsertSnippetAsync(string userId, string chatTitle, string content, float[] embedding)
    {
        var point = new PointStruct
        {
            Id = new PointId { Uuid = Guid.NewGuid().ToString() },
            Vectors = new Vectors { Vector = new Vector { Data = { embedding } } },
        };

        point.Payload.Add("userId", new Value { StringValue = userId });
        point.Payload.Add("chatTitle", new Value { StringValue = chatTitle });
        point.Payload.Add("content", new Value { StringValue = content });

        await _client.UpsertAsync(CollectionName, new[] { point });
    }

    public async Task<List<(string content, float score)>> SearchRelevantSnippetsAsync(
        string userId, float[] embedding, int topK = 5)
    {
        var filter = new Filter
        {
            Must =
            {
                new Condition
                {
                    Field = new FieldCondition
                    {
                        Key = "userId",
                        Match = new Match { Keyword = userId } // Fix: Replace 'MatchCondition' with 'Match' and use 'Keyword' property  
                    }
                }
            }
        };

        var results = await _client.SearchAsync(
            CollectionName,
            embedding,
            filter: filter,
            limit: (uint)topK
        );

        return results.Select(r => (
            r.Payload["content"].StringValue,
            (float)r.Score
        )).ToList();
    }
}