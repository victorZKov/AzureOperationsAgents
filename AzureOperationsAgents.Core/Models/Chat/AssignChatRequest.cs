using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models.Chat;

public class AssignChatRequest
{
    [JsonPropertyName("projectId")]
    public int ProjectId { get; set; }
}