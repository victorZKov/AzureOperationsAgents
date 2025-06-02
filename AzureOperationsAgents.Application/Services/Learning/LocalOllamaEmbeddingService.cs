using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Configuration;
using AzureOperationsAgents.Core.Interfaces.Learning;

namespace AzureOperationsAgents.Application.Services.Learning;

public class LocalOllamaEmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly IUserConfigurationService _configurationService;

    public LocalOllamaEmbeddingService(HttpClient httpClient, IUserConfigurationService configurationService)
    {
        _httpClient = httpClient;
        _configurationService = configurationService;
    }

    public async Task<float[]> GetEmbeddingAsync(string text, CancellationToken cancellationToken)
    {
        // Obtiene la URL personalizada para este usuario
        string ollamaServer = await _configurationService.GetOllamaServerForUserAsync("userId");  // aquí pasa el userId que tengas disponible
        string apiUrl = $"{ollamaServer}/api/embeddings";

        var payload = new
        {
            model = "mxbai-embed-large",
            prompt = text
        };

        var request = new HttpRequestMessage(HttpMethod.Post, apiUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json")
        };

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var json = JsonDocument.Parse(content);

        var embeddingArray = json.RootElement
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();

        return embeddingArray;
    }
}