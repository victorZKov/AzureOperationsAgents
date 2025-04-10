using System;

namespace AzureOperationsAgents.Core.Models.Monitoring
{
    public class OrchestratorNotification
    {
        public required string ResourceId { get; set; }
        public required string AlertName { get; set; }
        public required string Description { get; set; }
        public required string Severity { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public required string Status { get; set; }
        public required string MonitorCondition { get; set; }
    }
} 