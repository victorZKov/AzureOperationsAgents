using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models.Chat;

public class CreateChatRequest
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
}