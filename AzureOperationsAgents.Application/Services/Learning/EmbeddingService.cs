using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using AzureOperationsAgents.Core.Interfaces.Learning;
using Microsoft.Extensions.Configuration;
using AzureOperationsAgents.Core.Models.Learning;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace AzureOperationsAgents.Application.Services.Learning;

public class EmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly string _openaiApiKey;
    private readonly string _openaiEmbeddingUrl;
    private readonly string _openaiEmbeddingModel;
    private readonly IKnowledgeRepository _knowledgeRepository;

    public EmbeddingService(IConfiguration configuration, IKnowledgeRepository knowledgeRepository)
    {
        _httpClient = new HttpClient();
        _openaiApiKey = configuration["OpenAIKey"] ?? throw new ArgumentNullException(nameof(configuration), "OpenAIKey configuration is missing");
        _openaiEmbeddingUrl = configuration["OpenAIEmbeddingEndpoint"] ?? "https://api.openai.com/v1/embeddings";
        _openaiEmbeddingModel = configuration["OpenAIEmbeddingModel"] ?? "text-embedding-ada-002";

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _openaiApiKey);
        _knowledgeRepository = knowledgeRepository;
    }

    public async Task<float[]> GetEmbeddingAsync(string text, CancellationToken cancellationToken)
    {
        var payload = new
        {
            input = text,
            model = _openaiEmbeddingModel
        };

        var request = new HttpRequestMessage(HttpMethod.Post, _openaiEmbeddingUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var jsonDoc = JsonDocument.Parse(content);

        var embedding = jsonDoc.RootElement
            .GetProperty("data")[0]
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();

        return embedding;
    }

    public async Task<IEnumerable<KnowledgeSnippet>> SearchRelevantSnippetsAsync(string userId, string prompt, CancellationToken cancellationToken)
    {
        var promptEmbedding = await GetEmbeddingAsync(prompt, cancellationToken);
        var allSnippets = await _knowledgeRepository.GetSnippetsByUserAsync(userId, cancellationToken);

        var scoredSnippets = allSnippets.Select(snippet =>
            {
                var snippetEmbedding = JsonConvert.DeserializeObject<float[]>(snippet.EmbeddingJson);
                var score = CosineSimilarity(promptEmbedding, snippetEmbedding);
                return new { Snippet = snippet, Score = score };
            })
            .OrderByDescending(x => x.Score)
            .Where(x => x.Score >= 0.75f) // threshold can be adjusted
            .Take(5)
            .Select(x => x.Snippet);

        return scoredSnippets;
    }

    private static float CosineSimilarity(float[] vec1, float[] vec2)
    {
        if (vec1.Length != vec2.Length)
            throw new ArgumentException("Vectors must be of same length");

        float dot = 0f;
        float normA = 0f;
        float normB = 0f;

        for (int i = 0; i < vec1.Length; i++)
        {
            dot += vec1[i] * vec2[i];
            normA += vec1[i] * vec1[i];
            normB += vec2[i] * vec2[i];
        }

        return (float)(dot / (Math.Sqrt(normA) * Math.Sqrt(normB)));
    }
}