using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureOperationsAgents.Core.Interfaces.Learning;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Qdrant.Client;
using Qdrant.Client.Grpc;

public class QdrantService : IQdrantService
{
    private readonly QdrantClient _client;
    private const string CollectionName = "user-private-embeddings";

    public QdrantService(QdrantClient client)
    {
        _client = client;
    }

    public async Task UpsertSnippetAsync(string userId, string chatTitle, string content, float[] embedding)
    {
        var point = new PointStruct
        {
            Id = Guid.NewGuid().ToString(),
            Vectors = new Vectors { Vector = { embedding } },
            Payload = new Struct
            {
                Fields =
                {
                    { "userId", Value.ForString(userId) },
                    { "chatTitle", Value.ForString(chatTitle) },
                    { "content", Value.ForString(content) }
                }
            }
        };

        var upsertRequest = new UpsertPoints
        {
            CollectionName = CollectionName,
            Points = { point }
        };

        await _client.UpsertAsync(upsertRequest);
    }

    public async Task<List<(string content, float score)>> SearchRelevantSnippetsAsync(string userId, float[] embedding, int topK = 5)
    {
        var filter = new Filter
        {
            Must =
            {
                new Condition
                {
                    FieldCondition = new FieldCondition
                    {
                        Key = "userId",
                        Match = new Match
                        {
                            Keyword = userId
                        }
                    }
                }
            }
        };

        var searchRequest = new SearchPoints
        {
            CollectionName = CollectionName,
            Vector = { embedding },
            Limit = (uint)topK,
            Filter = filter
        };

        var result = await _client.SearchAsync(searchRequest);

        return result.Results
            .Select(r => (r.Payload.Fields["content"].StringValue, r.Score))
            .ToList();
    }
}