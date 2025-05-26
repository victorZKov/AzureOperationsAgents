namespace AzureOperationsAgents.Core.Models.Backend
{
    public class AgentLogEntry
    {
        public DateTime Timestamp { get; set; }
        public string? Level { get; set; }
        public string? Message { get; set; }
    }
}