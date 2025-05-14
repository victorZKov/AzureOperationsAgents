using System.Net.Http;
using System.Text;
using System.Text.Json;
using AzureOperationsAgents.Core.Interfaces.Classification;
using AzureOperationsAgents.Core.Models.Classification;
using AzureOperationsAgents.Imfrastructure.Interfaces;
using Microsoft.Extensions.Logging;

public class EventClassificationService : IEventClassificationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EventClassificationService> _logger;
    private readonly IEventClassificationRepository _repository;

    public EventClassificationService(
        HttpClient httpClient,
        ILogger<EventClassificationService> logger,
        IEventClassificationRepository repository)
    {
        _httpClient = httpClient;
        _logger = logger;
        _repository = repository;
    }

    public async Task<EventClassification> ClassifyEventAsync(EventClassification input)
    {
        var systemPrompt = """
            You are a backend service that classifies system events.
            Given the event context, output a JSON object with the following fields:
            - category: short event category
            - severity: L1, L2, or L3
            - confidence: a number from 0 to 1
            - classificationReason: brief explanation
            - suggestedActions: a JSON array of string actions
        """;

        var userPrompt = $"Event Data:\n{JsonSerializer.Serialize(input.EventData, new JsonSerializerOptions { WriteIndented = true })}";

        var payload = new
        {
            model = "mistral:latest",
            prompt = $"{systemPrompt}\n\n{userPrompt}",
            stream = false
        };

        var requestContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("http://localhost:11434/api/generate", requestContent);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Ollama error: {Error}", error);
            throw new Exception($"Ollama failed: {response.StatusCode}");
        }

        var json = await response.Content.ReadAsStringAsync();

        EventClassification enriched;
        try
        {
            var parsed = JsonSerializer.Deserialize<OllamaResponse>(json);
            enriched = JsonSerializer.Deserialize<EventClassification>(parsed?.Response ?? "") ?? throw new Exception("Empty or invalid classification");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse classification response");
            throw;
        }

        enriched.EventId = input.EventId;
        enriched.Source = input.Source;
        enriched.Timestamp = input.Timestamp;
        enriched.EventData = input.EventData;

        await _repository.SaveAsync(enriched);
        return enriched;
    }

    public Task<EventClassification> GetClassificationAsync(string id) =>
        _repository.GetByIdAsync(id);

    public Task<List<EventClassification>> GetClassificationsByCategoryAsync(string category) =>
        _repository.GetByCategoryAsync(category);

    public Task<List<EventClassification>> GetClassificationsBySeverityAsync(string severity) =>
        _repository.GetBySeverityAsync(severity);

    private class OllamaResponse
    {
        public string Response { get; set; } = string.Empty;
    }
}