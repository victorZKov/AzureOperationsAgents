namespace AzureOperationsAgents.Core.Entities
{
    public class ModelEntity
    {
        public int Id { get; set; }
        public string EngineName { get; set; } = string.Empty; // "OpenAI", "Ollama"
        public string ModelName { get; set; } = string.Empty; // "gpt-3.5-turbo", "llama2"
        public string DisplayName => $"{EngineName} {ModelName}"; // Modified to combine EngineName and ModelName
    }
}

