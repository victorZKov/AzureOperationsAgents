using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models.Execution;

public class ScriptExecution
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("scriptId")]
    public string ScriptId { get; set; } = string.Empty;

    [JsonPropertyName("executionTime")]
    public DateTime ExecutionTime { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("output")]
    public string Output { get; set; } = string.Empty;

    [JsonPropertyName("error")]
    public string Error { get; set; } = string.Empty;

    [JsonPropertyName("duration")]
    public TimeSpan Duration { get; set; }

    [JsonPropertyName("parameters")]
    public Dictionary<string, string>? Parameters { get; set; } = new();
} 