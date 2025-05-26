namespace AzureOperationsAgents.Core.Models.Learning
{
    public class ExperienceLog
    {
        public string? Id { get; set; }
        public string? AgentId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Content { get; set; }
        public string? Type { get; set; }
    }
}