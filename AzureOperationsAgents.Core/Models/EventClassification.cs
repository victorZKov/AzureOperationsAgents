using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models;

public class EventClassification
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("eventId")]
    public string EventId { get; set; } = string.Empty;

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("eventData")]
    public Dictionary<string, object> EventData { get; set; } = new();

    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("severity")]
    public string Severity { get; set; } = string.Empty;

    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }

    [JsonPropertyName("classificationReason")]
    public string ClassificationReason { get; set; } = string.Empty;

    [JsonPropertyName("suggestedActions")]
    public List<string> SuggestedActions { get; set; } = new();
} 