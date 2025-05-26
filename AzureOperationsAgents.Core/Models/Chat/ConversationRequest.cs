using System.Text.Json.Serialization;

namespace AzureOperationsAgents.Core.Models.Chat
{
    public class ConversationRequest
    {
        [JsonPropertyName("prompt")]
        public string Prompt { get; set; } = string.Empty;

        [JsonPropertyName("engineName")]
        public string EngineName { get; set; } = string.Empty;

        [JsonPropertyName("modelName")]
        public string ModelName { get; set; } = string.Empty;
        
        [JsonPropertyName("language")]
        public string Language { get; set; } = "en";

        // Optional: To associate with an existing chat
        [JsonPropertyName("chatHeaderId")]
        public int? ChatHeaderId { get; set; }
    }
}

