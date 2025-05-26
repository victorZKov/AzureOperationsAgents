using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models.Chat;

public class AddMessageRequest
{
    [JsonPropertyName("sender")]
    public string Sender { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("engineName")]
    public string? EngineName { get; set; }

    [JsonPropertyName("modelName")]
    public string? ModelName { get; set; }
}