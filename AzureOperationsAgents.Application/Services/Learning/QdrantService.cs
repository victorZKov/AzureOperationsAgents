using AzureOperationsAgents.Core.Interfaces.Learning;
using Qdrant.Client;
using Qdrant.Client.Grpc;
using static Qdrant.Client.Grpc.Conditions;

public class QdrantService : IQdrantService
{
    private readonly QdrantClient _client;
    private const string CollectionName = "user-private-embeddings";

    public QdrantService()
    {
        _client = new QdrantClient("localhost");
    }

    public async Task UpsertSnippetAsync(string userId, string chatTitle, string content, float[] embedding)
    {
        //await _client.DeleteCollectionAsync(CollectionName, cancellationToken: default);
        if (!await _client.CollectionExistsAsync(CollectionName, cancellationToken: default))
        {
            await _client.CreateCollectionAsync(
                CollectionName,
                new VectorParams()
                {
                    Size = Convert.ToUInt64(embedding.Length),
                    Distance = Distance.Cosine
                },
                cancellationToken: default
            );
        }
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
