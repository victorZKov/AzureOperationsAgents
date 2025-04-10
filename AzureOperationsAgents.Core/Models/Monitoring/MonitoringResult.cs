using System;
using System.Collections.Generic;

namespace AzureOperationsAgents.Core.Models.Monitoring
{
    public class MonitoringResult
    {
        public required string ResourceId { get; set; }
        public required string ResourceName { get; set; }
        public required string ResourceType { get; set; }
        public required string Location { get; set; }
        public required string Status { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public Dictionary<string, double> Metrics { get; set; } = new Dictionary<string, double>();
        public Dictionary<string, string> Tags { get; set; }

        public MonitoringResult()
        {
            Tags = new Dictionary<string, string>();
        }
    }
} 