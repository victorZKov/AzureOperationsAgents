using System;

namespace AzureOperationsAgents.Core.Models
{
    public class AgentInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Version { get; set; }
        public string Status { get; set; }
        public DateTime LastRunTime { get; set; }
    }
}